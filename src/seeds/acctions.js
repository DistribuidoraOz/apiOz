// Función para leer y parsear el archivo .json
import fs from 'fs';
import path from 'path';
import { Categorias } from '../models/models.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function insert_seeds(ruta, tabla){

    try {
        const filePath = path.join(__dirname, `${ruta}`);
        const data = fs.readFileSync(filePath, 'utf-8');
        const items = JSON.parse(data);
        
        await tabla.bulkCreate(items);
        console.log('Items insertados con exito en la base de datos!');

    } catch (error) {
        console.log('Error al insertar Items a la base de datos: ', error);
    }
}

function readJsonFile(ruta) {
    try {
        const filePath = path.join(__dirname, `${ruta}`);
        const data = fs.readFileSync(filePath, 'utf8');      
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error leyendo el archivo: `, error);
        return null;
    }
}
function writeJsonFile(ruta, data) {
    try {
        const filePath = path.join(__dirname, `${ruta}`);
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf8');
    } catch (error) {
        console.error(`Error escribiendo en el archivo ${ruta}:`, error);
    }
}

export async function addCategoryToMarcasJson(list_marcas, marcas_to_db) {
    // Leer el archivo JSON
    try {
        const data = await readJsonFile(list_marcas);
        if (!data) {
            console.error(`No se pudo leer el archivo ${list_marcas}.`);
            return null;
        }
        console.log("dataaaaa:::::: ", data);

        const category = await Categorias.findAll();

        const newJson = [];

        // Iterar sobre cada elemento del JSON
        data.forEach(item => {
            //comparar y modificar un valor según alguna condición
            category.forEach(valor=>{
                if(item.CategoriaId === valor.dataValues.nombre){
                    item.CategoriaId = valor.dataValues.id
                }
            })
            newJson.push(item);
        });
        // Escribir el JSON modificado de vuelta al archivo
        writeJsonFile(marcas_to_db, newJson);
        console.log(`JSON modificado y guardado en ${marcas_to_db}.`);

    } catch (error) {
        console.log("Error al editar CategoriaId en marcas_to_db.json: ", error);
        return null;
    }
}