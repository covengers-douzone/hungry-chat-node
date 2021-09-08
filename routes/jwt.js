const jwt = require('jsonwebtoken');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    verify: async (res, token) => {
        let decoded;
        try {
            // verify를 통해 값 decode!
            decoded = await jwt.verify(token, process.env.SECRET_KEY, process.env.ALG);

        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                res.status(403).send({
                    result: "fail",
                    data: null,
                    message: "Expired Token"
                });

                // return TOKEN_EXPIRED;
            }  else {
                console.log("invalid token");
                res.status(400).send({
                    result: "fail",
                    data: null,
                    message: "Invalid Token"
                });
                // return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}