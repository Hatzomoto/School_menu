const routeHelper = (callback) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            console.log(error);
            next(error)
        }
    };
}

const errorMiddleware = (error, req, res, next) => {
    let errorObject;

    console.log('Este es el error',error);
    if (typeof error.toJson === 'function') {
        errorObject = error.toJson();
        return res.status(errorObject.status).json(errorObject);
    } 

    if (error.detail) {
        errorObject = {
            status: 500,
            name: 'Data Error',
            message: error.detail.replace('Ya existe la llave (email)=', 'Already exists email '),
        };
        return res.status(errorObject.status).json(errorObject);
    }

    errorObject = {
        status: 500,
        name: 'Unkwnown Error',
        message: `There's been a problem`,
    };
    res.status(errorObject.status).json(errorObject);
};

module.exports = {
    errorMiddleware,
    routeHelper,
}

