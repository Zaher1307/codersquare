const { Sequelize } = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
})

const User = require('./user.model')(sequelize)
const Post = require('./post.model')(sequelize)
const Comment = require('./comment.model')(sequelize)
const Like = require('./like.model')(sequelize)

async function initDatabase () {
  Post.belongsToMany(User, { through: Like, foreignKey: 'postId' })
  User.belongsToMany(Post, { through: Like, foreignKey: 'userId' })

  Post.belongsToMany(User, { through: { model: Comment, unique: false }, foreignKey: 'postId' })
  User.belongsToMany(Post, { through: { model: Comment, unique: false }, foreignKey: 'userId' })

  User.hasMany(Post, { foreignKey: 'userId' })
  Post.belongsTo(User, { foreignKey: 'userId' })
  await sequelize.sync()
}

module.exports = {
  User,
  Post,
  Comment,
  Like,
  initDatabase
}
