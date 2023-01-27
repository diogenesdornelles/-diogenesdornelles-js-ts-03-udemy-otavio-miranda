'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('enderecos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      municipio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rua: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)')
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('enderecos')
  }
}
