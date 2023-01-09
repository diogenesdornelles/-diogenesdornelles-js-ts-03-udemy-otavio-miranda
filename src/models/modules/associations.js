export function associateAlunoToEndereco (Aluno, Endereco) {
  Aluno.belongsTo(Endereco, {
    foreignKey: 'endereco_id',
    targetKey: 'id'
  })
  Endereco.hasOne(Aluno)
}

export function associateAlunoToCurso (Aluno, Curso) {
  Aluno.belongsTo(Curso, {
    foreignKey: 'curso_id',
    targetKey: 'id'
  })
  Curso.hasMany(Aluno)
}

export function associateAlunoToTurma (Aluno, Turma) {
  Aluno.belongsTo(Turma, {
    foreignKey: 'turma_id',
    targetKey: 'id'
  })
  Turma.hasMany(Aluno)
}

export function associateTurmaToCurso (Turma, Curso) {
  Turma.belongsTo(Curso, {
    foreignKey: 'curso_id',
    targetKey: 'id'
  })
  Curso.hasMany(Turma)
}
