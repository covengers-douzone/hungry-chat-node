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
        if(!token){
            res.status(403).send({
                result: "fail",
                data: null,
                message: "Access Denied"
            });
        }
        // decode 결과
        let decoded = await jwt.verify(token);
        console.log(decoded);
        console.log(decoded.role);

        if(decoded === TOKEN_EXPIRED){
            res.status(403).send({
                result: "fail",
                data: null,
                message: "Expired Token"
            });
        }else if(decoded === TOKEN_INVALID){
            res.status(403).send({
                result: "fail",
                data: null,
                message: "Invalid Token"
            });
        }

        // 해당 유저의 Token 값이 맞는지 검사 (인증)
        const results = await models.User.findOne({
            attributes: ['role'],// DB 토큰
                where: {
                    token: req.headers.authorization
                }
            })

        console.log("FindByToken :" + results);

        // 없다면 Access Denied
        if(!results){
            console.log("Access Denied");
            res.status(403).send({
                result: "fail",
                data: null,
                message: "Access Denied"
            });
        }
        if(decoded.role === role){
            next(req,res);
        }
    }
}




// if(req.accepts('html')) {
//     res.redirect(req.session.authUser ? '/' : '/user/login');
//     return;
// }
