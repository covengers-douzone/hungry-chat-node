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
        userLeave,
        getUsers,
        participantJoin,
        unknownJoin,
        unknownLeave,
        getCurrentParticipant,
        getUserNoParticipants,
        getCurrentUnknown,
        participantLeave,
        getRoomParticipants
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
        secretToken: 'zVYY3tRyhLRYAEbnfY',

        // Set the custom APM Server URL (default: http://localhost:8200)
        serverUrl: 'https://ec98d0429d8745c48b2c2df8e63e1189.apm.eastus2.azure.elastic-cloud.com:443',

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

        socket.on("deleteMessage", ({roomNo, chatNo}, callback) => {
             io.to(roomNo).emit('deleteMessage', {
                 chatNo: chatNo,
                 room: roomNo,
                 users: getRoomParticipants(roomNo)
             })
             callback({
                 status: 'ok'
             })

         })


        socket.on("createdRoom",(invitedMembers, callback)=> {
            const currentUsers = getUsers().map(user => Number(user.userLocalStorage.userNo))
            console.log('invitedMembers',invitedMembers,currentUsers)
            currentUsers.map(currentUser => {
                io.to('user'+currentUser).emit('createRoom');
            })

            callback({
                 status: 'ok'
             })
        })

        // ????????? ???????????? ????????? ??????
        socket.on('joinUser', async ({user}) => {
            const user_ = userJoin(socket.id,user);

            const subClient = {
                socketid: socket.id,
                subClient: redis.createClient({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT})
            }

            const chatService = require('./services/chat');
            const roomNoList = await chatService.joinUser({
                userNo: Number(user.userNo)
            });

            // ??????????????? ?????? ??? ???????????????
            roomNoList.map(roomNo => {
                subClient['subClient'].subscribe(roomNo);
            });
            subClient['subClient'].on('message', (roomName, message) => {
                // message : JavaScript:?????????:??????~:3:05 pm
                const [redisRoomNo, redisUserno, chatNo, redisMessage, redisHour, redisMin, notReadCount] = message.split(':');

                socket.emit('getMessage', {
                    socketUserNo: redisUserno,
                    roomNo: redisRoomNo
                });
            })
            subClients.push(subClient);
            socket.join('user'+user.userNo);

            io.emit('currentUsers',{
                users: getUsers()
            });
        })

        // unknown ????????? ????????? ??????
        socket.on('unknown', (userNo, memeberCheck) => {
             socketMemberCheck = memeberCheck;
             const unknown = unknownJoin(socket.id, userNo)
             userNoTest = userNo
         })
        
        // ????????? ?????? join ??? ??????
         socket.on('joinParticipant', ({nickName, roomNo, participantNo, userNo}, callback) => {
             const user = participantJoin(socket.id, nickName, roomNo, participantNo, userNo);
             roomNoTest = roomNo

             // sub
             const subClient = {
                 socketid: socket.id,
                 subClient: redis.createClient({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT})
             }
 
             subClient['subClient'].subscribe(`${roomNo}`);
             subClient['subClient'].on('message', (roomName, message) => {
                 // message : JavaScript:?????????:??????~:3:05 pm
                 const [redisRoomNo, redisUserno, chatNo, redisMessage, redisHour, redisMin, notReadCount] = message.split(':');
                 console.log("roomName", roomName, "message", message, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!@@@@@@@@@@@@@@@@")
                 socket.emit('message', {
                     socketUserNo: redisUserno,
                     chatNo: chatNo
                 });
             })
             subClients.push(subClient);
 
             socket.join(user.room); // room ??????
             socket.join('participant'+userNo);
             callback({
                 status: 'ok'
             })
             //  Send users and room info to insert innerText of navigation bar
             io.to(user.room).emit('roomUsers', {
                 room: user.room,
                 users: getRoomParticipants(user.room)
             })
         });

        socket.on("kick" , ({roomNo,userNo},callback) => {
            //  Send users and room info to insert innerText of navigation bar
            console.log("roomNo" , roomNo)
            console.log("userNo" , userNo)
            console.log('getRoomParticipants',getRoomParticipants(roomNo))
            console.log('getUserNoParticipants',getUserNoParticipants(roomNo))

            let participant;
            getRoomParticipants(roomNo).map((e,i) => {

                if(e.userNo ===  userNo ){
                    participant = getCurrentParticipant(e.id);
                   participantLeave(e.id)

         

                }else{

                }
            })
        
            console.log("participant" ,participant)

            if(participant === undefined){

                                   participant = {
                                          userNo : 1,
                                   }
            }
            callback({
                status: 'ok'
            })
            io.to(roomNo).emit('kick', {
                roomNo: roomNo,
                participant: participant
            })

            // io.to('participant'+userNo).emit('kick')
        })

         // Runs when client disconnects
         socket.on('disconnect', async () => {

             // user leave
             const user = userLeave(socket.id);
             if (user) {

                  // ?????? ????????? user ???????????? ??????
                 io.emit('currentUsers',{
                     users: getUsers()
                 });

                  //unsubscribe && ?????? ?????????
                  const subClient = subClients.filter((subClient) => {
                      return (subClient['socketid'] === socket.id)
                  });
                  if (subClient && Array.isArray(subClient) && subClient[0]) {
                      subClient[0]['subClient'].unsubscribe();
                      subClient[0]['subClient'].quit();
                      subClients.splice(subClients.indexOf(subClient[0]));
                  }
              }

             // unknown user leave
             const unkwnown = await unknownLeave(socket.id);
             if(unkwnown){

                  const chatController = require('./controllers/chat');

                 if (socketMemberCheck === false) {
                     // ??? ????????? ??? ????????????
                     const chatService = require('./services/chat');
                     const chatRepository = require('./repository/chat');
                     const roomNoList = await chatService.joinUser({
                         userNo: Number(unkwnown.userNo)
                     });

                     // ??? ?????? ??????????????? - 1  ?????? ???
                     roomNoList.map(async (e, i) => {
                         console.log("roomNoList" , e)
                         await chatRepository.updateHeadCount({type: "exit", roomNo: e});
                     })

                     await chatRepository.deleteUnknown({userNo: unkwnown.userNo});
                 }
             }

             // participant leave (participant : room ?????? user)
             const participant = participantLeave(socket.id);
             if (participant) {
                 const chatService = require('./services/chat');
                 // ??????: ????????? ?????? ?????? ?????? ??????
                 await chatService.leftRoom({
                     participantNo: participant.participantNo
                 });
 
                 // ?????? ????????? user ???????????? ??????
                 io.to(participant.room).emit('roomUsers', {
                     room: participant.room,
                     users: getRoomParticipants(participant.room)
                 });

                 //unsubscribe && ?????? ?????????
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
             console.log("GhostRoom ??????");
         } else {
             console.log("GhostRoom ??????");
         }
     });
 })();