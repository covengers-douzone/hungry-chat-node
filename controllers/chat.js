const models = require('../models');
const redis = require('redis');
const client = redis.createClient({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT})
const pubClient = client.duplicate();
const moment = require('moment');
const {Op} = require('sequelize');
const fs = require('fs');
const {user} = require("../redis-conf");
const chatService = require('../services/chat');
const {sequelize} = require("../models");

module.exports = {
    /*
   *  SELECT * FROM Friend A , user B
   *  WHERE 1 = 1
   *  AND A.userNo = {}
   * */
    getFriendList: async (req, res, next) => {
        try {
            const userNo = req.body.userNo;
            const results = await models.User.findAll({
                attributes: {
                    exclude: ['password', 'token']
                },
                include: [
                    {
                        model: models.Friend, as: 'Friends', required: true
                        , where: {
                            [`$Friends.userNo$`]: userNo
                        }
                    }
                ],
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            next(err);
        }
    },
    deleteFriend: async (req, res) => {
        try {
            // 1. 받아온 FriendNO 로 유저를 조회 및 no를 가져온다.(err -> 잘못된 이메일 입력)
            // 2. 받아온 no를 통해 친구 리스트를 출력한다. 만약 이미 존재하는 친구일 경우 fail을 응답한다.
            // 3. 가져온 no를 friendNo로, req로 받아온 no를 userNo로 하여 insert 한다.
            // 4. response
            const friendNo = req.body.friendNo // 친구의 이메일 계정 정보.
            const userNo = req.body.userNo; // 사용자.

            const results = await models.Friend.destroy({
                where:
                    {
                        userNo: userNo,
                        friendNo: friendNo
                    }
            })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });


        } catch (e) {
            console.log(e.message);
        }
    },
    addFriend: async (req, res) => {
        try {
            console.log("addFriend")
            // 1. 받아온 이메일 주소로 유저를 조회 및 no를 가져온다.(err -> 잘못된 이메일 입력)
            // 2. 받아온 no를 통해 친구 리스트를 출력한다. 만약 이미 존재하는 친구일 경우 fail을 응답한다.
            // 3. 가져온 no를 friendNo로, req로 받아온 no를 userNo로 하여 insert 한다.
            // 4. response
            const username = req.body.username // 친구의 이메일 계정 정보.
            console.log(req.body);
            const userNo = req.body.userNo; // 사용자.

            // (1) 이메일 정보로 친구 정보 가져오기
            const result = await models.User.findOne({
                attributes: {
                    exclude: ['password', 'phoneNumber', 'token']
                },
                where: {
                    username: username
                }
            })

            const results = await models.User.findAll({
                attributes: {
                    exclude: ['password', 'phoneNumber', 'token']
                },
                include: [
                    {
                        model: models.Friend, as: 'Friends', required: true
                        , where: {
                            [`$Friends.userNo$`]: userNo,
                        }
                    }
                ],
            });


            if (!result) {
                res
                    .status(200)
                    .send({
                        result: 'fail',
                        data: null,
                        message: "이메일이 일치하지 않습니다. 다시 한번 확인해주세요."
                    });
            } else if (result.no.toString() === userNo.toString()) {
                res
                    .status(200)
                    .send({
                        result: 'fail',
                        data: null,
                        message: "잘못된 요청입니다. 다시 시도해주세요."
                    });
            } else if (results.map((result) => {
                if (result.username === username) {
                    res
                        .status(200)
                        .send({
                            result: 'fail',
                            data: null,
                            message: "이미 존재하는 친구입니다. 다시 한번 확인해주세요."
                        });
                }
            }))

                await models.Friend.create({
                    userNo: userNo,
                    friendNo: result.no
                })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: result,
                    message: null
                });

        } catch (e) {
            console.log(e.message);
        }
    },
    getFollowerList: async (req, res, next) => {
        try {
            const userNo = req.body.userNo;
            let friendList = [];
            let followerList = [];


            // 내가 친구 추가
            const friends = (await models.Friend.findAll({
                where: {
                    userNo: userNo
                }
            })).map(friend => friendList.push(friend.friendNo));


            // 나를 친구추가한 전체( 팔로워, 친구 통합 )
            const friendsAndFollowers = (await models.Friend.findAll({
                where: {
                    friendNo: userNo
                }
            })).map(friendsAndFollower => friendsAndFollower.userNo)


            friendsAndFollowers.map(friendsAndFollowerNo => {
                if (!friendList.includes(friendsAndFollowerNo)) {
                    followerList.push(friendsAndFollowerNo);
                }
            })


            const results = await models.User.findAll({
                attributes: {
                    exclude: ['password', 'token']
                },
                where: {
                    no: {
                        [Op.in]: followerList
                    }
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });

        } catch (err) {
            res
                .status(500)
                .send({
                    result: 'fail',
                    data: null,
                    message: "getFollowerList Error occurred"
                });
        }
    },
    deleteChat: async (req, res, next) => {
        try {
            if (req.body.openChatHostCheck) {
                await models.Chat.destroy({
                    where: {
                        roomNo: req.body.roomNo
                    }
                })
                await models.Participant.destroy({
                    where: {
                        roomNo: req.body.roomNo
                    }
                })
                await models.Room.destroy({
                    where: {
                        no: req.body.roomNo
                    }
                })
                res
                    .status(200)
                    .send({
                        result: 'success',
                        data: null,
                        message: null
                    });
            } else {
                await models.Participant.update({userNo: 1}, {
                    where: {
                        no: req.body.participantNo
                    }
                })
            }
            res
                .status(200)
                .send({
                    result: 'success',
                    data: null,
                    message: null
                });
        } catch (err) {
            console.error(`Fetch-Api : getRoomList Error : ${err.status} ${err.message}`);
        }
    },

    getOpenChatRoomList: async (req, res, next) => {
        try {
            const type = req.params.type
            const roomList = (await models.Room.findAll({
                where: {
                    type: type
                }
            })).map(room => {
                return room.no
            });

            console.log("roomList :::: ", roomList);

            const results = await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true,
                        include: [
                            {
                                model: models.User, required: true
                                , attributes: {
                                    exclude: ['password', 'token']
                                }
                            }
                        ]
                    }
                ],
                where: {
                    no: {
                        [Op.in]: roomList
                    }
                }
            });


            console.log("results ::: ", results);

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            console.error(`Fetch-Api : getOpenChatRoomList Error : ${err.status} ${err.message}`);
        }
    },
    getUserByNo: async (req, res) => {

        try {
            const result = await models.User.findOne({
                attributes: {
                    exclude: ['password', 'phoneNumber', 'token']
                },
                where: {
                    no: req.params.userNo
                }
            })

            res
                .status(200)
                .send({
                    result: 'success',
                    data: result,
                    message: null
                });
        } catch (err) {
            console.error(`Fetch-Api : getUserByNo Error : ${err.status} ${err.message}`);
        }
    },
    updateSettings: async (req, res) => {
        try {
            let {file, body: {nickname, password, userNo, comments}} = req;
            let fileUrl;

            console.log(file);

            const result = await models.User.findOne({
                attributes: {
                    exclude: ['phoneNumber', 'token']
                },
                where: {
                    no: userNo
                }
            })

            password = (password === "null" ? result.password : password);
            fileUrl = (file === undefined ? result.profileImageUrl : process.env.URL + process.env.UPLOADIMAGE_STORE_LOCATION + file.filename)

            await models.User.update({
                profileImageUrl: fileUrl,
                comments: comments,
                nickname: nickname,
                password: password
            }, {
                where: {
                    no: userNo
                }
            })

            res
                .status(200)
                .send({
                    result: 'success',
                    data: fileUrl,
                    message: null
                });
        } catch (err) {
            console.error(`Fetch-Api : getNickname Error : ${err.status} ${err.message}`);
        }
    },

    deleteUserInfo: async (req, res) => {
        try {
            const userNo = req.body.data.userNo; // 사용자.
            const isDeleted = req.body.data.isDeleted; // 삭제 상태값.

            console.log("idDeleted:       ", isDeleted);
            console.log("userNo:       ", userNo);

            const result = await models.User.findOne({
                attributes: {
                    exclude: ['phoneNumber', 'token']
                },
                where: {
                    no: userNo
                }
            })

            //password = (password === "null" ? result.password : password);

            await models.User.update({
                isDeleted: isDeleted
            }, {
                where: {
                    no: userNo
                }
            })

            console.log("profile delete All");

            res
                .status(200)
                .send({
                    result: 'success',
                    message: null
                });
        } catch (err) {
            console.error(`Fetch-Api : getNickname Error : ${err.status} ${err.message}`);
        }
    },

    getRoomList: async (req, res, next) => {
        try {
            const userNo = req.params.userNo;

            const roomList = (await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.userNo$`]: userNo
                        }
                    }
                ]
            })).map(room => {
                return room.no
            });

            const results = await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true,
                        include: [
                            {
                                model: models.User, required: true
                                , attributes: {
                                    exclude: ['password', 'token']
                                }
                            }
                        ]
                    }
                ],
                where: {
                    no: {
                        [Op.in]: roomList
                    }
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            console.error(`Fetch-Api : getRoomList Error : ${err.status} ${err.message}`);
        }
    },
    getChatList: async (req, res, next) => {
        try {
            const roomNo = req.params.roomNo;
            const limit = req.params.limit;
            const offset = req.params.offset
            const results = await models.Chat.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo
                        }
                    }
                ],
                order: [['no', 'ASC']],
                limit: Number(limit),
                offset: Number(offset)

            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            res
                .status(200)
                .send({
                    result: 'fail',
                    data: null,
                    message: "System Error"
                });
        }
    },
    getChatListCount: async (req, res, next) => {
        try {
            const roomNo = req.params.roomNo;

            const results = await models.Chat.findAndCountAll({
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo
                        }
                    }
                ],
                order: [['no', 'ASC']],

            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            res
                .status(200)
                .send({
                    result: 'fail',
                    data: null,
                    message: "System Error"
                });
        }
    },
    getChatSearchList: async (req, res, next) => {
        try {
            const roomNo = req.params.roomNo;
            const limit = req.params.limit;
            const offset = req.params.offset
            const contents = req.params.contents

            console.log("getChatSearchList @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" ,roomNo , limit , offset , contents)
            const results = await models.Chat.findAll({
                where : {
                    contents :{
                        // [Op.like]: "%" + contents + "%"
                        [Op.like]: contents
                    }
                },
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo,
                        }
                    }
                ],
                order: [['no', 'ASC']],
                limit: Number(limit),
                offset: Number(offset)

            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            res
                .status(200)
                .send({
                    result: 'fail',
                    data: null,
                    message: "System Error"
                });
        }
    },
    getChat: async (req, res, next) => {
        try {
            const chatNo = req.params.chatNo;

            const results = await models.Chat.findOne({
                where: {
                    no: chatNo
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    getHeadCount: async (req, res, next) => {
        try {
            const headCount = await models.Room.findOne({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.no$`]: req.body.participantNo
                        }
                    }
                ]
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: headCount.headCount,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    send: async (req, res, next) => {
        try {
            const {file, body: {roomNo, participantNo, text, headCount: notReadCount}} = req;

            let contents;
            let type;
            if (!file) {
                contents = text;
                type = "TEXT";
            } else if(file) {
                const fileType = file.mimetype.split('/')[0];
                console.log("filepath: ",   fileType);
                if(fileType === 'video'){
                    type = "VIDEO"
                } else if(fileType === 'image'){
                    type = "IMG"
                }
                contents = file.path;
            }

            const results = await models.Chat.create({
                roomNo, type, contents, notReadCount, participantNo
            });
            await pubClient.publish(`${roomNo}`, `${roomNo}:${participantNo}:${results.no}:${contents}:${moment().format('h:mm a')}:${notReadCount}`)
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            next(err);
        }
    },
    // UPDATE chat c
    //  INNER JOIN participant p
    //     ON c.participantNo = p.no -- c.roomNo = p.roomNo
    //    SET c.notReadCount =  c.notReadCount - 1
    //    where p.lastReadAt < c.createdAt
    //    AND p.no = 1
    //    ;
    updateRoomNotReadCount: async (req, res, next) => {
        try {
            const participantNo = req.body.participantNo;

            const participant = await models.Participant.findOne({
                where: {
                    no: participantNo
                }
            });
            const results = await models.Chat.update({
                notReadCount: models.sequelize.Sequelize.literal('notReadCount - 1')
            }, {
                where: {
                    createdAt: {
                        [Op.gt]: participant.lastReadAt
                    },
                    roomNo: participant.roomNo
                }
            })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    updateSendNotReadCount: async (req, res, next) => {
        try {
            const chatNo = req.body.chatNo;
            const results = await models.Chat.update({
                'notReadCount': models.sequelize.Sequelize.literal('notReadCount - 1')
            }, {
                where: {
                    no: chatNo
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    createRoom: async (req, res, next) => {
        try {
            const title = req.body.title;
            const content = req.body.content;
            const headCount = req.body.headCount;
            const type = req.body.type;
            const password = req.body.password;

            const results = await models.Room.create({
                title, content, password, type, headCount
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results.no,
                    message: null
                });
        } catch (err) {
            next(err);
        }
    },
    createParticipant: async (req, res, next) => {
        try {
            const role = req.body.role;
            const status = 0;
            const lastReadAt = new Date().toString();
            const roomNo = req.body.roomNo;
            const userNo = req.body.userNo;
            const nickName = (await models.User.findOne({
                where: {
                    no: userNo
                }
            })).nickname;

            const results = await models.Participant.create({
                role, status, lastReadAt, roomNo, userNo, nickName
            })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            next(err);
        }
    },
    updateStatus: async (req, res, next) => {
        try {
            const ParticipantNo = req.body.ParticipantNo;
            const status = req.body.status;

            const results = await models.Participant.update({
                status: status
            }, {
                where: {
                    no: ParticipantNo
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            next(err);
        }
    },

    /*
       SELECT  min(A.no) FROM chat A , participant B
       WHERE 1 = 1
       AND A.participantNo = B.no
       AND A.roomNo = b.roomNo
       AND A.createdAt < B.LastReadAt
    * */
    getLastReadAt: async (req, res, next) => { // 마지막 읽은 시각을 찾는다
        try {
            const ParticipantNo = req.body.ParticipantNo;

            const results = await models.Chat.findOne({
                attributes: ['no'],
                include: [
                    {
                        model: models.Participant, as: 'Participant',
                        attributes: ["no"]
                    }
                ]
            })
        } catch (err) {
            next(err);
        }
    },
    updateLastReadAt: async (req, res, next) => {
        try {
            const participantNo = req.body.participantNo;
            const results = await models.Participant.update({
                lastReadAt: new Date().toString()
            }, {
                where: {
                    no: participantNo
                }
            })

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    // 마지막 읽은메시지의 No값을 받아온다. Partials - Chat
    getLastReadNo: async (req, res, next) => {
        try {
            const participantNo = req.body.participantNo;
            const participant = await models.Participant.findOne({
                where: {
                    no: participantNo
                }
            });
            const results = await models.Chat.max('no', {
                where: {
                    roomNo: participant.roomNo,
                    createdAt: {
                        [Op.gt]: participant.lastReadAt
                    }
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    // 마지막 읽은메시지 이후의 리스트의 갯수를 출력한다. Partials - Chat
    getLastReadNoCount: async (req, res, next) => {
        try {
            const participantNo = req.body.participantNo;
            const participant = await models.Participant.findByPk(participantNo);
            const results = await models.Chat.findAndCountAll({
                where: {
                    roomNo: participant.roomNo,
                    createdAt: {
                        [Op.gt]: participant.lastReadAt
                    }
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    getJoinOk: async (req, res, next) => {
        try {
            const roomNo = req.params.roomNo;
            const participantNo = req.params.participantNo;
            const results = await models.Participant.findOne({
                where: {
                    roomNo: roomNo,
                    no: participantNo,
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    //update Chat SET notReadCount = 0 where roomNo = 1
    updateChatZero: async (req, res, next) => {
        try {
            const roomNo = req.body.roomNo;
            const results = await models.Chat.update({
                notReadCount: 0
            }, {
                where: {
                    roomNo: roomNo
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    // ChatNo 삭제  Partials - Chat
    deleteChatNo: async (req, res, next) => {
        try {
            const chatNo = req.params.chatNo;
            const results = await models.Chat.destroy({
                where: {
                    no: chatNo,
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },

    // layer 변경
    joinRoom: async (req, res, next) => {
        try {
            const results = await chatService.joinRoom(req.body);

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            res
                .status(400)
                .send({
                    result: 'fail',
                    data: null,
                    message: e.message
                });
        }
    },
    leftRoom: async (req, res, next) => {
        try {
            const results = await chatService.leftRoom(req.body);
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            res
                .status(400)
                .send({
                    result: 'fail',
                    data: null,
                    message: e.message
                });
        }
    },
    deleteUnknown: async (req, res, next) => {
        try {
            const userNo = req.body.userNo;

            const Partcipant = await models.Participant.update({
                userNo: 1
            }, {
                where: {
                    userNo: userNo,
                }
            });

            const results = await models.User.destroy({
                where: {
                    no: userNo,
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    updateHeadCount: async (req, res, next) => {
        try {
            const type = req.body.type;
            const roomNo = req.body.roomNo;
            let results;
            if (type === "join") {
                results = await models.Room.update({
                    'headCount': models.sequelize.Sequelize.literal('headCount + 1')
                }, {
                    where: {
                        no: roomNo
                    }
                });
            } else if (type === "exit") {
                results = await models.Room.update({
                    'headCount': models.sequelize.Sequelize.literal('headCount - 1')
                }, {
                    where: {
                        no: roomNo
                    }
                });
            }
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
    getFileListInRoom: async (req, res, next) => {
        try {
            const roomNo = req.body.roomNo;
            const type = req.body.type; //file type(TEXT,IMG,...)
            console.log('getFileListInRoom',roomNo,type)
            const results = await models.Chat.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo
                        }
                    }
                ],
                order: [['no', 'ASC']],
                where: {
                    type: type
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (e) {
            next(e);
        }
    },
}