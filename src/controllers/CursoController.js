/* eslint-disable camelcase */
// import factoryAluno from '../models/factoryAluno'
import factoryCurso from '../models/factoryCurso'
import factoryTurma from '../models/factoryTurma'
import Associations from '../models/modules/Associations'

class CursoController {
  // user create curso
  async create (req, res) {
    await CursoController.validateCurso(req, res)
    if (res.statusCode > 299) return
    try {
      const Curso = factoryCurso()
      const curso = await Curso.create(req.body)
      const { id, nome, periodo, duracao_semestres, mes_inicio, alunos_id, n_alunos_matriculados } = curso
      return res.status(201).json({ success: { id, nome, periodo, duracao_semestres, mes_inicio, alunos_id, n_alunos_matriculados } })
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

  // index - show all cursos ativos
  async index (req, res) {
    try {
      const Curso = factoryCurso()
      const cursos = await Curso.findAll({
        where: {
          ativo: true
        },
        attributes: ['id', 'nome', 'periodo', 'duracao_semestres', 'mes_inicio', 'alunos_id', 'n_alunos_matriculados']
      })
      return res.status(200).json({ success: cursos })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // show one curso active
  async show (req, res) {
    CursoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Turma = factoryTurma()
      const Curso = factoryCurso()
      Associations.associateTurmaToCurso(Turma, Curso)
      const curso = await Curso.findOne({
        where: {
          id,
          ativo: true
        },
        attributes: ['id', 'nome', 'periodo', 'duracao_semestres', 'mes_inicio', 'alunos_id', 'n_alunos_matriculados'],
        include: [{
          model: Turma,
          attributes: ['id', 'nome', 'curso_id']
        }]
      })
      if (!curso) {
        return res.status(404).json({ error: 'Curso n??o encontrado!' })
      }
      const { nome, periodo, duracao_semestres, mes_inicio, alunos_id, Turmas } = curso
      const n_alunos_matriculados = curso.dataValues.n_alunos_matriculados
      return res.status(200).json({ success: { id, nome, periodo, duracao_semestres, mes_inicio, alunos_id, n_alunos_matriculados, Turmas } })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // update a curso
  async update (req, res) {
    CursoController.validateId(req, res)
    if (res.statusCode > 299) return
    await CursoController.validateCurso(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Curso = factoryCurso()
      const curso = await Curso.findOne({
        where: {
          id,
          ativo: true
        }
      })
      if (!curso) {
        return res.status(400).json({
          error: 'Curso n??o existe no cadastro ou est?? inativo!'
        })
      }
      const newCursoData = await curso.update(req.body)
      const { nome, periodo, duracao_semestres, mes_inicio, alunos_id, n_alunos_matriculados } = newCursoData
      return res.status(200).json({ success: { id, nome, periodo, duracao_semestres, mes_inicio, alunos_id, n_alunos_matriculados } })
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
    CursoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Curso = factoryCurso()
      const curso = await Curso.findOne({
        where: {
          id,
          ativo: true
        }
      })
      if (!curso) {
        return res.status(400).json({
          error: 'Curso n??o existe no cadastro ou j?? est?? inativo!'
        })
      }
      await curso.update({ ativo: false, alunos_id: '{}', n_alunos_matriculados: 0 })
      return res.status(200).json({
        success: 'Curso exclu??do!'
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
        error: 'Fornecer nome do curso!'
      })
    }
    try {
      const Curso = factoryCurso()
      const curso = await Curso.findOne({
        where: {
          nome
        }
      })
      if (!curso) {
        return res.status(400).json({
          error: 'Curso n??o existe. Utilize m??todo v??lido para cri??-lo!'
        })
      }
      if (curso.ativo) {
        return res.status(400).json({
          error: 'Curso j?? est?? ativo(a)!'
        })
      }
      const reactivatedCurso = await curso.update({ ativo: true })
      return res.status(200).json({
        success: `Curso ${reactivatedCurso.nome} reativado(a)!`
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
}

CursoController.validateCurso = async (req, res) => {
  const { nome, periodo, duracao_semestres, mes_inicio } = req.body
  const check = nome && periodo && duracao_semestres && mes_inicio
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome, periodo, duracao em semestres, mes de inicio)!'
    })
  };
  if ('ativo' in req.body) {
    return res.status(400).json({
      error: 'Use outro m??todo adequado para excluir curso!'
    })
  }
  if ('created_at' in req.body || 'updated_at' in req.body || 'n_alunos_matriculados' in req.body) {
    return res.status(400).json({
      error: 'N??o ?? poss??vel atualizar este(s) campo(s)!'
    })
  }
  if ('alunos_id' in req.body) {
    return res.status(400).json({
      error: 'Use outro m??todo adequado para modificar alunos inclusos!'
    })
  }
  const date = /^[0-9]{2}\/[0-9]{4}$/i
  if (!date.test(mes_inicio)) {
    return res.status(400).json({
      error: 'Fornecer data de in??cio v??lida (mm/aaaa)!'
    })
  }
  const month = mes_inicio.slice(0, 2)
  const year = mes_inicio.slice(3)
  const currentYear = new Date().getFullYear()
  if (!(month > 0 && month < 13) || !(year >= currentYear)) {
    return res.status(400).json({
      error: 'Fornecer data de in??cio v??lida (mm/aaaa)!'
    })
  }
  const periods = ['diurno', 'noturno', 'diurno e noturno']
  if (!periods.includes(periodo)) {
    return res.status(400).json({
      error: 'Per??odo deve ser noturno, diurno ou diurno e noturno!'
    })
  }
  if (!Number.isInteger(duracao_semestres)) {
    return res.status(400).json({
      error: 'Meses de dura????o do curso deve ser do tipo inteiro!'
    })
  }
  if (req.body.duracao_semestres < 4) {
    return res.status(400).json({
      error: 'Dura????o do curso deve ser de pelo menos 04 semestres!'
    })
  }
  const Curso = factoryCurso()
  const curso = await Curso.findOne({ where: { nome } })
  if (curso && req.method !== 'PUT') {
    return res.status(400).json({
      error: 'Curso j?? existe na base de dados!'
    })
  }
  if (curso && !curso.ativo) {
    return res.status(400).json({
      error: 'Curso foi exclu??do. Siga as diretrizes para reativ??-lo!'
    })
  }
}

CursoController.validateId = (req, res) => {
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

export default new CursoController()
