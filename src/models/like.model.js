const likeInit = (sequelize) => {
  return sequelize.define('Like', {
  }, {
    tableName: 'likes',
    timestamps: false
  })
}

module.exports = likeInit
