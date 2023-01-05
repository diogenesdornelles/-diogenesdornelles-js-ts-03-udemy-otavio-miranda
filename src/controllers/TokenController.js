import factoryUser from '../models/factoryUser'
import jwt from 'jsonwebtoken'
require('dotenv').config()
const bcrypt = require('bcrypt')

class TokenController {
  async store (req, res) {
    const { email = '', password = '' } = req.body
    if (!email || !password) {
      return res.status(401).json({
        error: 'Email de usuário(a) e senha devem ser fornecidos!'
      })
    };
    try {
      const User = factoryUser()
      const user = await User.findOne({ where: { email, ativo: true } })
      if (!user) {
        return res.status(400).json({
          error: 'Usuário(a) não encontrado(a) na base de dados ou inativo(a)!'
        })
      };
      const isValidPassword = await bcrypt.compare(password, user.dataValues.password_hash)
      if (!isValidPassword) {
        return res.status(400).json({
          error: 'Senha não confere!'
        })
      };
      const _id = user.dataValues.id
      const _email = user.dataValues.email
      const token = jwt.sign({ _id, _email, password }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_TIME_EXPIRE })
      return res.status(200).json({ token })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        error: 'Erro ao autenticar o usuário!'
      })
    }
  }
}

export default new TokenController()
