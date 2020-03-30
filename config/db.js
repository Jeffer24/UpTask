const  Sequelize  = require('sequelize');

//extraer valores de variables.env
require('dotenv').config({path:'variables.env'})

// Option 1: Passing a connection URI
/*
const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres
*/

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize(
    process.env.BD_NOMBRE,
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        host:process.env.BD_HOST,
        dialect: 'mysql',
        port:process.env.BD_PORT,
        define:{
            timestamps:false
        },
        pool:{
            max:5,
            min:0,
            acquire:30000,
            idle:10000
        }
    });

// Option 2: Passing parameters separately (other dialects)
/*
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  //dialect:  one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' 
});
*/

module.exports=sequelize;