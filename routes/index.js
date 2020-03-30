const express=require('express');
const router =express.Router();

//importar el controlador
const proyectosController=require('../controllers/proyectosController');
//importar el controlador de tareas
const tareasController=require('../controllers/tareasController');
const usuariosController=require('../controllers/usuariosController');
const authControlller=require('../controllers/authController');

//importar express-validator
const {body} =require('express-validator/check');

module.exports=function(){
    // ruta para el home
    router.get('/',
        authControlller.usuarioAutenticado,
        proyectosController.proyectosHome);  

    router.get('/nuevo-proyecto', authControlller.usuarioAutenticado, proyectosController.formularioProyecto);

    router.post('/nuevo-proyecto', 
        authControlller.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto);

    //Listar proyecto
    router.get('/proyectos/:url', authControlller.usuarioAutenticado, proyectosController.proyectoPorUrl);

    //Actualizar proyecto
    router.get('/proyecto/editar/:id', authControlller.usuarioAutenticado, proyectosController.formularioEditar);

    router.post('/nuevo-proyecto/:id', 
        authControlller.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );


    //Eliminar proyecto
    router.delete('/proyectos/:url', authControlller.usuarioAutenticado, proyectosController.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url', authControlller.usuarioAutenticado, tareasController.agregarTarea);

    //Actualizar tarea
    router.patch('/tareas/:id', authControlller.usuarioAutenticado, tareasController.cambiarEstadoTarea);

    //Eliminar tarea
    router.delete('/tareas/:id', authControlller.usuarioAutenticado, tareasController.eliminarTarea);

    //Crear una cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //Iniciar Sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authControlller.autenticarUsuarios);

    //Cerrar Sesion
    router.get('/cerrar-sesion', authControlller.cerrarSesion);

    //restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authControlller.enviarToken);
    router.get('/restablecer/:token', authControlller.validarToken);
    router.post('/restablecer/:token', authControlller.actualizarPassword);

    return router;

}


