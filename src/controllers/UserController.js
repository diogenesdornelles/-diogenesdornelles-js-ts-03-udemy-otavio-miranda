import factoryUser from '../models/factoryUser'
import { randomPassword } from '../modules/randomPassword'
const validator = require('validator')
const bcrypt = require('bcrypt')

class UserController {
  // create
  async create (req, res) {
    const check = await UserController.validateUser(req, res)
    if (res.statusCode > 299 || !check) return
    try {
      const User = factoryUser()
      const user = await User.create(req.body)
      const { id, nome, email } = user
      return res.status(201).json({ success: { id, nome, email } })
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

  // index // Should not be implemented
  async index (req, res) {
    try {
      const User = factoryUser()
      const users = await User.findAll({
        where: {
          ativo: true
        },
        attributes: ['id', 'nome', 'email']
      })
      return res.status(200).json(users)
    } catch (err) {
      return res.status(204).json(null)
    }
  }

  // show only himself
  async show (req, res) {
    try {
      const User = factoryUser()
      const user = await User.findByPk(req.userId)
      if (!user || !user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) não existe ou inativo(a)!'
        })
      }
      const { id, nome, email } = user
      return res.status(200).json({ id, nome, email })
    } catch (err) {
      return res.status(204).json(null)
    }
  }

  // update himself
  async update (req, res) {
    try {
      const User = factoryUser()
      const user = await User.findByPk(req.userId)
      if (!user || !user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) não existe ou inativo(a)!'
        })
      }
      if ('ativo' in req.body) {
        return res.status(400).json({
          error: 'Use outro método para deletar usuário(a)!'
        })
      }
      if ('created_at' in req.body || 'updated_at' in req.body) {
        return res.status(400).json({
          error: 'Não é possível atualizar este(s) campo(s)!'
        })
      }
      const newUser = await user.update(req.body)
      const { id, nome, email } = newUser
      if ('password' in req.body) {
        if (req.body.password !== req.userPassword) {
          return res.status(200).json({ id, nome, email, message: 'Senha alterada: é necessário refazer a autenticação!' })
        }
      }
      return res.status(200).json({ success: { id, nome, email } })
    } catch (err) {
      const { errors } = err
      const er = {}
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message
      })
      return res.status(400).json(er)
    }
  }

  // delete himself
  async delete (req, res) {
    try {
      const User = factoryUser()
      const user = await User.findByPk(req.userId)
      if (!user || !user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) não existe ou inativo(a)!'
        })
      }
      const deletedUser = await user.update({ ativo: false })
      return res.status(200).json({
        success: `Usuário(a) ${deletedUser.nome} deletado(a)!`
      })
    } catch (err) {
      const { errors } = err
      const er = {}
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message
      })
      return res.status(400).json(er)
    }
  }

  async reactivate (req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        error: 'Fornecer email e senha!'
      })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Fornecer email válido!'
      })
    }
    try {
      const User = factoryUser()
      const user = await User.findOne({
        where: {
          email
        }
      })
      if (!user) {
        return res.status(400).json({
          error: 'Usuário(a) não existe. Utilize método válido para criá-lo!'
        })
      }
      if (user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) já está ativo(a)!'
        })
      }
      const isValidPassword = await bcrypt.compare(password, user.dataValues.password_hash)
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Senha não confere!'
        })
      };
      const newPassword = randomPassword()
      const reactivatedUser = await user.update({ ativo: true, password: newPassword })
      return res.status(200).json({
        success: `Usuário(a) ${reactivatedUser.nome} reativado(a)! Sua nova senha gerada automaticamente pelo sistema foi ${newPassword}. Faça o login com ela e altere-a e depois se reautentique`
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
}

UserController.validateUser = async (req, res) => {
  const { nome, email, password } = req.body
  const check = nome && password && email
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome, sobrenome e email)!'
    })
  };
  if (req.body.password.length < 6) {
    return res.status(400).json({
      error: 'Fornecer senha com ao menos 06 caracteres!'
    })
  };
  if (req.body.nome.length < 3) {
    return res.status(400).json({
      error: 'Fornecer nome com ao menos 03 caracteres!'
    })
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Fornecer email válido!'
    })
  }
  const User = factoryUser()
  const user = await User.findOne({
    where: {
      email
    }
  })
  if (user) {
    return res.status(400).json({
      error: 'Usuário já existe na base de dados!'
    })
  }
  if (user && !user.ativo) {
    return res.status(400).json({
      error: 'Usuário foi excluído. Siga as diretrizes para reativá-lo!'
    })
  }
  return true
}

UserController.validateId = (req, res) => {
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

export default new UserController()
