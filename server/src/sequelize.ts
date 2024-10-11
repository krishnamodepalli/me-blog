
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.PG_URI as string);

export default sequelize;
