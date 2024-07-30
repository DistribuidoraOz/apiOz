import sequelize from "../db/db.js";
import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from 'uuid';


export class Categorias extends Model {};

Categorias.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        hooks: {
            beforeCreate: (categorias)=>{
                categorias.forEach((categoria)=>{
                    if(!categoria.id)
                        categoria.id = uuidv4();
                });
            }
        },
        sequelize
    }
);

export class Marcas extends Model {};

Marcas.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        hooks: {
            beforeCreate: (marcas)=>{
                marcas.forEach((marca)=>{
                    if(!marca.id)
                        marca.id = uuidv4();
                });
            }
        },
        sequelize
    }
);

export class Productos extends Model {};

Productos.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: uuidv4,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        hooks: {
            beforeCreate: (producto)=>{
                if(!producto.id)
                    producto.id = uuidv4();
            }
        },
        sequelize
    }
);

//Relaciones:
//una categoria tiene varias marcas
Categorias.hasMany(Marcas, {
    foreignKey: {
        allowNull: false,
        type: DataTypes.UUID
    }
});
//una marca pertenece solo a una categoria
Marcas.belongsTo(Categorias);

//una categoria tiene muchos productos:
Categorias.hasMany(Productos, {
    foreignKey: {
        allowNull: false,
        type: DataTypes.UUID
    }
}); 

//un producto tiene solo una categoria:
Productos.belongsTo(Categorias);

//una marca tiene muchos productos:
Marcas.hasMany(Productos, {
    foreignKey: {
        allowNull: false,
        type: DataTypes.UUID
    }
});

//un producto tiene solo una marca:
Productos.belongsTo(Marcas);

