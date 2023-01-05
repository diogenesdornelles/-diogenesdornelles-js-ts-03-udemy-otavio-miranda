import Sequelize, { Model } from 'sequelize'
import databaseConfig from '../config/database'

export default function factoryCurso () {
  class Curso extends Model {}

  Curso.init({
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
        msg: '"curso" já consta na base de dados!'
      },
      validate: {
        len: {
          args: [3, 255],
          msg: '"nome" deve ter 03 caracteres ou mais.'
        }
      }
    },
    periodo: {
      type: Sequelize.STRING,
      allowNull: false,
      isIn: {
        args: [['diurno', 'noturno', 'diurno e noturno']],
        msg: '"periodo" deve ser noturno, diurno ou diurno e noturno!'
      }
    },
    duracao_semestres: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Duração em semestres deve ser inteiro "duracao_semestres".'
        },
        len: {
          args: [4, 255],
          msg: 'Duração deve ser no mínimo 04 semestres!'
        }
      }
    },
    mes_inicio: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '01/1970',
      validate: {
        customValidator (value) {
          const date = /^[0-9]{2}\/[0-9]{4}$/i
          if (!date.test(value)) {
            throw new Error('Fornecer "mes_inicio" válido (mm/aaaa)!')
          }
          const month = value.slice(0, 2)
          const year = value.slice(3)
          const currentYear = new Date().getFullYear()
          if (!(month > 0 && month < 13) || !(year >= currentYear)) { throw new Error('Fornecer "mes_inicio" válido (mm/aaaa)!') }
        }
      }
    },
    n_alunos_matriculados: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    alunos_id: {
      type: Sequelize.TEXT('long'),
      allowNull: false,
      defaultValue: '{}'
    },
    ativo: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'cursos',
    modelName: 'Curso'
  })
  return Curso
};
