//This file is no longer used.

const jwt = require('jsonwebtoken');



/*This function verifies whether the jwt token is present or not,if present verifies whether it is a valid 
 token or not,if it is not valid sends an error else just returns next*/
module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(403).send({ auth: false, message: "No token" })
        // console.log(err)
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'token authentication failed' });
                else {
                    req._id = decoded._id;
                    next();
                }
            }



        )
    }
}



