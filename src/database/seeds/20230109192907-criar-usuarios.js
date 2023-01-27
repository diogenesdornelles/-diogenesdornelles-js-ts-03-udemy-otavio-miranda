const bcrypt = require('bcrypt')

function generateHash (data) {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(data, salt)
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [{
        nome: 'Tato',
        email: 'tato@gmail.com',
        password_hash: generateHash('123456'),
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      }],
      {}
    )
  },

  async down () {}
}
