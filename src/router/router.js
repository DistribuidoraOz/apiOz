import express from 'express';
import { Categorias, Marcas, Productos } from '../models/models.js';
import { upload } from '../lib/cloudinary.js';
import { Op } from 'sequelize'; 

export const router = express.Router();


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

router.post('/newCategory',upload.none(), async(req, res)=>{
    try {
        const nombre = req.body;

        const respuesta = await Categorias.create(nombre);
        res.status(200).json({message: 'Categoria creada con exito!'});
        
    } catch (error) {
        console.log("Error al crear nueva categoria: ", error);
        res.status(500).json({message: 'Error al crear nueva categoria!'});
    }
});

router.delete('/deleteCategory/:id', async(req, res)=>{
    const { id } = req.params;
    console.log("deleteCategory id : ", id)
    try {
      const category = await Categorias.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Categoria no encontrada.' });
      }
      await category.destroy(); // Esto eliminará la categoría y todas las marcas y productos asociados automáticamente
      console.log("Ruta eliminar categoria&&&&&&&&&& ", category);
      res.status(200).json({ message: 'Categoria eliminada correctamente' });
    } catch (error) {
      console.error("Error al eliminar categoria: ",error);
      res.status(500).json({ message: 'Error al eliminar categoria!' });
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

router.post('/newMarca',upload.none(), async(req, res)=>{
    
    try {
        const { nombre, CategoriaId } = req.body;
        const newMarca = {
            nombre,
            CategoriaId,
        }
        console.log("response ruta createMarca: ", newMarca);

        const respuesta = await Marcas.create(newMarca);
        console.log("response ruta createMarca: ", respuesta);
        res.status(200).json({message: 'Marca creada con exito!'});

    } catch (error) {
        console.log("Error al crear nueva Marca: ", error);
        res.status(500).json({message: 'Error al crear nueva Marca.'});
    }
});

router.delete('/deleteMarca/:id', async(req, res)=>{
    const { id } = req.params;
  
    try {
      const marca = await Marcas.findByPk(id);
      if (!marca) {
        return res.status(404).json({ message: 'Marca no encontrada' });
      }
      
      await marca.destroy(); // Esto eliminará la categoría y todas las marcas y productos asociados automáticamente
  
      res.status(200).json({ message: 'Marca eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar la marca!' });
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
            res.status(200).json(producto);
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


router.put('/editProducto',upload.single('imagen'),async(req, res)=>{
    const { id, nombre, descripcion, categoriaId, marcaId} = req.body;
    const editProduct = {}

    if(req.file) editProduct.imagen = req.file.path;
    if(nombre) editProduct.nombre = nombre;
    if(descripcion) editProduct.descripcion = descripcion;
    if(categoriaId) editProduct.CategoriaId = categoriaId;
    if(marcaId) editProduct.MarcaId = marcaId;

    try {
        const response = await Productos.update(editProduct, {where: {id}});
        res.status(200).json({message: "Se actualizo con exito su producto."})
    } catch (error) {
        console.log("error al actializar producto API SIDE: ", error);
        res.status(500).json({message: "Error al actualizar producto."});
    }
    
});

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

router.get('/searchProduct', async(req, res)=>{
    
    const query = req.query.name;
    
    try {
        const productos = await Productos.findAll({
            attributes:['id', 'nombre', 'descripcion', 'imagen'],
            where: {
                nombre: { [Op.iLike]: `%${query}%` }
            },
            order: ['nombre'],
            limit: 20,
        });
        if(productos.length === 0){
            res.status(404).json({message: "No se encontraron productos con este nombre"});
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
        console.log("Error al buscar productos con este nombre: ", error);
        res.status(500).json({message: 'Error al buscar productos por nombre.'});
    }
});

