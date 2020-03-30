const Sequelize =require('sequelize');
const db=require('../config/db');
const Proyectos =require('./Proyectos');

const Tareas=db.define('tareas',{
    id :{
        type:Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement:true
    }, 
    tarea:Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
//Una tarea pertenece a un Proyecto
Tareas.belongsTo(Proyectos);

//Otra forma de reemplazar esta linea (Un proyecto puede tener varias tareas)
//Proyectos.hasMany(Tareas);

module.exports=Tareas;