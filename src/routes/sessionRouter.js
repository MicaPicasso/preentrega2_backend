import { Router } from "express"
import userModel from "../models/userModel.js"


const router=Router();

// rutas de session

// router.get("/", (req,res)=>{
//     if(req.session.counter){
//         req.session.counter ++
//         res.send(`Se ha visitado este sitio ${req.session.counter} veces`)
//     }else{
//         req.session.counter = 1
//         res.send("Bienvenido")
//     }
// })



// // salir de la sesion
// router.get("/logout", (req,res)=>{
//     req.session.destroy(error =>{
//         if(error){
//             res.json({error: "Error al cerrar la sesión"})
//         }
//         res.send('Sesion cerrada con exito.')
//     })
// })

// // login

// router.get("/login", (req,res)=>{
//     const {username, password}= req.query

//    if(username != 'pepe' || password != "123"){
//     return res.status(401).send("Login failed, check you credentials")
//    }else{
//     req.session.user= username;
//     req.session.admin= true;
//     res.send("Acceso correcto")
//    }
// })

// // middleware auth
// function auth(req,res,next){
//     if(req.session.user === "pepe" && req.session.admin){
//         return next()
//     }else{
//         return res.status(403).send('Usuario no autorizado para ingresar a este recurso')
//     }
// }

// router.get("/private", auth, (req,res)=>{
//     res.send('Si estas viendo esto es porque estas autorizado a este recurso')

// })


// register

router.post("/register", async (req,res)=>{
    try{
        const {first_name, last_name, email, age, password}= req.body

        // validar si el user existe
        const exist= await userModel.findOne({email})
        if(exist){
            return res.status(400).send({status:'error', msg:'usuario ya existe'})
        }
        const user={
            first_name, 
            last_name, 
            email, 
            age, 
            password
        }

        const result = await userModel.create(user)
        res.send({status: "exitoso", msg: 'Usuario creado con exito' + result.id})
    }catch(error){
        res.json({error:error})
    }
})

// login
router.post("/login", async (req,res)=>{
    try{
        const {email,password}= req.body;
        const user= await userModel.findOne({email, password})
        
        if(!user){
            return res.status(401).send({status:'error', error: 'Incorrect credentials'})
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
        }

        res.send({status: 'success', payload: req.session.user, message: 'Primer logueo realizado!'})
    }catch(error){
        res.json({error:error})
    }
})
export default router