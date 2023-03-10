/* eslint-disable camelcase */
import factoryAluno from '../models/factoryAluno'
import factoryCurso from '../models/factoryCurso'
import factoryEndereco from '../models/factoryEndereco'
import factoryPhoto from '../models/factoryPhoto'
import factoryTurma from '../models/factoryTurma'
import Associations from '../models/modules/Associations'
const validator = require('validator')

class AlunoController {
  // user create an aluno

  async create (req, res) {
    await AlunoController.validateAluno(req, res)
    if (res.statusCode > 299) return
    try {
      const Aluno = factoryAluno()
      const aluno = await Aluno.create(req.body)
      const { id, nome, sobrenome, email, dtnascimento, endereco_id, curso_id, turma_id, photo_id } = aluno
      await AlunoController.insertOnCurso(aluno)
      return res.status(201).json({ success: { id, nome, sobrenome, email, dtnascimento, endereco_id, curso_id, turma_id, photo_id } })
    } catch (err) {
      console.log(err)
      const { errors } = err
      const er = {}
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message
      })
      return res.status(400).json(er)
    }
  }

  // index - show all alunos ativos
  async index (req, res) {
    try {
      const Aluno = factoryAluno()
      const alunos = await Aluno.findAll({
        where: {
          ativo: true
        },
        attributes: ['id', 'nome', 'sobrenome', 'email', 'dtnascimento', 'endereco_id', 'curso_id', 'turma_id', 'photo_id']
      })
      return res.status(200).json(alunos)
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // show one aluno
  async show (req, res) {
    AlunoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Aluno = factoryAluno()
      const Endereco = factoryEndereco()
      const Curso = factoryCurso()
      const Turma = factoryTurma()
      const Photo = factoryPhoto()
      Associations.associateAlunoToEndereco(Aluno, Endereco)
      Associations.associateAlunoToCurso(Aluno, Curso)
      Associations.associateAlunoToTurma(Aluno, Turma)
      Associations.associateAlunoToPhoto(Aluno, Photo)
      const aluno = await Aluno.findOne({
        where: {
          id
        },
        attributes: ['id', 'nome', 'sobrenome', 'email', 'dtnascimento'],
        order: [['id', 'DESC']],
        include: [{
          model: Endereco,
          as: 'endereco',
          attributes: ['id', 'municipio', 'rua', 'numero']
        }, {
          model: Curso,
          as: 'curso',
          attributes: ['id', 'nome', 'periodo']
        }, {
          model: Turma,
          as: 'turma',
          attributes: ['id', 'nome', 'curso_id']
        }, {
          model: Photo,
          as: 'photo',
          attributes: ['id', 'filename', 'originalname', 'url']
        }
        ]
      })
      return res.status(200).json(aluno)
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // update an aluno
  async update (req, res) {
    AlunoController.validateId(req, res)
    if (res.statusCode > 299) return
    await AlunoController.validateAluno(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Aluno = factoryAluno()
      const aluno = await Aluno.findByPk(id)
      if (!aluno) {
        return res.status(400).json({
          error: 'Aluno n??o existe no cadastro!'
        })
      }
      const idOldCurso = aluno.curso_id
      const alteredAluno = await aluno.update(req.body)
      const { nome, sobrenome, email, dtnascimento, endereco_id, curso_id, turma_id, photo_id } = alteredAluno
      AlunoController.updateCurso(alteredAluno, idOldCurso)
      return res.status(200).json({ success: { id, nome, sobrenome, email, dtnascimento, endereco_id, curso_id, turma_id, photo_id } })
    } catch (err) {
      console.log(err)
      const { errors } = err
      const er = {}
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message
      })
      return res.status(400).json(er)
    }
  }

  // delete an aluno
  async delete (req, res) {
    AlunoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Aluno = factoryAluno()

      const aluno = await Aluno.findByPk(id)
      if (!aluno) {
        return res.status(400).json({
          error: 'Aluno n??o existe no cadastro!'
        })
      }
      await aluno.update({ ativo: false })
      await AlunoController.deleteFromCurso(aluno)
      return res.status(200).json({
        success: 'Aluno exclu??do(a)!'
      })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  async reactivate (req, res) {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({
        error: 'Fornecer email!'
      })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Fornecer email v??lido!'
      })
    }
    try {
      const Aluno = factoryAluno()
      const aluno = await Aluno.findOne({
        where: {
          email
        }
      })
      if (!aluno) {
        return res.status(400).json({
          error: 'Aluno(a) n??o existe. Utilize m??todo v??lido para cri??-lo(a)!'
        })
      }
      if (aluno.ativo) {
        return res.status(400).json({
          error: 'Aluno(a) j?? est?? ativo(a)!'
        })
      }
      const reactivatedAluno = await aluno.update({ ativo: true })
      await AlunoController.insertOnCurso(reactivatedAluno)
      return res.status(200).json({
        success: `Aluno(a) ${reactivatedAluno.nome} reativado(a)!`
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
}

AlunoController.validateAluno = async (req, res) => {
  const { nome, sobrenome, email, dtnascimento, endereco_id, curso_id, turma_id, photo_id } = req.body
  const check = nome && sobrenome && email && dtnascimento && endereco_id && curso_id && turma_id && photo_id
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome, sobrenome, email, nascimento, id de endere??o, turma e de curso)!'
    })
  };
  if (req.body.sobrenome.length < 3) {
    return res.status(400).json({
      error: 'Fornecer sobrenome com ao menos 03 caracteres!'
    })
  }
  if (req.body.nome.length < 3) {
    return res.status(400).json({
      error: 'Fornecer nome com ao menos 03 caracteres!'
    })
  }
  if ('ativo' in req.body) {
    return res.status(400).json({
      error: 'Use outro m??todo adequado para excluir aluno!'
    })
  }
  if ('created_at' in req.body || 'updated_at' in req.body) {
    return res.status(400).json({
      error: 'N??o ?? poss??vel atualizar este(s) campo(s)!'
    })
  }
  const regex = /^\d{2}\/\d{2}\/\d{4}$/
  if (dtnascimento.match(regex) === null) {
    return res.status(400).json({
      error: 'Fornecer data de nascimento corretamente (dd/mm/aaaa)!'
    })
  }
  const fdate = `${dtnascimento.slice(6)}-${dtnascimento.slice(3, 5)}-${dtnascimento.slice(0, 2)}T00:00:00`
  const date = new Date(fdate)
  if (date.toJSON() === null) {
    return res.status(400).json({
      error: 'Fornecer data de nascimento v??lida!'
    })
  }

  req.body.dtnascimento = date

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Fornecer email v??lido!'
    })
  }
  if (!Number.isInteger(endereco_id)) {
    return res.status(400).json({
      error: 'Endere??o id deve ser do tipo inteiro!'
    })
  }
  if (!Number.isInteger(curso_id)) {
    return res.status(400).json({
      error: 'Curso id deve ser do tipo inteiro!'
    })
  }
  if (!Number.isInteger(turma_id)) {
    return res.status(400).json({
      error: 'Curso id deve ser do tipo inteiro!'
    })
  }
  if (!Number.isInteger(photo_id)) {
    return res.status(400).json({
      error: 'Foto id deve ser do tipo inteiro!'
    })
  }
  const Aluno = factoryAluno()
  const Endereco = factoryEndereco()
  const Curso = factoryCurso()
  const Turma = factoryTurma()
  const Photo = factoryPhoto()
  const endereco = await Endereco.findByPk(endereco_id)
  if (!endereco) {
    return res.status(400).json({
      error: 'Endere??o informado n??o existe!'
    })
  }
  if (endereco && !endereco.ativo) {
    return res.status(400).json({
      error: 'Endereco foi exclu??do. Siga as diretrizes para reativ??-lo!'
    })
  }
  const curso = await Curso.findByPk(curso_id)
  if (!curso) {
    return res.status(400).json({
      error: 'Curso informado n??o existe!'
    })
  }
  if (curso && !curso.ativo) {
    return res.status(400).json({
      error: 'Curso foi exclu??do. Siga as diretrizes para reativ??-lo!'
    })
  }
  const turma = await Turma.findByPk(turma_id)
  if (!turma) {
    return res.status(400).json({
      error: 'Turma informada n??o existe!'
    })
  }
  if (turma && !turma.ativo) {
    return res.status(400).json({
      error: 'Turma foi exclu??da. Siga as diretrizes para reativ??-lo!'
    })
  }
  const photo = await Photo.findByPk(photo_id)
  if (!photo) {
    return res.status(400).json({
      error: 'Foto informada n??o existe!'
    })
  }
  const aluno = await Aluno.findOne({
    where: {
      email
    }
  })
  if (aluno && req.method !== 'PUT') {
    return res.status(400).json({
      error: 'Aluno j?? existe na base de dados!'
    })
  }
  if (aluno && !aluno.ativo) {
    return res.status(400).json({
      error: 'Aluno foi exclu??do. Siga as diretrizes para reativ??-lo!'
    })
  }
}

