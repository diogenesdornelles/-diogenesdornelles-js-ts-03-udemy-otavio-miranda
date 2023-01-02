require('dotenv').config();
import factoryUser from '../models/factoryUser';
const bcrypt = require('bcrypt');
import jwt from 'jsonwebtoken'

class TokenController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        error: 'Email de usuário(a) e senha devem ser fornecidos!',
      });
    };

    const User = factoryUser();
    try {
      const user = await User.findOne({ where: { email: email, ativo: true } });
      if (!user) {
        return res.status(400).json({
          error: 'Usuário(a) não encontrado(a) na base de dados ou inativo(a)!',
        });
      };
      const passwordIsOk = await bcrypt.compare(password, user.dataValues.password_hash);
      if (!passwordIsOk) {
        return res.status(400).json({
          error: 'Senha não confere!',
        });
      };
      const _id = user.dataValues.id;
      const _email = user.dataValues.email;
      const token = jwt.sign({ _id, _email, password }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_TIME_EXPIRE });
      return res.status(200).json( {token: token} );
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Erro ao autenticar o usuário!',
      });
    }
  }
}

export default new TokenController();
