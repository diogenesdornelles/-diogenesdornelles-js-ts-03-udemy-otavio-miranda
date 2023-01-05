import Sequelize, { Model } from 'sequelize'
import databaseConfig from '../config/database'

export default function factoryEndereco () {
  class Endereco extends Model {}

  Endereco.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    municipio: Sequelize.STRING,
    rua: Sequelize.STRING,
    numero: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Número de endereço deve ser inteiro.'
        }
      }
    },
    ativo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'enderecos',
    modelName: 'Endereco'
  })

  return Endereco
}
