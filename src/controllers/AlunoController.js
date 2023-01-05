/* eslint-disable camelcase */
import factoryAluno from '../models/factoryAluno'
import factoryEndereco from '../models/factoryEndereco'
import factoryCurso from '../models/factoryCurso'
const validator = require('validator')

class AlunoController {
  // user create an aluno

  async create (req, res) {
    await AlunoController.validateAluno(req, res)
    if (res.statusCode > 299) return
    try {
      const Aluno = factoryAluno()
      const Curso = factoryCurso()
      const aluno = await Aluno.create(req.body)
      const { id, nome, sobrenome, email, dtnascimento, endereco_id, curso_id } = aluno
      const curso = await Curso.findByPk(curso_id)
      const objectAlunos = curso.alunos_id
      const key = Object.keys(objectAlunos).length + 1
      objectAlunos[key] = { id, nome, sobrenome, email }
      const strAlunos = JSON.stringify(objectAlunos)
      await curso.update({ alunos_id: strAlunos, n_alunos_matriculados: ++curso.n_alunos_matriculados })
      return res.status(201).json({ success: { nome, sobrenome, email, dtnascimento, endereco_id, curso_id } })
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
        attributes: ['nome', 'sobrenome', 'email', 'dtnascimento', 'endereco_id', 'curso_id']
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
      const aluno = await Aluno.findOne({
        where: {
          id
        },
        attributes: ['nome', 'sobrenome', 'email', 'dtnascimento'],
        include: [{
          model: Endereco,
          as: 'endereco',
          attributes: ['municipio', 'rua', 'numero']
        }, {
          model: Curso,
          as: 'curso',
          attributes: ['nome', 'periodo']
        }]
      })
      const { nome, sobrenome, email, dtnascimento, endereco, curso } = aluno
      return res.status(200).json({ nome, sobrenome, email, dtnascimento, endereco, curso })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // async showAlunos (req, res) {
  //   if (res.statusCode > 299) return
  //   const { id } = req.params
  //   try {
  //     const Aluno = factoryAluno()
  //     const aluno = await Aluno.findOne({
  //       where: {
  //         id
  //       },
  //       attributes: ['nome', 'sobrenome', 'email', 'dtnascimento'],
  //       include: [{
  //         model: this.Endereco,
  //         as: 'endereco',
  //         attributes: ['municipio', 'rua', 'numero']
  //       }, {
  //         model: this.Curso,
  //         as: 'curso',
  //         attributes: ['nome', 'periodo']
  //       }]
  //     })
  //     const { nome, sobrenome, email, dtnascimento, endereco, curso } = aluno
  //     return res.status(200).json({ nome, sobrenome, email, dtnascimento, endereco, curso })
  //   } catch (err) {
  //     console.log(err)
  //     return res.status(204).json(null)
  //   }
  // }

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
          error: 'Aluno não existe no cadastro!'
        })
      }
      if ('ativo' in req.body) {
        return res.status(400).json({
          error: 'Use outro método adequado para excluir aluno!'
        })
      }
      if ('created_at' in req.body || 'updated_at' in req.body) {
        return res.status(400).json({
          error: 'Não é possível atualizar este(s) campo(s)!'
        })
      }
      const newAlunoData = await aluno.update(req.body)
      const { nome, sobrenome, email, dtnascimento, endereco_id } = newAlunoData
      return res.status(200).json({ success: { nome, sobrenome, email, dtnascimento, endereco_id } })
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
      const Curso = factoryCurso()
      const aluno = await Aluno.findByPk(id)
      if (!aluno) {
        return res.status(400).json({
          error: 'Aluno não existe no cadastro!'
        })
      }
      await aluno.update({ ativo: false })
      const curso = await Curso.findByPk(aluno.curso_id)
      const objectAlunos = curso.alunos_id
      if (aluno.id in objectAlunos) {
        delete objectAlunos[aluno.id]
        const strAlunos = JSON.stringify(objectAlunos)
        await curso.update({ alunos_id: strAlunos, n_alunos_matriculados: --curso.n_alunos_matriculados })
      }
      return res.status(200).json({
        success: 'Aluno excluído(a)!'
      })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  async reactive (req, res) {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({
        error: 'Fornecer email!'
      })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Fornecer email válido!'
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
          error: 'Aluno(a) não existe. Utilize método válido para criá-lo(a)!'
        })
      }
      if (aluno.ativo) {
        return res.status(400).json({
          error: 'Aluno(a) já está ativo(a)!'
        })
      }
      const { id, nome, sobrenome, curso_id } = aluno
      const reactivedAluno = await aluno.update({ ativo: true })
      const Curso = factoryCurso()
      const curso = await Curso.findByPk(curso_id)
      const objectAlunos = curso.alunos_id
      objectAlunos[id] = { id, nome, sobrenome }
      const strAlunos = JSON.stringify(objectAlunos)
      await curso.update({ alunos_id: strAlunos, n_alunos_matriculados: ++curso.n_alunos_matriculados })
      return res.status(200).json({
        success: `Aluno(a) ${reactivedAluno.nome} reativado(a)!`
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
}

AlunoController.validateAluno = async (req, res) => {
  const { nome, sobrenome, email, dtnascimento, endereco_id, curso_id } = req.body
  const check = nome && sobrenome && email && dtnascimento && endereco_id && curso_id
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome, sobrenome, email, nascimento, id de endereço)!'
    })
  };
  if (req.body.sobrenome.length < 3) {
    return res.status(400).json({
      error: 'Fornecer sobrenome com ao menos 03 caracteres!'
    })
  };
  if (req.body.nome.length < 3) {
    return res.status(400).json({
      error: 'Fornecer nome com ao menos 03 caracteres!'
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
      error: 'Fornecer data de nascimento válida!'
    })
  }

  req.body.dtnascimento = date

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Fornecer email válido!'
    })
  }
  if (!Number.isInteger(endereco_id)) {
    return res.status(400).json({
      error: 'Endereço id deve ser do tipo inteiro!'
    })
  }
  if (!Number.isInteger(curso_id)) {
    return res.status(400).json({
      error: 'Curso id deve ser do tipo inteiro!'
    })
  }
  const Aluno = factoryAluno()
  const Endereco = factoryEndereco()
  const Curso = factoryCurso()
  const endereco = await Endereco.findByPk(endereco_id)
  if (!endereco) {
    return res.status(400).json({
      error: 'Endereço não existe!'
    })
  }
  if (endereco && !endereco.ativo) {
    return res.status(400).json({
      error: 'Endereco foi excluído. Siga as diretrizes para reativá-lo!'
    })
  }
  const curso = await Curso.findByPk(curso_id)
  if (!curso) {
    return res.status(400).json({
      error: 'Curso não existe!'
    })
  }
  if (curso && !curso.ativo) {
    return res.status(400).json({
      error: 'Curso foi excluído. Siga as diretrizes para reativá-lo!'
    })
  }
  const aluno = await Aluno.findOne({
    where: {
      email
    }
  })
  if (aluno) {
    return res.status(400).json({
      error: 'Aluno já existe na base de dados!'
    })
  }
  if (aluno && !aluno.ativo) {
    return res.status(400).json({
      error: 'Aluno foi excluído. Siga as diretrizes para reativá-lo!'
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

export default new AlunoController()
