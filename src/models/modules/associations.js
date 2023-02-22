export default class Associations {
  static associateAlunoToEndereco (Aluno, Endereco) {
    Aluno.belongsTo(Endereco, {
      foreignKey: 'endereco_id',
      targetKey: 'id',
      as: 'endereco'
    })
    Endereco.hasOne(Aluno)
  }

  static associateAlunoToCurso (Aluno, Curso) {
    Aluno.belongsTo(Curso, {
      foreignKey: 'curso_id',
      targetKey: 'id',
      as: 'curso'
    })
    Curso.hasMany(Aluno)
  }

  static associateAlunoToTurma (Aluno, Turma) {
    Aluno.belongsTo(Turma, {
      foreignKey: 'turma_id',
      targetKey: 'id',
      as: 'turma'
    })
    Turma.hasMany(Aluno)
  }

  static associateAlunoToPhoto (Aluno, Photo) {
    Aluno.belongsTo(Photo, {
      foreignKey: 'photo_id',
      targetKey: 'id',
      as: 'photo'
    })
    Photo.hasMany(Aluno)
  }

  static associateTurmaToCurso (Turma, Curso) {
    Turma.belongsTo(Curso, {
      foreignKey: 'curso_id',
      targetKey: 'id',
      as: 'curso'
    })
    Curso.hasMany(Turma)
  }
}
