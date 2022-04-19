const moment = require('moment');
const {getAllOrders, getAllOrdersbyFilter, getOrderbyId} = require('../queries');
const {jwtAuth} = require('../middleware/jwtVerify');
const {routeHelper} = require('../middleware/error');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: {
    httpOnly: true,
    sameSite: true,
}});

const front = (app) => {

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.get('/register', function (req, res) {
        res.render('register');
    });

    app.get("/", jwtAuth, routeHelper(async (req, res) => {
        const {name, id} = req.token;
        const data = req.query;
        const orders = name == 'Admin Junaeb' ? await getAllOrders() : await getAllOrders(id);
        const options = [];
        orders.map(e => e.date_order = moment(e.date_order).format('DD-MM-YYYY'));
        orders.forEach(e => !options.includes(e.name) ? options.push(e.name) : '');

        if (data.institute) {
            const ordersbyfilter = await getAllOrdersbyFilter(data);
            ordersbyfilter.map(e => e.date_order = moment(e.date_order).format('DD-MM-YYYY'));

            res.render('dashboard', {
                admin: name == 'Admin Junaeb' ? name : '',
                usuario: name !== 'Admin Junaeb' ? name : '',
                tabla: ordersbyfilter,
                options,
            })
        } else {
            res.render('dashboard', {
                admin: name == 'Admin Junaeb' ? name : '',
                usuario: name !== 'Admin Junaeb' ? name : '',
                tabla: orders,
                options,
            })
        }
    }));

    app.get("/orders/new", jwtAuth, csrfProtection, (req, res) => {
        const {name} = req.token;

        res.render('newOrder', {
            admin: name == 'Admin Junaeb' ? name : '',
            usuario: name !== 'Admin Junaeb' ? name : '',
            csrfToken: req.csrfToken(),
        })
    });

    app.get("/orders/:id/rectify", jwtAuth, csrfProtection, routeHelper(async (req, res) => {
        const {name} = req.token;
        const {id} = req.params;
        const order = await getOrderbyId(id);

        res.render('rectify', {
            admin: name == 'Admin Junaeb' ? name : '',
            usuario: name !== 'Admin Junaeb' ? name : '',
            order: order[0],
            date: moment(order[0].date_order).format('DD-MM-YYYY'),
            csrfToken: req.csrfToken(),
        })
    }));

    app.get("/orders/:id", jwtAuth, routeHelper(async (req, res) => {
        const {name} = req.token;
        const {id} = req.params;
        const order = await getOrderbyId(id);
        const {observations} = order[0];
        const total = `${order[0].vegetarian-order[0].vegetarian_real+order[0].celiac-order[0].celiac_real+order[0].standard-order[0].standard_real+order[0].caloric-order[0].caloric_real+order[0].ethnic-order[0].ethnic_real}`

        res.render('details', {
            admin: name == 'Admin Junaeb' ? name : '',
            usuario: name !== 'Admin Junaeb' ? name : '',
            order: order[0],
            date: moment(order[0].date_order).format('DD-MM-YYYY'),
            total,
            observations,
        })
    }));

    app.get("*", (req, res) => {
        res.send("<h1>Esta página no existe</h1>");
    });
}

module.exports = {
    front
}