import fs from 'fs';
import path from 'path';
import sequelize from '../db/db.js';
import { Categorias, Marcas } from '../models/models.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function insert_seeds(ruta, tabla){

    try {
        const filePath = path.join(__dirname, `${ruta}`);
        const data = fs.readFileSync(filePath, 'utf-8');
        const items = JSON.parse(data);
        
        await tabla.bulkCreate(items);
        console.log('Items insertados con exito en la base de datos!');

    } catch (error) {
        console.log('Error al insertar Items a la base de datos: ', error);
    } finally {
        await sequelize.close();
        console.log("Conexion con la base de datos cerrada!");
    }
}

insert_seeds('categorias.json', Categorias);
insert_seeds('marcas.json', Marcas);
