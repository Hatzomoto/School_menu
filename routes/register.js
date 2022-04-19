const {newUser} = require('../queries');
const {routeHelper} = require('../middleware/error');
const {validate, createUsersV } = require('../middleware/validations');
const csrf = require('csurf');
const bcrypt = require('bcrypt');

const csrfProtection = csrf({ cookie: {
    httpOnly: true,
    sameSite: true,
}});

const register = (app) => {
    app.post('/new_user', validate(createUsersV), routeHelper(async (req, res) => {
        const data = req.body;
        const {password} = req.body;
        const saltRounds = 8;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        data.password = passwordHash;
        const user = await newUser(data);
        user? res.status(201).end() : '';
    }));
}



module.exports = {
    register
}