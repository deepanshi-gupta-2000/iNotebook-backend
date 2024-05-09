const jwt = require('jsonwebtoken');
const JWT_sig = 'idontnknowwhat$thekeyis';

const fetchuser = (req, res, next) => {
    //get user id from req
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send('Pls login with autherize token');
    }
    try {
        const data = jwt.verify(token, JWT_sig);
        // console.log(`data is ${data}`);
        req.userId = data;
        
    } catch (error) {
        res.send('Some error occured');
        console.log(err);
    }
    next();
}


module.exports = fetchuser;