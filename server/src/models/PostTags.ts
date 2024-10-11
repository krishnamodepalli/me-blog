import { DataTypes, Model } from "sequelize";

import sequelize from "../sequelize";

class PostTags extends Model {}

PostTags.init({}, { sequelize, tableName: "post_tags", timestamps: false });

export default PostTags;
