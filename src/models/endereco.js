const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class endereco extends Model {
    static associate(models) {
      endereco.belongsTo(models.aluno, {
        as: 'alunos',
        foreignKey: 'endereco_id',
      });
    }
  }
  endereco.init({
    endereco_id: DataTypes.INTEGER,
    municipio: DataTypes.STRING,
    rua: DataTypes.STRING,
    numero: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'enderecos',
    modelName: 'endereco',
  });
  return endereco;
};
