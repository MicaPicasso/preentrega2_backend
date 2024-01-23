/* ---------------------------------------------------
                CONFIGURACION DE EXPRESS
-----------------------------------------------------*/

// server.js
import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from "./routes/sessionRouter.js"
import userRouter from "./routes/userRouter.js"
import githubLoginRouter from "./routes/github-loginRouter.js"
import __dirname from "./utils.js"
import mongoose from 'mongoose';
import { password, PORT, db_name } from "./env.js"
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';


const server= express()

// Configuración de Handlebars
server.engine('hbs', handlebars.engine({
    extname: "hbs",
    defaultLayout: "home",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));

server.set('view engine', 'hbs');
server.set("views", `${__dirname}/views`)


// Middleware para archivos estáticos
server.use(express.static(`${__dirname}/public`));


// Middleware para manejar solicitudes JSON
server.use(express.json());
server.use(express.urlencoded({extended:true}))




const MONGO_URL=`mongodb+srv://micapicasso:${password}@cluster0.boiyenp.mongodb.net/${db_name}?retryWrites=true&w=majority`

// Configuracion de Session
server.use(session(  
    {
         // usando filestore
        // store: new fileStore({path:"./sessions", ttl:15, retries:0}),

        // connect mongo
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            ttl: 10 * 60
        }),
        secret: "coderS3cr3t",
        resave: false,   //guarda en memoria
        saveUninitialized: true //guarda apenas se crea la sesion
    }
))


// middleware de passport
initializePassport();
server.use(passport.initialize());
server.use(passport.session());




// Rutas
server.use('/api/products', productsRouter);
server.use('/api/cart', cartRouter);
server.use('/', viewsRouter);
server.use("/session", sessionRouter)
server.use("/user", userRouter)
server.use("/github", githubLoginRouter)






// Conectar a la base de datos MongoDB
mongoose.connect(
    `mongodb+srv://micapicasso:${password}@cluster0.boiyenp.mongodb.net/${db_name}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
        // Iniciar el servidor una vez conectado a la base de datos
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto: ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB:', error);
    });
