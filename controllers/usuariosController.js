const Usuarios=require('../models/Usuarios');
const enviarEmail=require('../handlers/email');

exports.formCrearCuenta=(req,res)=>{
    res.render('crearCuenta',{
        nombrePagina:'Crear Cuenta en UpTask' 
    })
}

exports.formIniciarSesion=(req,res)=>{
    const {error}=res.locals.mensajes;
    res.render('iniciarSesion',{
        nombrePagina:'Iniciar Sesion en UpTask',
        error 
    })
}

exports.crearCuenta = async(req,res)=>{
    
    //leer los datos
    const {email, password}=req.body;

    try{
        //verificar si existe el usuario
        const usuarioTemp=await Usuarios.findOne({
            where:{email}
        });

        if(usuarioTemp){
            req.flash('error', 'El correo ya se encuentra registrado en el sistema');
            res.render('crearCuenta',{
                nombrePagina:'Crear Cuenta en UpTask',
                mensajes:req.flash(),
                email,
                password
            });
        }

        //crear el usuario    
        await  Usuarios.create({
            email,
            password
        });
        //crear una URL de confirmar
        const confirmaUrl=`http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario={
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject:'Confirma tu cuenta UpTask',
            confirmaUrl,
            archivo:'confirmar-cuenta'
        })

        //redigir al usuario
        req.flash('correcto', 'Enviamos un correo confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    }catch(error){

        req.flash('error', error.errors.map(error=>error.message));
        res.render('crearCuenta',{
            nombrePagina:'Crear Cuenta en UpTask',
            mensajes:req.flash(),
            email,
            password
        });
    } 
}

exports.formRestablecerPassword=(req,res)=>{
    res.render('restablecer',{
        nombrePagina:'Restablecer tu contraseña'
    });
}

//cambia el estado de una cuenta
exports.confirmarCuenta=async(req,res)=>{
    const usuario=await Usuarios.findOne({
        where:{
            email:req.params.correo
        }
    });

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo=1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}