import passport from "passport";
import passportLocal from "passport-local"
import userModel from "../models/userModel.js";
import { createHash,isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2"



// declaracion estrategia
const localStrategy = passportLocal.Strategy;

// inicializacion de passport
const initializePassport= ()=>{
    

     // estrategia de github
     passport.use('github', new GitHubStrategy(
        {
            clientID: "Iv1.6559fb38e348b829",
            clientSecret: "04e1f90b635b72ba10117b09aa9457f3878d96ca",
            callbackUrl: "http://localhost:8080/session/githubcallbacks"
            
        },
    async(accessToken, refreshToken, profile, done)=>{
        console.log("Profile obtenido del usuario de Git:");
        console.log(profile);
        try{
            const user= await userModel.findOne({email: profile._json.email})
            console.log("Usuario encontrado para login");
            console.log(user);

            if(!user){
                console.warn("Usuario no encontrado")
                let newUser={
                    first_name: profile._json.name,
                    last_name: '',
                    age:18,
                    email: profile._json.email,
                    password: '',
                    loggedBy: 'GitHub',
                }
                const result= await userModel.create(newUser)
                return done(null,result)
            }else{
                return done(null,user)
            }
        }catch(error){
            return done('Error de login' + error)
        }
    }
    ))
    





    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async(req,username,password,done)=>{
            const {first_name, last_name, email, age}= req.body

            try{
                const exist= await userModel.findOne({email})
                if(exist){
                    console.log('el usuario ya existe!');
                    done(null,false)
                } 

                const user={
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: createHash(password)
                }

                const result = await userModel.create(user)

                return done(null,result)
            }catch(error){
                return done('Error registrando el usuario' + error)
            }
    }
    ))


    // estrategia de login
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
    async(req,username,password,done)=>{
        try{
            const user= await userModel.findOne({email: username})
            if(!user){
                console.warn('User no existe' + username)
                return done(null,false)
            }

            if(!isValidPassword(user,password)){
                console.warn('Credenciales invalidas')
                return done(null,false)
            }
    
            return done(null,user)

        }catch(error){
            return done('Error de login' + error)
        }
    }
    ))


    // funciones de serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser(async(id,done)=>{
        try {
           let user= await userModel.findById(id)
           done(null,user)
        } catch (error) {
            console.error('Error deserializando el usuario:' + error)
        }
        
    })

}


export default initializePassport;
