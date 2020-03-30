const passport=require('passport');
const Usuarios=require('../models/Usuarios');
const Sequelize=require('sequelize');
const Op =Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail=require('../handlers/email');

exports.autenticarUsuarios=passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
});

//Funcion para revisar si el usuario esta autenticado o no
exports.usuarioAutenticado=(req,res,next)=>{
    //Si el usuario esta autenticado, adelante
    if(req.isAuthenticated()) {
        return next();
    }

    //si no esta autenticado redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion=(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion'); // al cerrar sesion se va al Login  
    })
}

//genera un token si el usuario es valido
exports.enviarToken=async(req,res)=>{
    //verficar si el usuario existe
    const {email}=req.body;
    const usuario=await Usuarios.findOne({where:{email}});

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    //usuario existe
    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expiracion=Date.now()+3600000;
    
    //guardar los datos en la base de datos
    await usuario.save();

    //la url de reset
    const resetUrl=`http://${req.headers.host}/restablecer/${usuario.token}`;

    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject:'Password Reset',
        resetUrl,
        archivo:'reestablecer-password'
    })

    console.log(resetUrl);
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken=async(req, res)=>{
    const usuario=await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    }); 

    //si no hay usuario
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/restablecer');
    }

    //formulario parar generar el password
    res.render('resetPassword',{
        nombrePagina:'Restablecer Contraseña'
    })
}

//cambia el password por uno nuevo
exports.actualizarPassword=async(req,res)=>{

    //verifica la fecha de expiracion
    const usuario=await Usuarios.findOne({
        where:{
            token:req.params.token,
            expiracion:{
                [Op.gte]:Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/restablecer');
    }
    
    //hashear el nuevo password
    usuario.token=null;
    usuario.expiracion=null;
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );

    //guardamos el password
    await usuario.save();
    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}