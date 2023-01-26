const { DataTypes } = require('sequelize')

const commentInit = (sequelize) => {
  return sequelize.define('Comment', {
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
}

module.exports = commentInit
