import express from 'express';
import { Categorias, Marcas, Productos } from '../models/models.js';
import { upload } from '../lib/cloudinary.js'

export const router = express.Router();

/////////// ruta inicial  /////////////////

router.get('/', (req, res)=>{
    res.status(200).json({message: "Welcome to api DistribuidoraOz!"});
});


///////////  categorias rutas /////////////////

router.get('/categoryById/:id', async(req, res)=>{

    try {

        const category = await Categorias.findOne({
            attributes: ['nombre'],
            where: {id: req.params.id}
        });
        if(category === null){
            res.status(404).json({message: "No se encontro categoria con ese id!"});
        }else{
            res.status(200).json(category);
        }      
    } catch (error) {
        console.log("Error al recuperar categoria por id: ", error);
        res.status(500).json({message: 'Error al recuperar categoria por id!'});
    }
});

router.get('/categorys', async(req, res)=>{
    //console.log("FFFFFFFFFFFFFFFFFFFFcategory");
    try {
        const categorys = await Categorias.findAll({
            attributes: ['id', 'nombre'],
            order: ['nombre'],
        });
        if(categorys.length === 0){
            res.status(404).json({message: "No se recupero lista de categorias!"});
        }else{
            const categoryList = categorys.map((item)=>({
                id: item.id,
                nombre : item.nombre
            }));
            res.status(200).json(categoryList);
        }        
    } catch (error) {
        console.log("Error al recuperar lista de categorias: ", error);
        res.status(500).json({error: 'Error al recuperar lista de categorias!'});
    }
});

///////////// MARCAS RUTAS ////////////////

router.get('/marcasByCategoryId/:id', async(req, res)=>{
    try {
        const marcas = await Marcas.findAll({
            attributes: ['id', 'nombre'],
            where: { CategoriaId: req.params.id},
            order: ['nombre'],
        });
        if(marcas.length === 0){
            res.status(404).json({message: "No se encontraron marcas con esa categoria id!"});
        }else{
            const marcasList = marcas.map((item)=>({
                id: item.id,
                nombre : item.nombre
            }));
            res.status(200).json(marcasList);
        }        
    } catch (error) {
        console.log("Error al recuperar marcas por categoria id: ", error);
        res.status(500).json({error: 'Error al recuperar marcas por categoria id!'});
    }
});

router.get('/marcas', async(req, res)=>{
    try {
        const marcas = await Marcas.findAll({
            attributes: ['id', 'nombre', 'CategoriaId'],
        });
        if(marcas.length === 0){
            res.status(404).json({message: "No se recupero lista de marcas!"});
        }else{
            const marcasList = marcas.map((item)=>({
                id: item.id,
                nombre : item.nombre,
                categoriaId: item.CategoriaId
            }));
            res.status(200).json(marcasList);
        }
    } catch (error) {
        console.log("error al recuperar lista de marcas: ", error);
        res.status(500).json({error: 'Error al recuperar lista de Marcas!'});
    }
});

////////////   PRODUCTOS RUTAS    /////////////////

router.get('/productosByMarcaId/:id', async(req, res)=>{
    try {
        const productos = await Productos.findAll({
            attributes: ['id', 'nombre', 'descripcion', 'imagen'],
            where: { MarcaId: req.params.id },
            order: ['nombre'],
        });
        if(productos.length === 0){
            res.status(404).json({message: "No se encontraron productos de esta marca!"});
        }else{
            const data = productos.map((item)=>({
                id: item.id,
                nombre: item.nombre,
                descripcion: item.descripcion,
                imagen: item.imagen
            }));
            res.status(200).json(data);
        }
    } catch (error) {
        console.log("Error al recuperar productos por marca id: ", error);
        res.status(500).json({error: 'Error al recuperar productos por marca id!'});
    }
});

router.get('/producto/:id', async(req, res)=>{
    
    try {
        const producto = await Productos.findByPk(req.params.id);
        if(producto === null){
            res.status(404).json({message: "No se encontro el producto!"});
        }else{
            res.status(200).json(response);
        }
    } catch (error) {
        console.log("Error al recuperar producto por id: ", error);
        res.status(500).json({message: "Error al recuperar producto por id!"});
    }
});

router.get('/productoByCategory/:id', async (req, res)=>{
    
    const id = req.params.id;
    try {
        const productos = await Productos.findAll({
            attributes:['id', 'nombre', 'descripcion', 'imagen'],
            where: {CategoriaId: id},
            order: ['nombre'],
            limit: 15,
        });
        if(productos.length === 0){
            res.status(404).json({message: "No se encontraron productos de esta categoria"});
        }else{
            const data = productos.map((item)=>({
                id: item.id,
                nombre: item.nombre,
                descripcion: item.descripcion,
                imagen: item.imagen
            }));
            res.status(200).json(data);
        }
    } catch (error) {
        console.log("Error al recuperar productos por categoria: ", error);
        res.status(500).json({message: 'Error al recuperar productos por categoria.'});
    }
});

router.post('/newProduct', upload.single("imagen"), async(req, res)=>{

    try {
        const{ path } = req.file;
        const {nombre, descripcion, categoriaId, marcaId} = req.body;

        const newProducto = {
            nombre,
            descripcion,
            imagen: path,
            CategoriaId: categoriaId,
            MarcaId: marcaId
        }
        //console.log("Producto :", newProducto);
        const response = await Productos.create(newProducto);
        
        res.status(200).json({message: 'El producto se creo con extito!'});

    } catch (error) {
        console.log("Error al crear nuevo producto: ", error);
        res.status(500).json({message: 'Error al crear nuevo producto!'});
    }
});

/*
router.put('/edit-producto/:id', upload.none(), async(req, res)=>{
    try {
        
        //console.log("Soy producto.PUT_FILE: ", req.file.path);
        
        console.log("Soy producto.PUT: ", req.body);

        console.log("Soy producto.PUT ultimoooOOOOOOO: ");

        res.status(200).json({message: "Se actualizo con exito su producto."})
    } catch (error) {
        console.log("error al actializar producto API SIDE: ", error);
        res.status(500).json({message: "Error al actualizar producto."});
    }

});
*/
router.delete('/deleteProduct/:id', async(req, res)=>{

    try {
        const response = await Productos.destroy({
            where: {
              id: req.params.id,
            },
        });
        res.status(200).json({message: 'Producto borrado con exito!'});
    } catch (error) {
        console.log("Error al borrar producto: ", error);
        res.status(500).json({message: 'Error al borrar producto!'});
    }

});