AlunoController.validateId = (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      error: 'Id de aluno deve ser fornecido!'
    })
  }
  if (!Number.isInteger(id / 1)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!'
    })
  }
}

AlunoController.insertOnCurso = async (aluno) => {
  try {
    const { id, nome, sobrenome, email, curso_id } = aluno
    const Curso = factoryCurso()
    const curso = await Curso.findByPk(curso_id)
    const objectAlunos = curso.alunos_id
    const key = Object.keys(objectAlunos).length + 1
    objectAlunos[key] = { id, nome, sobrenome, email }
    const strAlunos = JSON.stringify(objectAlunos)
    await curso.update({ alunos_id: strAlunos, n_alunos_matriculados: ++curso.n_alunos_matriculados })
  } catch (e) { console.log(e) }
}

AlunoController.updateCurso = async (aluno, idOldCurso) => {
  const { id, nome, sobrenome, email, curso_id } = aluno
  const Curso = factoryCurso()
  try {
    if (idOldCurso !== curso_id) {
      const oldCurso = await Curso.findByPk(curso_id)
      const objectAlunosOldCurso = oldCurso.alunos_id
      if (aluno.id in objectAlunosOldCurso) {
        delete objectAlunosOldCurso[aluno.id]
        const strAlunos = JSON.stringify(objectAlunosOldCurso)
        await oldCurso.update({ alunos_id: strAlunos, n_alunos_matriculados: --oldCurso.n_alunos_matriculados })
      }
      const newCurso = await Curso.findByPk(curso_id)
      const objectAlunos = newCurso.alunos_id
      const key = Object.keys(objectAlunos).length + 1
      objectAlunos[key] = { id, nome, sobrenome, email }
      const strAlunos = JSON.stringify(objectAlunos)
      await newCurso.update({ alunos_id: strAlunos, n_alunos_matriculados: ++newCurso.n_alunos_matriculados })
    }
  } catch (e) { console.error(e) }
}

AlunoController.deleteFromCurso = async (aluno) => {
  const Curso = factoryCurso()
  const curso = await Curso.findByPk(aluno.curso_id)
  const objectAlunos = curso.alunos_id
  try {
    if (aluno.id in objectAlunos) {
      delete objectAlunos[aluno.id]
      const strAlunos = JSON.stringify(objectAlunos)
      await curso.update({ alunos_id: strAlunos, n_alunos_matriculados: --curso.n_alunos_matriculados })
    }
  } catch (e) { console.error(e) }
}

export default new AlunoController()
