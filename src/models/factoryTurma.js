import Sequelize, { Model } from 'sequelize'
import databaseConfig from '../config/database'

export default function factoryTurma () {
  class Turma extends Model {}

  Turma.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
      unique: {
        args: true,
        msg: 'Turma já consta na base de dados!'
      },
      validate: {
        len: {
          args: [3, 255],
          msg: '"nome" deve ter 03 caracteres ou mais.'
        }
      }
    },
    curso_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Id de curso deve ser numérico.'
        }
      }
    },
    ativo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'turmas',
    modelName: 'Turma'
  })
  return Turma
};
