import Sequelize, { Model } from 'sequelize'
import databaseConfig from '../config/database'

export default function factoryAluno () {
  class Aluno extends Model {}

  Aluno.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    nome: {
      type: Sequelize.STRING,
      defaultValue: '',
      validate: {
        len: {
          args: [3, 255],
          msg: 'Nome deve ter 03 caracteres ou mais.'
        }
      }
    },
    sobrenome: {
      type: Sequelize.STRING,
      defaultValue: '',
      validate: {
        len: {
          args: [3, 255],
          msg: 'Sobrenome deve ter 03 caracteres ou mais.'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      defaultValue: '',
      unique: {
        args: true,
        msg: 'Email já consta na base de dados!'
      },
      validate: {
        isEmail: {
          msg: 'E-mail inválido.'
        }
      }
    },
    dtnascimento: Sequelize.DATE,
    endereco_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Id de endereço deve ser numérico.'
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
    turma_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Id de turma deve ser numérico.'
        }
      }
    },
    ativo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'alunos',
    modelName: 'Aluno'
  })
  return Aluno
}
