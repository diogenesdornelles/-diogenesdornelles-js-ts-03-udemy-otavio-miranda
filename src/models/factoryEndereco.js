import Sequelize, { Model } from 'sequelize';
import databaseConfig from '../config/database';

export default function factoryEndereco() {
  class Endereco extends Model {
    static associate(models) {
      Endereco.belongsTo(models.Aluno, {
        as: 'alunos',
        foreignKey: 'id',
      });
    }
  }
  Endereco.init({
    municipio: Sequelize.STRING,
    rua: Sequelize.STRING,
    numero: Sequelize.INTEGER,
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'enderecos',
    modelName: 'Endereco',
  });
  return Endereco;
}
