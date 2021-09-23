(function () {
    const express = require('express');
    const session = require('express-session');
    const http = require('http');
    const path = require('path');
    const dotenv = require('dotenv');
    const socketio = require('socket.io');
    const redis = require('redis');
    const cors = require('cors'); // cross origin
    const {
        userJoin,
        unknownJoin,
        unknownLeave,
        getCurrentUser,
        getCurrentUnknown,
        userLeave,
        getRoomUsers
    } = require('./utils/users.js');


    const corsOptions = {
        origin: true,
        credentials: true,
    };

    // 1. Startup Arguments
    const argv = require('minimist')(process.argv.slice(2));

    // 2. Environment Variables
    dotenv.config({path: path.join(__dirname, 'app.config.env')})

    // 3. Process Title(Name)
    process.title = argv.name;

    // 4. Application Routers
    const {applicationRouter} = require('./routes');

    // 5. Logger
    const logger = require('./logging');

    // 6. Application Setup
    const application = express()
        // 6-0. cross origin
        .use(cors(corsOptions))
        // 6-1. Session Environment
        .use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }))
        // 6-2. Body Parsers
        .use(express.json())
        .use(express.urlencoded({extended: true}))
        // 6-3. Static
        .use(express.static(path.join(__dirname, process.env.STATIC_RESOURCES_DIRECTORY)))
        // 6-4. View Engine Setup
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs');

    // 7. Application Router Setup
    applicationRouter.setup(application);


    // 8. Server Startup
    const server = http.createServer(application)
        .on('listening', function () {
            logger.info('Listening on port ' + process.env.PORT);
        })
        .on('error', function (error) {
            if (error.syscall !== 'listen') {
                throw error;
            }
            switch (error.code) {
                case 'EACCES':
                    logger.error('Port ' + process.env.PORT + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger.error('Port ' + process.env.PORT + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }

        })
        .listen(process.env.PORT);

        var apm = require('elastic-apm-node').start({

            // Override the service name from package.json
            // Allowed characters: a-z, A-Z, 0-9, -, _, and space
            serviceName: 'covengers',
    
            // Use if APM Server requires a secret token
            secretToken: 'sx9oKfnfIAWnx0j5ip',
    
            // Set the custom APM Server URL (default: http://localhost:8200)
            serverUrl: 'https://e6ced939bb724739ba971111add5e1a7.apm.us-central1.gcp.cloud.es.io:443',
    
            // Set the service environment
            environment: 'production'
            })


    const io = socketio(server);
    //let subList = []
    let info = {}
    let roomNoTest
    let userNoTest
    let socketMemberCheck = true
    const subClients = [];


    io.on('connection', socket => {


        socket.on('unknown', (userNo, memeberCheck) => {
            socketMemberCheck = memeberCheck;
            const unknown = unknownJoin(socket.id, userNo)
            userNoTest = userNo
            console.log("unknown@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", unknown)
        })
        socket.on('join', ({nickName, roomNo, participantNo, userNo}, callback) => {
            const user = userJoin(socket.id, nickName, roomNo, participantNo, userNo);
            roomNoTest = roomNo


            // sub
            const subClient = {
                socketid: socket.id,
                subClient: redis.createClient({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT})
            }


            subClient['subClient'].subscribe(`${roomNo}`);
            subClient['subClient'].on('message', (roomName, message) => {
                // message : JavaScript:배유진:안녕~:3:05 pm
                const [redisRoomNo, redisUserno, chatNo, redisMessage, redisHour, redisMin, notReadCount] = message.split(':');
                console.log("roomName", roomName, "message", message, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!@@@@@@@@@@@@@@@@")
                socket.emit('message', {
                    socketUserNo: redisUserno,
                    chatNo: chatNo
                });
            })
            subClients.push(subClient);

            socket.join(user.room); // room 입장
            callback({
                status: 'ok'
            })
            //  Send users and room info to insert innerText of navigation bar
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        });
        socket.on("deleteMessage", ({roomNo, chatNo}, callback) => {
            io.to(roomNo).emit('deleteMessage', {
                chatNo: chatNo,
                room: roomNo,
                users: getRoomUsers(roomNo)
            })
            callback({
                status: 'ok'
            })

        })


        // Runs when client disconnects
        socket.on('disconnect', async () => {

            const unkwnown = unknownLeave(socket.id);
            if(unkwnown){
                console.log(socket.id)
                const chatController = require('./controllers/chat');
                console.log("unknown disconnect !!!!!!!!!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@")
                if (socketMemberCheck === false) {
                    await chatController.deleteUnknown({
                        body: {
                            userNo: unkwnown.userNo
                        },

                    },   null ,     null)
                }
            }
            const user = userLeave(socket.id);
            if (user) {
                const chatService = require('./services/chat');
                // 회원: 강제로 종료 시킨 경우 대비
                await chatService.leftRoom({
                    participantNo: user.participantNo
                });


                // 나간 사람은 user 목록에서 지움
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });

                //unsubscribe && 객체 없애기
                const subClient = subClients.filter((subClient) => {
                    return (subClient['socketid'] === socket.id)
                });
                if (subClient && Array.isArray(subClient) && subClient[0]) {
                    subClient[0]['subClient'].unsubscribe();
                    subClient[0]['subClient'].quit();
                    subClients.splice(subClients.indexOf(subClient[0]));
                }


            }
        });
    })
    const chat = require('./repository/chat');
    chat.getGhostRoom(() => {
    }).then(r => {
        if (r) {
            console.log("GhostRoom 제거");
        } else {
            console.log("GhostRoom 없음");
        }
    });
})();