import Sequelize, { Model } from 'sequelize';
import databaseConfig from '../config/database';

export default function factoryAluno() {
  class Aluno extends Model {
    static associate(models) {
      Aluno.hasMany(models.Endereco, {
        foreignKey: 'endereco_id',
      });
    }
  }
  Aluno.init({
    nome: Sequelize.STRING,
    sobrenome: Sequelize.STRING,
    email: Sequelize.STRING,
    nascimento: Sequelize.DATE,
    endereco_id: Sequelize.INTEGER,
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'alunos',
    modelName: 'Aluno',
  });
  return Aluno;
}
