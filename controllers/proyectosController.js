const Proyectos=require('../models/Proyectos');
const Tareas=require('../models/Tareas');
const slug=require('slug');


exports.proyectosHome =async(req, res)=>{
    //res.send('Index del controller');
    const usuarioId=res.locals.usuario.id;
    const proyectos=await Proyectos.findAll({where:{usuarioId}});

    res.render('index',{
        nombrePagina:'Proyectos',
        proyectos
    });
}

exports.formularioProyecto=async(req,res)=>{

    const usuarioId=res.locals.usuario.id;
    const proyectos=await Proyectos.findAll({where:{usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina:'Nuevo Proyecto',
        proyectos
    });
}

exports.nosotros=(req,res)=>{
    res.send('Nosotros del controller');
}

//agregamos la palabra async
exports.nuevoProyecto=async(req,res)=>{
    const usuarioId=res.locals.usuario.id;
    const proyectos=await Proyectos.findAll({where:{usuarioId}});
    //enviar a la consola lo que el usuario escriba
    //console.log(req.body);

    //validar input
    const {nombre} =req.body;
    
    let errores =[];
    if(nombre==undefined){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }else if(nombre.length==0){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    //si hay errores
    if(errores.length>0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores
        });
    }else{

        /*
        //Si no hay errrores. Insertar en la BD
        Proyectos.create({nombre})
            .then(()=> console.log('Insertado correctamente'))
            .catch(error=>console.log(error));
        */
        //const url=slug(nombre).toLowerCase();
        const usuarioId=res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }
}


exports.proyectoPorUrl=async(req, res,next)=>{
    const usuarioId=res.locals.usuario.id;
    const proyectosPromise= Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise= Proyectos.findOne({
        where:{
            url:req.params.url
        }
    });

    //console.log('Nombre Editar por URL: '+proyectoPromise.nombre);
    const [proyectos,proyecto]=await Promise.all([proyectosPromise,proyectoPromise]);

    //Consultar tareas del proyecto actual
    const tareas=await Tareas.findAll({
        where:{
            proyectoId:proyecto.id
        },
        //include:[
        //    {model:Proyectos}
        //]
            
        
    });
       
    if(!proyecto) return next();

    //console.log(proyecto);
    res.render('tareas',{
        nombrePagina:'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
 
}


exports.formularioEditar=async(req,res)=>{
   
    const usuarioId=res.locals.usuario.id;
    const proyectosPromise= Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise= Proyectos.findOne({
        where:{
            id:req.params.id, usuarioId
        }
    });
    

    const [proyectos,proyecto]=await Promise.all([proyectosPromise,proyectoPromise]);
    //console.log('Nombre Editar: '+proyecto.nombre);
    //render a la vista
    res.render('nuevoProyecto',{
        nombrePagina:'Editar proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto=async(req,res)=>{
    //enviar a la consola lo que el usuario escriba
    //console.log(req.body);

    //validar input
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    const {nombre} =req.body;
    
    let errores =[];
    if(nombre==undefined){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }else if(nombre.length==0){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    //si hay errores
    if(errores.length>0){
        res.render('nuevoProyecto',{
            nombrePagina:'Nuevo Proyecto',
            errores
        });
    }else{

        /*
        //Si no hay errrores. Insertar en la BD
        Proyectos.create({nombre})
            .then(()=> console.log('Insertado correctamente'))
            .catch(error=>console.log(error));
        */
        //const url=slug(nombre).toLowerCase();
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id }} 
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto =async(req,res,next)=>{
    const {urlProyecto}=req.query;

    const resultado=await Proyectos.destroy({
        where:{
            url:urlProyecto
        }
    });

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado');
}
