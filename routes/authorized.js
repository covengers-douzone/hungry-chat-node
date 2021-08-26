const models = require('../models');
const jwt = require("./jwt");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = function(role) {
    return async function(req, res, next) {
        let splitToken = req.headers.authorization.split(' ');
        let token = splitToken[1];
        // 1. Token에 대한 검사 진행
        // 2. DB 정보 비교
        // 3. Role 비교

        // token 값 null 검사
        try{
            if(token){
                let decoded = await jwt.verify(token);
                console.log(decoded);
                console.log(decoded.role);

                if(decoded !== TOKEN_EXPIRED || decoded !== TOKEN_INVALID){
                    const results = await models.User.findOne({
                        attributes: ['role'],// DB 토큰
                        where: {
                            token: "Bearer " + token
                        }
                    })
                    if(results !== null && results.role === role){
                        next();
                        return;
                    }
                }
            }
            // 없다면 Access Denied
            res.status(403).send({
                result: "fail",
                data: null,
                message: "Access Denied"
            });
        } catch (e){
            console.log("Error From Node:"+e.message);
        }
    }
}
