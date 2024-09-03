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

export default sequelize;