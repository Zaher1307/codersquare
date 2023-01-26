const { DataTypes } = require('sequelize')

const postInit = (sequelize) => {
  return sequelize.define('Post', {
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
}

module.exports = postInit
