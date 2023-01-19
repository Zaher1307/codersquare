const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
})

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
})

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: true,
  updatedAt: false
})

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: true,
  updatedAt: false
})

const Like = sequelize.define('Like', {
}, {
  tableName: 'likes',
  timestamps: false
})

Post.belongsToMany(User, { through: Like, foreignKey: 'postId' })
User.belongsToMany(Post, { through: Like, foreignKey: 'userId' })

Post.belongsToMany(User, { through: Comment, foreignKey: 'postId' })
User.belongsToMany(Post, { through: Comment, foreignKey: 'userId' })

User.hasMany(Post, { foreignKey: 'userId' })
Post.belongsTo(User, { foreignKey: 'userId' })

async function initDatabase () {
  await sequelize.sync()
}

module.exports = {
  User,
  Post,
  Comment,
  Like,
  initDatabase
}
