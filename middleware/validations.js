const yup = require('yup');
const ValidationError = require('../errors/validationError');
const {getOrderbyId} = require('../queries');

const validate = (validation) => {
    return async (req, res, next) => {
        try {
            
            await validation(req.body);

            next();
        } catch (error) {
            next(new ValidationError(error));
        }
    };
}

const createUsersV = (data) => {
    const schema = yup.object().shape({
        password: yup.string().min(7).max(45).required(),
        email: yup.string().email('Must be a valid email').max(255).required(),
        name: yup.string().min(5).max(60).matches(/^[a-z\s+]+$/i, 'Name must follow the format a-z').required(),
    });

    schema.validateSync(data);
}

const loginUsersV = (data) => {
    const schema = yup.object().shape({
        password:  yup.string().min(7).max(45).required(),
        email: yup.string().email('Must be a valid email').max(255).required(),
        name: yup.string().matches(/^[a-z\s+]+$/i, 'Name must follow the format a-z').required(),
    });

    schema.validateSync(data);
}

const rectifyOrderVa = async (data) => {
    const {order_id} = data;
    const order = await getOrderbyId(order_id);

    const schema = yup.object().shape({
        observations: yup.string().max(1024),
        vegetarian: yup.number().min(0).max(order[0].vegetarian),
        standard: yup.number().min(0).max(order[0].standard),
        ethnic: yup.number().min(0).max(order[0].ethnic),
        celiac: yup.number().min(0).max(order[0].celiac),
        caloric: yup.number().min(0).max(order[0].caloric),
    });

    await schema.validate(data)
}

const createOrderV = (data) => {
    
    const schema = yup.object().shape({
        date_order: yup.date().min(new Date(),'Please choose future date').nullable().typeError('Must choose a date'),
        vegetarian: yup.number().min(0).max(1000),
        standard: yup.number().min(0).max(1000),
        ethnic: yup.number().min(0).max(1000),
        celiac: yup.number().min(0).max(1000),
        caloric: yup.number().min(0).max(1000),
    });

    schema.validateSync(data);
}

module.exports = {
    validate,
    createUsersV,
    loginUsersV,
    rectifyOrderVa,
    createOrderV,
};