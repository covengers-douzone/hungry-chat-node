const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');


const postAuthHeader = [
    {
        name: "Authorization",
        in: "header",
        description: "토큰",
        required: true,
        example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
        schema:{
            type: "string"
        }
    },
    {
        name: "Access-Control-Allow-Headers",
        in: "header",
        description: "Cors",
        required: true,
        value: "Content-Type"
    },
    {
        name: "Access-Control-Allow-Origin",
        in: "header",
        description: "Cors-허용 Origin",
        required: true,
        value: "http://localhost:9999"
    },
    {
        name: "Access-Control-Allow-Method",
        in: "header",
        description: "Cors-Method 형식",
        required: true,
        example: "options, post, get"
    },
    {
        name: "Content-Type",
        in: "header",
        value: "application/json",
        schema:{
            type: "string"
        }
    },
    {
        name: "Accept",
        in: "header",
        value: "application/json",
        schema:{
            type: "string"
        }
    },
    {
        name: "credentials",
        in: "header",
        value: "include",
        schema:{
            type: "string"
        }
    },
]


const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Swagger Chat API by Covengers',
            version: '1.0.1',
            description: 'Chat API with express',
        },
        servers: [
            {
                url: "http://localhost:9999",
                description: "local Server"
            }
        ],
        host: 'localhost:9999',
        basePath: '/',
        contact: {
            email: "dntjd7701@gmail.com"
        },
        schemes: ["http"],
        components: {
            securitySchemes:{
                bearerAuth: {
                    type: "http",
                    name: "Authorization",
                    schema: "bearer",
                    in: "header"
                }
            },
            schemas:{
                "Room": {
                    type:"object",
                    properties:{
                        no:{
                            type:"integer",
                            description:"채팅방 고유 번호"
                        },
                        title:{
                            type:"string",
                            description:"채팅방 제목"
                        },
                        content:{
                            type:"string",
                            description:"채팅방 설명(채팅방 상태 글)"
                        },
                        password:{
                            type:"string",
                            description:"채팅방 비밀번호"
                        },
                        type:{
                            type:"enum",
                            description:"public or private or official"
                        },
                        createdAt:{
                            type:"DATE",
                            description:"채팅방 생성일"
                        },
                        headCount:{
                            type:"integer",
                            description:"채팅방 참여 인원"
                        },
                    }
                },
                "User": {
                    type:"object",
                    properties:{
                        no:{
                            type:"integer",
                            description:"사용자 고유 번호"

                        },
                        username:{
                            type:"string",
                            description:"사용자 이메일"
                        },
                        name:{
                            type:"string",
                            description:"사용자 이름"
                        },
                        phoneNumber:{
                            type:"string",
                            description:"사용자 핸드폰 번호"
                        },
                        password:{
                            type:"text",
                            description:"암호화된 비밀번호"
                        },
                        isDeleted:{
                            type:"integer",
                            description:"0 : 회원,  1: 탈퇴 회원"
                        },
                        backgroundImageUrl:{
                            type:"text",
                            description:"사용자 개인 배경화면"
                        },
                        profileImageUrl:{
                            type:"text",
                            description:"사용자 개인 프로필 이미지"
                        },
                        role:{
                            type:"enum",
                            description:"사용자 권한(USER, ADMIN, UNKNOWN)"
                        },
                        token:{
                            type:"text",
                            description:"사용자의 고유 토큰"
                        },
                        createdAt:{
                            type:"DATE",
                            description:"사용자 회원가입 일시"
                        },
                        nickname:{
                            type:"text",
                            description:"사용자 닉네임"
                        },
                        comments:{
                            type:"text",
                            description:"사용자 상태 글"
                        },
                    }
                },
                "Participant": {
                    type:"object",
                    properties:{
                        no:{
                            type:"integer",
                            description:"채팅방 참여자 고유 번호"

                        },
                        role:{
                            type:"string",
                            description:"채팅방 참여자 권한(HOST, MEMBER)"
                        },
                        status:{
                            type:"integer",
                            description:"채팅방 참여자의 상태 정보(참여중, 참여중이 아님)"
                        },
                        createdAt:{
                            type:"DATE",
                            description:"채팅방 참여자 참여 일시 "
                        },
                        lastReadAt:{
                            type:"DATE",
                            description:"채팅방 참여자가 마지막으로 채팅을 읽은 시간 "
                        },
                        nickname:{
                            type:"string",
                            description:"채팅방 참여자 닉네임"
                        },
                    }
                },
                "Chat": {
                    type:"object",
                    properties:{
                        no:{
                            type:"integer",
                            description:"채팅 고유 번호"

                        },
                        roomNo:{
                            type:"integer",
                            description:"해당되는 채팅방의 고유 번"
                        },
                        type:{
                            type:"enum",
                            description:"채팅 타입(TEXT, IMG)"
                        },
                        createdAt:{
                            type:"DATE",
                            description:"채팅을 보 일시 "
                        },
                        integer:{
                            type:"text",
                            description:"채팅 내용"
                        },
                        notReadCount:{
                            type:"integer",
                            description:"해당하는 채팅을 읽지 않은 참여자의 수"
                        },
                    }
                },
                "Friend": {
                    type: "object",
                    properties: {
                        userNo: {
                            type: "integer",
                            description: "사용자 고유 번호"

                        },
                        friendNo: {
                            type: "integer",
                            description: "친구로 등록되는 상대방의 사용자 고유 번호"
                        },
                    },
                }
            }
        },
        tags: [
            {
                name: 'Room',
                description: "개인방, 오픈 채팅방, 비회원 참여방",
            },
            {
                name: 'Chat',
                description: "채팅 관련 API"
            },
            {
                name: 'User',
                description: "사용자 관련 API"
            },
            {
                name: 'Participant',
                description: "참여자 관련 API"
            }
        ],
        paths: {
            //get
            "/api/roomlist/{userNo}":{
                get:{
                    tags: ["Room"],
                    summary: "사용자의 채팅방 가져오기",
                    parameters:[
                        {
                            name: "userNo",
                            in: "path",
                            description: "사용자의 고유 식별 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/chatlist/{roomNo}/{offset}/{limit}": {
                get:{
                    tags: ["Chat"],
                    summary: "채팅 리스트 조회",
                    parameters:[
                        {
                            name: "roomNo",
                            in: "path",
                            description: "사용자가 선택한 방 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                          name: "offset",
                            in: "path",
                            description: "채팅방 리스트를 나타낼 오프셋",
                            required: true,
                            schema: {
                              type:"integer"
                            }
                        },
                        {
                            name: "limit",
                            in: "path",
                            description: "한번에 나타낼 채팅의 갯수",
                            required: true,
                            schema: {
                                type:"integer"
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/chatlistCount/{roomNo}": {
                get:{
                    tags: ["Chat"],
                    summary: "사용자가 선택한 방의 채팅 갯수 조회",
                    parameters:[
                        {
                            name: "roomNo",
                            in: "path",
                            description: "사용자가 선택한 방 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getChat/{chatNo}": {
                get:{
                    tags: ["Chat"],
                    summary: "채팅 가져오기(단일)",
                    parameters:[
                        {
                            name: "roomNo",
                            in: "path",
                            description: "사용자가 선택한 방 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getOpenChatRoomList/{type}": {
                get:{
                    tags: ["Room"],
                    summary: "채팅 가져오기(단일)",
                    parameters:[
                        {
                            name: "type",
                            in: "path",
                            description: "채팅방 타입(public,private,official)",
                            required: true,
                            schema:{
                                type: "string",
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getUserByNo/{userNo}": {
                get:{
                    tags: ["User"],
                    summary: "사용자 조회하기(단일)",
                    parameters:[
                        {
                            name: "userNo",
                            in: "path",
                            description: "사용자 고유 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getJoinOk/{roomNo}/{participantNo}": {
                get:{
                    tags: ["Participant"],
                    summary: "해당 참여자의 지정 방 참여 정보 조회하기(단일)",
                    parameters:[
                        {
                            name: "roomNo",
                            in: "path",
                            description: "채팅방 고유 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                            name: "participantNo",
                            in: "path",
                            description: "참여자 고유 번호",
                            required: true,
                            schema:{
                                type: "integer",
                            }
                        },
                        {
                            name: "Authorization",
                            in: "header",
                            description: "토큰",
                            required: true,
                            example: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbHNhQGdtYWlsLmNvbSIsInJvbGUiOlsiUk9MRV9VU0VSIl0sImlzcyI6Ii9hcGkvdXNlci9sb2dpbiIsImV4cCI6MTYzMjM2NjE3Nn0.N2CMGWSowZ9SFLBEaxh8AGporgrZ0OE4k2sIazUoEnNwIWmycVkqPXiRcFkvQGOdfeWfKj46DaMNhrHHKgDYfw",
                            schema:{
                                type: "string"
                            }
                        },

                        {
                            name: "Access-Control-Allow-Headers",
                            in: "header",
                            description: "Cors",
                            required: true,
                            value: "Content-Type"
                        },
                        {
                            name: "Access-Control-Allow-Origin",
                            in: "header",
                            description: "Cors-허용 Origin",
                            required: true,
                            value: "http://localhost:9999"
                        },
                        {
                            name: "Access-Control-Allow-Method",
                            in: "header",
                            description: "Cors-Method 형식",
                            required: true,
                            value: "get"
                        },
                        {
                            name: "Content-Type",
                            in: "header",
                            value: "text/plain",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "Accept",
                            in: "header",
                            value: "application/json",
                            schema:{
                                type: "string"
                            }
                        },
                        {
                            name: "credentials",
                            in: "header",
                            value: "include",
                            schema:{
                                type: "string"
                            }
                        },
                    ],
                    security: {
                        bearerAuth: []
                    }
                }
            },
            //post
            "/api/message": {
                post:{
                    tags: ["Chat"],
                    summary: "채팅 메세지",
                    requestBody: {
                        content:{
                            "multipart/form-data":{
                                schema: {
                                    properties:{
                                        file:{
                                            type: "string",
                                            description:"메세지가 파일일 경우"
                                        },
                                        roomNo:{
                                            type:"integer",
                                            description:"참여 중인 채팅방 고유 번호"
                                        },
                                        participantNo:{
                                            type:"integer",
                                            description:"참여 중인 사용자 고유 번호"
                                        },
                                        text:{
                                            type:"text",
                                            description:"메세지가 파일이 아닐 경우의 메세지 내용"
                                        },
                                        notReadCount:{
                                            type:"integer",
                                            description:"해당 메세지를 안 읽은 사용자의 수"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/createRoom": {
                post:{
                    tags: ["Room"],
                    summary: "채팅방 생성하기",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        title:{
                                            type: "string",
                                            description:"채팅방 제목"
                                        },
                                        content:{
                                            type:"string",
                                            description:"채팅방 상태 글"
                                        },
                                        headCount:{
                                            type:"integer",
                                            description:"채팅방 참여 인원"
                                        },
                                        type:{
                                            type:"string",
                                            description:"채팅방 타입(public, private, official"
                                        },
                                        password:{
                                            type:"string",
                                            description:"채팅방 패스워드"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/createParticipant": {
                post:{
                    tags: ["Participant"],
                    summary: "사용자 채팅방 참여하기",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        userNo:{
                                            type: "integer",
                                            description:"사용자 고유 번호"
                                        },
                                        roomNo:{
                                            type:"integer",
                                            description:"채팅방 고유 번호"
                                        },
                                        role:{
                                            type:"string",
                                            description:"사용자의 해당 채팅방에서의 권한"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getHeadCount": {
                post:{
                    tags: ["Room"],
                    summary: "참여 인원 조회",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                            description:"참가자 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getFriendList": {
                post:{
                    tags: ["User"],
                    summary: "친구 리스트 조회",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        userNo:{
                                            type: "integer",
                                            description:"사용자 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getFollowerList": {
                post:{
                    tags: ["User"],
                    summary: "팔로워 리스트 조회",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        userNo:{
                                            type: "integer",
                                            description:"사용자 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/addFriend": {
                post:{
                    tags: ["User"],
                    summary: "친구 추가",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        username:{
                                            type: "string",
                                            description:"친구추가를 원하는 상대방의 이메일"
                                        },
                                        userNo:{
                                            type: "integer",
                                            description:"사용자 고유 번호"
                                        },
                                        Authorization:{
                                            type:"string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getLastReadNo": {
                post:{
                    tags: ["Chat"],
                    summary: "마지막으로 읽은 채팅 정보 조회",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/getLastReadNoCount": {
                post:{
                    tags: ["Chat"],
                    summary: "마지막 읽은 메시지 이후의 리스트의 갯수",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/joinRoom": {
                post:{
                    tags: ["Room"],
                    summary: "채팅방 참여하기",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                        },
                                        roomNo:{
                                            type:"integer"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/leftRoom": {
                post:{
                    tags: ["Room"],
                    summary: "채팅방 나가기",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },

            //put(update)
            "/api/setStatus": {
                put:{
                    tags: ["Participant"],
                    summary: "참여자 상태 업데이트",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                            description:"참가자 고유 번호"
                                        },
                                        status:{
                                            type:"integer",
                                            description:"참가자 상태 정보"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/updateSendNotReadCount": {
                put:{
                    tags: ["Chat"],
                    summary: "메세지 발송 후 개별 참여자의 메시지 확인 후 -1 discount",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        chatNo:{
                                            type: "integer",
                                            description:"채팅 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/updateRoomNotReadCount": {
                put:{
                    tags: ["Chat"],
                    summary: "방에 참여 시 메세지 notReadCount 업데이트",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                            description:"참여자 고유 번호"
                                        },
                                        roomNo:{
                                            type: "integer",
                                            description:"채팅방 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/updateLastReadAt": {
                put:{
                    tags: ["Participant"],
                    summary: "참여자가 마지막으로 채팅을 읽은 시간 업데이트",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        participantNo:{
                                            type: "integer",
                                            description:"참여자 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/updateSettings": {
                put:{
                    tags: ["User"],
                    summary: "사용자 정보 변경하기",
                    requestBody: {
                        content:{
                            "multipart/form-data":{
                                schema: {
                                    properties:{
                                        file:{
                                            type: "string",
                                        },
                                        Authorization:{
                                            type:"string"
                                        },
                                        userNo:{
                                            type:"integer"
                                        },
                                        comments:{
                                            type:"string"
                                        },
                                        nickname:{
                                            type:"string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/updateHeadCount": {
                put:{
                    tags: ["Room"],
                    summary: "참여 인원 업데이트",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        type:{
                                            type: "string",
                                        },
                                        roomNo:{
                                            type:"integer"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },
            //delete
            "/api/deleteChat": {
                delete:{
                    tags: ["Participant"],
                    summary: "참여자가 마지막으로 채팅을 읽은 시간 업데이트",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        openChatHostCheck:{
                                            type: "boolean",
                                            description:"참여자의 권한이 HOST인지 확인"
                                        },
                                        participantNo:{
                                            type: "integer",
                                        },
                                        roomNo:{
                                            type: "integer",
                                        },
                                        Authorization:{
                                            type: "string",
                                            description:"사용자의 고유 토큰"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/deleteUserInfo": {
                delete:{
                    tags: ["User"],
                    summary: "사용자 탈퇴 처리",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        userNo:{
                                            type: "integer",
                                        },
                                        isDeleted:{
                                            type: "integer",
                                            example:1
                                        },
                                        Authorization:{
                                            type: "string",
                                            description:"사용자의 고유 토큰"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/deleteFriend": {
                delete:{
                    tags: ["User"],
                    summary: "친구 삭제",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        friendNo:{
                                            type: "integer",
                                            description:"상대방 사용자의 고유 번호"
                                        },
                                        userNo:{
                                            type: "integer",
                                            description:"사용자 고유 번호"
                                        },
                                        Authorization:{
                                            type:"string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    security: {
                        bearerAuth: []
                    }
                }
            },
            "/api/deleteUnknown": {
                delete:{
                    tags: ["User"],
                    summary: "Unknown 유저 삭제",
                    requestBody: {
                        content:{
                            "application/json":{
                                schema: {
                                    properties:{
                                        userNo:{
                                            type: "integer",
                                            description:"사용자 고유 번호"
                                        },
                                    }
                                }
                            }
                        }
                    },
                    parameters: postAuthHeader,
                    security: {
                        bearerAuth: []
                    }
                }
            },

        },
    },
    apis: ['./routes/*.js', './*.js']
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};

