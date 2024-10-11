import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class Tag extends Model {}

Tag.init(
  {
    tag: {
      field: "tag",
      type: DataTypes.STRING(30),
      primaryKey: true,
    },
  },
  { sequelize, tableName: "tags", timestamps: false }
);

export default Tag;
