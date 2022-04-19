const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config({ path: 'config/.env' });

const jwtVerify = (token,cb) => {
    jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
        cb(err, decoded)
    })
    
}

const jwtSign = ({id, name, email}) => {
    const payload = {id,name,email,}
    return jwt.sign(payload, process.env.SECRET_KEY,{expiresIn: '15min'})
}


module.exports = {
    jwtVerify,
    jwtSign
}