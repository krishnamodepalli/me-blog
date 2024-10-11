import { DataTypes, Model } from "sequelize";

import sequelize from "../sequelize";
import Post from "./Post";

class Draft extends Model {
  convertToPost = async (): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {
      // first we need to create a new post or update an existing post.
      const post = await Post.findByPk(this.dataValues.id);
      if (post) {
        // there exists a post with this uuid, so we need to update the post.
        const title = post.dataValues.title as string;
        const content = post.dataValues.content as string;
        try {
          await post.update({ title, content });
          await this.destroy();
          resolve();
        } catch (error) {
          reject("Cannot convert this draft into post.");
        }
      } else {
        // if no post with this uuid exists, we need to create a new one.
        const uuid = this.dataValues.id as string;
        const title = this.dataValues.title as string;
        const content = this.dataValues.content as string;

        try {
          await Post.create({ id: uuid, title, content });
          await this.destroy();
          resolve();
        } catch (e) {
          console.log(e);
          reject();
        }
      }
    });
  };
}

Draft.init(
  {
    id: {
      field: "id",
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      field: "title",
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    content: {
      field: "content",
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { sequelize, tableName: "drafts" }
);

export default Draft;
