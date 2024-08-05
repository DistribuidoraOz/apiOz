import { Sequelize } from 'sequelize';
import 'dotenv/config';


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions:{
        ssl:{
            require: true,
            rejectUnauthorized: false,
        }
    },
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

/*
//Local host dev

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
})
*/

export default sequelize;