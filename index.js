//Importaciones
const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const {errorMiddleware} = require('./middleware/error');


// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(cookieParser());

app.engine(
    'handlebars',
    engine({
        defaultLayout: 'main',
        layoutsDir: `${__dirname}/views/mainLayout`,
        partialsDir: `${__dirname}/views/components`,
    })
);
app.set('view engine', 'handlebars');

//Rutas
const {register} = require('./routes/register');
const {authApi} = require('./routes/auth');
const {orderNew} = require('./routes/orderNew');
const {rectify} = require('./routes/rectify');
const {logout} = require('./routes/logout');
const {front} = require('./routes/front');

register(app);
authApi(app);
orderNew(app);
rectify(app);
logout(app);
front(app);

//Error Middleware
app.use(errorMiddleware);

//Servidor
app.listen(process.env.PORT || 3000, () => console.log(`Listening server in http://localhost:${process.env.PORT || 3000}`));




