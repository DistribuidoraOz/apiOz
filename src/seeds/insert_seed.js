import { insert_seeds, addCategoryToMarcasJson } from "./acctions.js";
import { Categorias, Marcas } from "../models/models.js";


async function insert(){
    await insert_seeds('categorias.json', Categorias);
    await addCategoryToMarcasJson('marcas.json', 'marcas_to_db.json');
    await insert_seeds('marcas_to_db.json', Marcas);
}

insert();

