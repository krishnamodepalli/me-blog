import { DataTypes, Model } from "sequelize";

import sequelize from "../sequelize";
import Tag from "./Tag";
import PostTags from "./PostTags";

class Post extends Model {
  addTag(tagName: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // check if the tag exists
      let tag = (await Tag.findByPk(tagName)) as Tag;
      if (!tag) {
        // if tag is not found, we will create it
        tag = await Tag.create({ tag: tagName });
      }
      const postID = this.dataValues.id as string;
      try {
        await PostTags.create({ post: postID, tag: tagName });
      } catch (err) {
        reject(
          `Cannot delete the relation between post ${postID} & tag ${tagName}`
        );
      }
      resolve();
    });
  }
  removeTag(tagName: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const postID = this.dataValues.id as string;

      // finding the post_tag relation
      const pt = await PostTags.findOne({
        where: {
          post: postID,
          tag: tagName,
        },
      });
      if (!pt) {
        resolve();
        return;
      }
      // destroying it
      try {
        await pt.destroy();
        resolve();
      } catch (err) {
        reject(
          `Cannot delete the relation between post ${postID} & tag ${tagName}`
        );
      }
    });
  }
}

Post.init(
  {
    id: {
      field: "id",
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bannerImgURL: {
      field: "bannerURL",
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    title: {
      field: "title",
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      field: "content",
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { sequelize, tableName: "posts" }
);

export default Post;
