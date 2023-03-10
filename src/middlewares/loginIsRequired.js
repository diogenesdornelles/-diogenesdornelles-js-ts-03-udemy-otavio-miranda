import jwt from 'jsonwebtoken'
import factoryUser from '../models/factoryUser'
require('dotenv').config()
const bcrypt = require('bcrypt')

export default async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: 'Autenticação é necessária!' })
  };
  const [, token] = authorization.split(' ')
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET)
    const { _id, _email, password } = data
    req.userId = _id
    req.userEmail = _email
    req.userPassword = password
    const User = factoryUser()
    const user = await User.findOne({
      where: {
        id: _id,
        email: _email,
        ativo: true
      }
    })
    if (!user) {
      return res.status(401).json({ error: 'Token de usuário é inválido!' })
    }
    const passwordIsOk = await bcrypt.compare(password, user.dataValues.password_hash)
    if (!passwordIsOk) {
      return res.status(400).json({
        error: 'Senha contida no token não confere! Refaça autenticação.'
      })
    };
    return next()
  } catch (e) {
    console.log(e)
    return res.status(401).json({ error: 'Token expirado ou inválido!' })
  };
}
