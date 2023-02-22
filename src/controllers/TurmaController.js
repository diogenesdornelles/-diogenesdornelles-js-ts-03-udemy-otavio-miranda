/* eslint-disable camelcase */
import factoryAluno from '../models/factoryAluno'
import factoryCurso from '../models/factoryCurso'
import factoryTurma from '../models/factoryTurma'
import Associations from '../models/modules/Associations'

class TurmaController {
  // user create turma
  async create (req, res) {
    await TurmaController.validateTurma(req, res)
    if (res.statusCode > 299) return
    try {
      const Turma = factoryTurma()
      const turma = await Turma.create(req.body)
      const { id, nome, curso_id } = turma
      return res.status(201).json({ success: { id, nome, curso_id } })
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

  // index - show all turmas ativas
  async index (req, res) {
    try {
      const Turma = factoryTurma()
      const turmas = await Turma.findAll({
        where: {
          ativo: true
        },
        attributes: ['id', 'nome', 'curso_id']
      })
      return res.status(200).json({ success: turmas })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // show one turma active
  async show (req, res) {
    TurmaController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Turma = factoryTurma()
      const Aluno = factoryAluno()
      Associations.associateAlunoToTurma(Aluno, Turma)
      const turma = await Turma.findOne({
        where: {
          id,
          ativo: true
        },
        attributes: ['id', 'nome', 'curso_id'],
        include: [{
          model: Aluno,
          attributes: ['id', 'nome', 'sobrenome', 'email', 'dtnascimento']
        }]
      })
      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada!' })
      }
      const { nome, curso_id, Alunos } = turma
      const _id = turma.dataValues.id
      return res.status(200).json({ success: { _id, nome, curso_id, Alunos } })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // update a turma
  async update (req, res) {
    TurmaController.validateId(req, res)
    if (res.statusCode > 299) return
    await TurmaController.validateTurma(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Turma = factoryTurma()
      const turma = await Turma.findOne({
        where: {
          id,
          ativo: true
        }
      })
      if (!turma) {
        return res.status(400).json({
          error: 'Turma não existe no cadastro ou está inativo!'
        })
      }
      if ('alunos' in req.body) {
        return res.status(400).json({
          error: 'Use outro método adequado para modificar alunos inclusos!'
        })
      }
      const newTurmaData = await turma.update(req.body)
      const { nome, curso_id } = newTurmaData
      const _id = newTurmaData.dataValues.id
      return res.status(200).json({ success: { _id, nome, curso_id } })
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

  // delete a curso
  async delete (req, res) {
    TurmaController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Turma = factoryTurma()
      const turma = await Turma.findOne({
        where: {
          id,
          ativo: true
        }
      })
      if (!turma) {
        return res.status(400).json({
          error: 'Turma não existe no cadastro ou já está inativa!'
        })
      }
      await turma.update({ ativo: false })
      return res.status(200).json({
        success: 'Turma excluída!'
      })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  async reactivate (req, res) {
    const { nome } = req.body
    if (!nome) {
      return res.status(400).json({
        error: 'Fornecer nome da turma!'
      })
    }
    try {
      const Turma = factoryTurma()
      const turma = await Turma.findOne({
        where: {
          nome
        }
      })
      if (!turma) {
        return res.status(400).json({
          error: 'Turma não existe. Utilize método válido para criá-lo!'
        })
      }
      if (turma.ativo) {
        return res.status(400).json({
          error: 'Turma já está ativo(a)!'
        })
      }
      const reactivatedTurma = await turma.update({ ativo: true })
      return res.status(200).json({
        success: `Turma ${reactivatedTurma.nome} reativado(a)!`
      })
    } catch (err) {
      return res.status(400).json(null)
    }
  }
}

TurmaController.validateTurma = async (req, res) => {
  const { nome, curso_id } = req.body
  const check = nome && curso_id
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome e curso_id)!'
    })
  };
  if ('ativo' in req.body) {
    return res.status(400).json({
      error: 'Use outro método adequado para excluir turma!'
    })
  }
  if ('created_at' in req.body || 'updated_at' in req.body) {
    return res.status(400).json({
      error: 'Não é possível atualizar este(s) campo(s)!'
    })
  }
  if (!Number.isInteger(curso_id)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!'
    })
  }
  if (req.body.nome.length < 3) {
    return res.status(400).json({
      error: 'Fornecer nome com ao menos 03 caracteres!'
    })
  }
  const Curso = factoryCurso()
  const curso = await Curso.findByPk(curso_id)
  if (!curso) {
    return res.status(400).json({
      error: 'Curso informado não existe!'
    })
  }
  const Turma = factoryTurma()
  const turma = await Turma.findOne({ where: { nome } })
  if (turma && req.method !== 'PUT') {
    return res.status(400).json({
      error: 'Turma já existe na base de dados!'
    })
  }
  if (turma && !turma.ativo) {
    return res.status(400).json({
      error: 'Turma foi excluída. Siga as diretrizes para reativá-la!'
    })
  }
}

TurmaController.validateId = (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      error: 'Id de turma deve ser fornecida!'
    })
  }
  if (!Number.isInteger(id / 1)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!'
    })
  }
}

export default new TurmaController()
