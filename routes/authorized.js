const models = require('../models');
const jwt = require("./jwt");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = function (role) {
    return async function (req, res, next) {
        console.log("-------------------------------------------AUTH-------------------------------------------")
        console.log(req.headers.authorization);
        let splitToken = req.headers.authorization === undefined ? (req.body.Authorization === undefined ? req.body.data.Authorization.split(' ') : req.body.Authorization.split(' ')) : req.headers.authorization.split(' ');
        let token = splitToken[1];


        console.log("req.headers.authorization" , req.headers.authorization)

        // 1. Token에 대한 검사 진행
        // 2. DB 정보 비교
        // 3. Role 비교
        let roleUser = undefined
        let roleUnknown = undefined

        await role.forEach((item, i) => {

            if (item === "ROLE_UNKNOWN") {
                roleUnknown = item
            } else if (item === "ROLE_USER") {
                roleUser = item
            }
        })


        // token 값 null 검사
        try {
            if (token) {

                let decoded = await jwt.verify(res, token);
                console.log(decoded);
                console.log(decoded.role);
                console.log("Token subject !!!! : " + decoded.sub);
                const results = await models.User.findOne({
                    where: {
                        token: "Bearer " + token
                    }
                })

                console.log("decoded" , decoded.role[0])
                //
                // if (results.role === roleUser) {
                //     console.log("회원으로 접속")
                // } else if (results.role === roleUnknown) {
                //     console.log("비 회원으로 접속")
                // } else {
                //     throw new Error("DB에서 정보를 로드할 수 없습니다. 혹은 권한이 없습니다.");
                // }
                next()
            }


        } catch (e) {
            console.log("Error From Node:" + e.message);

            res.status(500).send({
                result: "fail",
                data: null,
                message: "Access Denied"
            });
        }
    }
}
