const {jwtAuth} = require('../middleware/jwtVerify');
const {newOrder, getOrderExist} = require('../queries');
const {routeHelper} = require('../middleware/error');
const {validate, createOrderV} = require('../middleware/validations');
const csrf = require('csurf');
const ValidationError = require('../errors/validationError');
const { path } = require('express/lib/application');

const csrfProtection = csrf({ cookie: {
    httpOnly: true,
    sameSite: true,
}});

const orderNew = (app) => {
    app.post('/new_order', jwtAuth, validate(createOrderV), csrfProtection, routeHelper(async (req, res) => {
        const {id} = req.token
        const data = req.body;
        const {date_order} = data;
        const isExist = await getOrderExist(id, date_order);
        
        if (!isExist) {
            const order = await newOrder(id, data);
            if(order){
                res
                .status(200)
                .json({
                    message: "Order entered successfully!"
                })
                .end();
            }
        } else {
            const error = {
                message: 'There is already an order on that date!',
                path: 'date_order',
            }
            throw new ValidationError(error)
        }
    }));
}

module.exports = {
    orderNew
}