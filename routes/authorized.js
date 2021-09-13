const models = require('../models');
const jwt = require("./jwt");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = function(role) {
    return async function(req, res, next) {
        console.log("-------------------------------------------AUTH-------------------------------------------")
        let splitToken=req.headers.authorization === undefined ? (req.body.Authorization === undefined ? req.body.data.Authorization.split(' ') : req.body.Authorization.split(' '))  : req.headers.authorization.split(' ');
        let token = splitToken[1];
        // 1. Token에 대한 검사 진행
        // 2. DB 정보 비교
        // 3. Role 비교
        let roleUser = "ROLE_USER";
        let roleUnknown = "ROLE_UNKNOWN"
        if(role === []){
        role.map((item , i) => {
            if(item[i]=== "ROLE_UNKNOWN"){
                roleUnknown = item[i]
            }else if (item[i]=== "ROLE_USER"){
                roleUser = item[i]
            }
        })
        }
        // token 값 null 검사
        try{
            if(token){
                let decoded = await jwt.verify(res,token);
                console.log(decoded);
                console.log(decoded.role);
                console.log("Token subject !!!! : "+ decoded.sub);
                const results = await models.User.findOne({
                    attributes: ['role'],// DB 토큰
                    where: {
                        token: "Bearer " + token
                    }
                })
                if(results.role === roleUser){
                    console.log("Role 권한 : 회원")
                    next()
                }else if (results.role === roleUnknown){
                    console.log("Role 권한 : 비회원")
                    next()
                }else{
                    throw new Error("DB에서 정보를 로드할 수 없습니다. 혹은 권한이 없습니다.");
                }

            }


        } catch (e){
            console.log("Error From Node:"+e.message);

            res.status(500).send({
                result: "fail",
                data: null,
                message: "Access Denied"
            });
        }
    }
}
