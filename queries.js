const {Pool} = require('pg');
const dotenv = require('dotenv').config({ path: 'config/.env' });

const pool = new Pool({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    password: process.env.PASSWORD_DB,
    port: 5432,
    database: process.env.DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
});

getUsuario = async (name, email) => {
    const result = await pool.query(
        `SELECT * FROM schools WHERE name = '${name}' AND email = '${email}'`
    );
    return result.rows[0];
};

getOrderExist = async (id, date) => {
    const result = await pool.query(
        `SELECT * FROM orders WHERE school_id = '${id}' AND date_order = '${date}'`
    );
    return result.rows[0];
}

getAllOrders = async (id) => {
    if(id){
        const result = await pool.query(`select *, t.id as id_order from orders as t join schools as u on u.id = t.school_id where school_id=${id}`);
        return result.rows

    }else{
        const result = await pool.query('select *, t.id as id_order from orders as t join schools as u on u.id = t.school_id ');
        return result.rows
    }
    
};

getOrderbyId = async (id) => {
    const result = await pool.query(`select * from orders where id=${id}`);
    return result.rows
};

getAllOrdersbyFilter = async (data) => {
    const {institute, from, to} = data;

    if(institute == 'alls'){
        const result = await pool.query(`select *, t.id as id_order from orders as t join schools as u on u.id = t.school_id 
        where date_order between '${from}' and '${to}'`);
        return result.rows

    }else {
        const result = await pool.query(`select *, t.id as id_order from orders as t join schools as u on u.id = t.school_id 
        where name = '${institute}' and date_order between '${from}' and '${to}'`);
        return result.rows
    }
};

newOrder = async (id, data) => {
    const values = Object.values(data);
    values.pop();
    values.push(id);
    const consulta = {
        text: 'INSERT INTO orders (school_id, registration_date, date_order, is_rectified,  vegetarian, vegetarian_real, celiac, celiac_real, standard, standard_real, caloric, caloric_real, ethnic, ethnic_real) values ($7, now(), $6, false, $5,0,$2,0,$4,0,$1,0,$3,0)',
        values,
    };
    const result = await pool.query(consulta);
    return result;
};

rectifyOrder = async (order) => {
    const values = Object.values(order);
    values.pop();
    values.push(true);
    const consulta = {
        text: 'UPDATE orders SET is_rectified=$8, caloric_real=$2, celiac_real=$3, ethnic_real=$4, standard_real=$5, vegetarian_real=$6, observations=$7 WHERE id = $1 RETURNING *',
        values,
    };
    const result = await pool.query(consulta);
    return result.rows[0];
}

newUser = async (data) => {
    const values = Object.values(data);
    const consulta = {
        text: 'INSERT INTO schools (name, email, password) values ($1, $2, $3) RETURNING *',
        values,
    };
    const result = await pool.query(consulta);
    return result.rows;
};


module.exports = { getUsuario, getAllOrders, getAllOrdersbyFilter, newOrder, getOrderbyId, rectifyOrder, newUser, getOrderExist }