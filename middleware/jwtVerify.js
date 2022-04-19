const express = require('express')
const { jwtVerify } = require('../utils/jwt')

const jwtAuth = express.Router()

jwtAuth.use((req, res, next) => {

	const token = req.cookies.access_token;
    
    if (token) { 
		jwtVerify(token, (err, decoded) => {
            if (err) {
                return res.redirect('/login');
            } else {
                req.token = decoded
                return next();
            }
        });     
        
    }else {
		res.redirect('/login');
    }
})

module.exports = {jwtAuth}