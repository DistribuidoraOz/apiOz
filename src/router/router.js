import express, { json } from 'express';
import { Categorias, Marcas, Productos } from '../models/models.js';
import { upload } from '../lib/cloudinary.js'
import { where } from 'sequelize';

export const router = express.Router();

///////////  categorias rutas /////////////////

router.get('/categoria/:id', async(req, res)=>{
    console.log("categoria por id");

    try {

        const category = await Categorias.findOne({
            attributes: ['nombre'],
            where: {id: req.params.id}
        });
        //console.log("categoria recuperada: ", category)
        res.status(200).json(category);
    } catch (error) {
        console.log("Error categoria by id: ", error);
        res.status(500).json({message: 'Error al recuperar categoria por id!'})
    }
});

router.get('/categorias', async(req, res)=>{
    //console.log("FFFFFFFFFFFFFFFFFFFFcategory");
    try {
        const categorys = await Categorias.findAll({
            attributes: ['id', 'nombre'],
            order: ['nombre'],
        });

        const categoryList = categorys.map((item)=>({
            id: item.id,
            nombre : item.nombre
        }));

        //console.log('se recuperaron con exito las Marcas ', marcasList);
        res.status(200).json(categoryList);
    } catch (error) {
        console.log("error al recuperar los datosXXXX: ", error);
        res.status(500).json({error: 'Error al recuperar all category!'});
    }
});

///////////// MARCAS RUTAS ////////////////

router.get('/marcas/:id', async(req, res)=>{
    try {
        const marcas = await Marcas.findAll({
            attributes: ['id', 'nombre'],
            where: { CategoriaId: req.params.id},
            order: ['nombre'],
        });

        const marcasList = marcas.map((item)=>({
            id: item.id,
            nombre : item.nombre
        }));

        //console.log('se recuperaron con exito las Marcas ', marcasList);
        res.status(200).json(marcasList);
    } catch (error) {
        console.log("error al recuperar los datos: ", error);
        res.status(500).json({error: 'Error al recuperar Marcas!'});
    }
});

router.get('/marcas', async(req, res)=>{
    try {
        const marcas = await Marcas.findAll({
            attributes: ['id', 'nombre', 'CategoriaId'],
        });

        const marcasList = marcas.map((item)=>({
            id: item.id,
            nombre : item.nombre,
            categoriaId: item.CategoriaId
        }));

        console.log('se recuperaron con exito TODAS las Marcas ');
        res.status(200).json(marcasList);
    } catch (error) {
        console.log("error al recuperar los datos: ", error);
        res.status(500).json({error: 'Error al recuperar Marcas!'});
    }
});

router.get('/marca/:id', async(req, res)=>{
    try {
        console.log("addddddddadadadadadddddddd")
        const marca = await findOne({
            attributes: ['nombre'],
            where: {id: req.params.id}
        });
        res.status(200).json(marca);
    } catch (error) {
        console.log("agagagagagaTTTTTTTTTTTTTTTTTTT")
        res.status(500),json({mesaje: 'No se pudo recuperar marca por id.'})
    }
});
////////////   PRODUCTOS RUTAS    /////////////////

router.get('/productos/:id', async(req, res)=>{
    try {
        const response = await Productos.findAll({
            attributes: ['id', 'nombre', 'descripcion', 'imagen'],
            where: { MarcaId: req.params.id },
            order: ['nombre'],
        });

        const data = response.map((item)=>({
            id: item.id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            imagen: item.imagen
        }));

        //console.log("exito al recuperar productos: ", data);
        res.status(200).json(data);
    } catch (error) {
        console.log("error al traer los productos: ", error);
        res.status(500).json({error: 'Fallo al traer productos!'});
    }
});

router.get('/producto/:id', async(req, res)=>{
    
    try {
        const response = await Productos.findByPk(req.params.id);
        if(response === null){
            //console.log("Not Found!****************");
        }else{
            //console.log("soy response product_id: ", response);
            res.status(200).json(response);
        }
    } catch (error) {
        console.log("error al recuperar producto por id: ", error);
    }
});

router.get('/productoByCategory/:id', async (req, res)=>{
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHH")
    const id = req.params.id;
    try {
        const productos = await Productos.findAll({
            attributes:['id', 'nombre', 'descripcion', 'imagen'],
            where: {categoriaId: id},
            order: ['nombre'],
            limit: 15,
        });
        const data = productos.map((item)=>({
            id: item.id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            imagen: item.imagen
        }));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({message: 'error al recuperar productos por categoria.'});
    }
});

router.post('/newproduct', upload.single("imagen"), async(req, res)=>{
    //console.log("reqBodyyyyyyyyyy", req.body);

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
        console.log("Producto :", newProducto);

        const response = await Productos.create(newProducto);

        console.log("Producto creado con exito!", response);
        
        res.status(200).json({message: 'todo salio bien!'});

    } catch (error) {

        console.log("error al guardar nuevo producto en la db: ", error);
        res.status(500).json({message: 'no se pudo cargar los datos!'});
    }

});

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

router.delete('/delete-producto/:id', async(req, res)=>{
    
    console.log("estoy en delete product", req.params.id);

    try {
        const response = await Productos.destroy({
            where: {
              id: req.params.id,
            },
        });
        res.status(200).json({message: 'Producto borrado con exito!'});
    } catch (error) {
        console.log("no se pudo borrar el producto: ", error);
        res.status(500).json({message: 'error al borrar producto!'});
    }

});

