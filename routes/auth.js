const {jwtSign} = require('../utils/jwt');
const {getUsuario} = require('../queries');
const {routeHelper} = require('../middleware/error');
const {validate, loginUsersV } = require('../middleware/validations');
const csrf = require('csurf');
const bcrypt = require('bcrypt');

const csrfProtection = csrf({ cookie: {
    httpOnly: true,
    sameSite: true,
}});

const authApi = (app) => {
    app.post('/login/verify', validate(loginUsersV), routeHelper(async (req, res) => {
        const {name, email, password} = req.body;
        const user = await getUsuario(name, email);
        if(user){
            const {password: passwordHash} = user;
            const match = await bcrypt.compare(password, passwordHash);
            
            if (match) {
                const token = jwtSign(user);
                const options = {
                    httpOnly: true,
                    sameSite: true,
                    maxAge: 60000*15,
                };
        
                res
                .cookie('access_token', token, options)
                .status(200)
                .json({message: "Logged in successfully"})
                .end();
            } else {
                res.status(400).json({name: 'authError', message: 'Invalid name, email and/or password'}).end()
            }
        }else {
            res.status(400).json({name: 'authError', message: 'Invalid name, email and/or password'}).end()
        }
        
    }));
}



module.exports = { 
    authApi 
}