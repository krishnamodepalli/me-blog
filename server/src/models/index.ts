import Draft from "./Draft";
import Post from "./Post";
import Tag from "./Tag";
import PostTags from "./PostTags";
import sequelize from "../sequelize";

Post.belongsToMany(Tag, { through: PostTags, foreignKey: "post" });
Tag.belongsToMany(Post, { through: PostTags, foreignKey: "tag" });

// DEVELOPMENT MODE ONLY //
const sync = async () => {
  await sequelize.sync({ force: true });
  console.log("Database is synced!!");
};

export { Draft, Post, Tag, sync };
