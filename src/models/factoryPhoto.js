import Sequelize, { Model } from 'sequelize'
import databaseConfig from '../config/database'

export default function factoryPhoto () {
  class Photo extends Model {}

  Photo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    originalname: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Necessário fornecer originalname'
      }
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Necessário fornecer filename'
      }
    }
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'photos',
    modelName: 'Photos'
  })

  return Photo
}
