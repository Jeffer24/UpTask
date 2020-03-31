const express=require('express');
const routes=require('./routes');
const path=require('path');
const bodyParser=require('body-parser');
const expressValidator = require('express-validator');
const flash=require('connect-flash');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('./config/passport');

//extraer valores de variables.env
require('dotenv').config({path:'variables.env'})


//helpers con algunas funciones
const helpers =require('./helpers');

//crear la conexion a la BD
const db=require('./config/db');

/*
db.authenticate()
   .then(()=> console.log('Conectado al Servidor'))
   .catch(error=> console.log(error))
*/

//importamos el modelo para que posteriormente lo cree en la base de datos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
   .then(()=> console.log('Conectado al Servidor'))
   .catch(error=> console.log(error))

//crear una app de express
const app=express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//habilitar pug 
app.set('view engine','pug');

//habilitar bodyParser para tener datos del formulario
app.use(bodyParser.urlencoded({extended:true}));

// Agregamos express validator a toda la aplicación
//app.use(expressValidator());


//añadir la carpeta de las vistas
app.set('views', path.join(__dirname,'./views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//sesiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret:'supersecreto',
    resave:false,
    saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la aplicación
app.use((req, res, next) => {
    //console.log(req.user);
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes=req.flash();
    res.locals.usuario={...req.user}||null;
    //console.log(res.locals.usuario);
    //const fecha=new Date();

    //res.locals.year=fecha.getFullYear();
    //res.locals.mensajes = req.flash();
    //res.locals.usuario = {...req.user} || null;
    next();
});


//aprendiendo Middleware 
app.use((req, res, next)=> {
    console.log('Yo soy Middleware');
    next();
});

app.use('/', routes());

//Servidor y puerto
const host=process.env.HOST || '0.0.0.0';
const port=process.env.PORT || 3000;


app.listen(port, host,()=>{
    console.log('El servidor esta LISTO');
});
