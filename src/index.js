import express from 'express';
import dotenv from 'dotenv';
import { router } from './router/router.js';
import sequelize from './db/db.js';
import cors from 'cors'

dotenv.config();
const app = express();

app.use(cors());


app.set('port', process.env.PORT || 5000);


app.use(express.json());
app.use('/', router);

async function main(){
    try {
        
        await sequelize.sync({alter: true});

            console.log("Coneccion exitosa con la base de datos!");

    } catch (err) {

        console.log("Error al conectarse con la base de datos: ", err);
    }
}
main();

app.listen(app.get('port'), ()=>{
    console.log(`Server run on port: ${app.get('port')}`);
});
