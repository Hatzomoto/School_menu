# School Menu

Test: https://schoolmenu-app.herokuapp.com

***

## Table of Contents
1. [General Info](#general-info)
2. [Dependencies](#dependencies)
3. [Use](#use)

***

### General Info
<a name="general-info"></a>

App that allows you to order five different menus from a registered high school. Once the order has been placed and consumed, it must be rectified to verify the menus consumed, the result is a table with a list of all the orders and the details of each one. The Administrator can view all the orders from different menus and perform a filter to search for a specific one.

Postgresql was used for data persistence.

***

## Dependencies
<a name="dependencies"></a>

* "axios"
* "bcrypt": "^5.0.1"
* "body-parser": "^1.19.2"
* "bootstrap": "^4.6.0"
* "cookie-parser": "^1.4.6"
* "csurf": "^1.11.0"
* "dotenv": "^16.0.0"
* "express": "^4.17.3"
* "express-handlebars": "^6.0.3"
* "Jquery"
* "jsonwebtoken": "^8.5.1"
* "moment": "^2.29.1"
* "nodemon": "^2.0.15"
* "pg": "^8.7.3"
* "yup": "^0.32.11"

***

## Use
<a name="use"></a>

Credentials Administrator

| User | Email | Password |
   |---|---|---|
   | Admin Junaeb | admin@junaeb.cl | 12345678 |

Create two high school users, place two orders in both, rectify one per user and then enter with administrator credentials and apply search filter.
