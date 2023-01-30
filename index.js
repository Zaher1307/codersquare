const app = require('./src/app')
const { initDatabase } = require('./src/models/index')

;(async () => {
  try {
    await initDatabase()
    app.listen(process.env.PORT)
  } catch (err) {
    process.exit(1)
  }
})()

module.exports = app
