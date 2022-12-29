const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class aluno extends Model {
    static associate(models) {
      aluno.hasMany(models.endereco, {
        foreignKey: 'endereco_id',
      });
    }
  }
  aluno.init({
    aluno_id: DataTypes.INTEGER,
    nome: DataTypes.STRING,
    sobrenome: DataTypes.STRING,
    email: DataTypes.STRING,
    nascimento: DataTypes.DATE,
    endereco_id: DataTypes.INTEGER,
    ativo: DataTypes.BOOLEAN,
  }, {
    sequelize,
    tableName: 'alunos',
    modelName: 'aluno',
  });
  return aluno;
};
