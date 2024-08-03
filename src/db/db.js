import { Sequelize } from 'sequelize';
import 'dotenv/config';


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

export default sequelize;