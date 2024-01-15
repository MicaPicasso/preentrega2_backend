/* ---------------------------------------------------
                CONFIGURACION DE EXPRESS
-----------------------------------------------------*/

// app.js
import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from "./utils.js"
import mongoose from 'mongoose';
import { password, PORT, db_name } from "./env.js"
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';




const app = express();

// Configuración de Handlebars
app.engine('hbs', handlebars.engine({
    extname: "hbs",
    defaultLayout: "home",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));

app.set('view engine', 'hbs');
app.set("views", `${__dirname}/views`)


// Middleware para archivos estáticos
app.use(express.static(`${__dirname}/public`));

// Middleware para manejar solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/', viewsRouter);


// Conectar a la base de datos MongoDB
mongoose.connect(
    `mongodb+srv://micapicasso:${password}@cluster0.boiyenp.mongodb.net/${db_name}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
        // Iniciar el servidor una vez conectado a la base de datos
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto: ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB:', error);
    });
