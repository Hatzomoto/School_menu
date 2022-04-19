const {jwtAuth} = require('../middleware/jwtVerify');
const {rectifyOrder} = require('../queries');
const {routeHelper} = require('../middleware/error');
const {validate, rectifyOrderVa} = require('../middleware/validations');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: {
    httpOnly: true,
    sameSite: true,
}});

const rectify = (app) => {
    app.put("/rectify_order", jwtAuth, validate(rectifyOrderVa), csrfProtection, routeHelper(async (req, res) => {
        const data = req.body;
        const rectify = await rectifyOrder(data);
        if(rectify){
            res.status(200)
                .json({
                    message: "Order rectified successfully!"
                })
                .end();
        }
    }));
}

module.exports = { 
    rectify
}




