import { Sequelize } from 'sequelize';
import 'dotenv/config';


const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

export default sequelize;