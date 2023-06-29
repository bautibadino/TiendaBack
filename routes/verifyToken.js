
const jsonwebtoken = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid');
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json('You are not authenticated');
    }
};

const verifyTokenAndAutorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('You are not allowed to do that');
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next();
        }else{
            res.status(403).json('You are not allowed to do thatttt');
        }
    });
}
module.exports = {verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin}
