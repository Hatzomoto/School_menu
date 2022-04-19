const {jwtAuth} = require('../middleware/jwtVerify');

const logout = (app) => {
    app.get("/logout", jwtAuth, (req, res) => {
        return res
            .clearCookie("access_token")
            .status(200)
            .end();
    });
}

module.exports = { 
    logout 
}




