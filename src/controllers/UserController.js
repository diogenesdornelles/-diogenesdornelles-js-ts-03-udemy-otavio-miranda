import factoryUser from '../models/factoryUser';
const validator = require('validator');

class UserController {
  // create
  async create(req, res) {
    UserController.validateUser(req, res);
    if(res.statusCode > 299) return;
    try {
      const User = factoryUser();
      const user = await User.create(req.body);
      const { id, nome, email } = user;
      return res.status(201).json( {success: { id, nome, email}});
    } catch (err) {
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  // index // Should not be implemented
  async index(req, res) {
    try {
      const User = factoryUser();
      const users = await User.findAll( {
        where: {
          ativo: true
        },
        attributes: ['id', 'nome', 'email']
      });
      return res.status(200).json(users);
    } catch (err) {
      return res.status(204).json(null);
    }
  }

  // show only himself
  async show(req, res) {
    try {
      const User = factoryUser();
      const user = await User.findByPk(req.userId);
      if (!user || !user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) não existe ou inativo(a)!',
        });
      }
      const { id, nome, email } = user;
      return res.status(200).json({ id, nome, email });
    } catch (err) {
      return res.status(204).json(null);
    }
  }

  // update himself
  async update(req, res) {
    try {
      const User = factoryUser();
      const user = await User.findByPk(req.userId);
      if (!user || !user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) não existe ou inativo(a)!',
        });
      }
      if ('ativo' in req.body) {
        return res.status(400).json({
          error: 'Use outro método para deletar usuário(a)!',
        });
      }
      if ('created_at' in req.body || 'updated_at' in req.body) {
        return res.status(400).json({
          error: 'Não é possível atualizar este(s) campo(s)!',
        });
      }
      const newUser = await user.update(req.body);
      const { id, nome, email } = newUser;
      if ('password' in req.body) {
        if (req.body.password !== req.userPassword) {
          return res.status(200).json({ id, nome, email, message: 'Senha alterada: é necessário refazer a autenticação!' });
        }
      }
      return res.status(200).json( {success: { id, nome, email }});
    } catch (err) {
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  // delete himself
  async delete(req, res) {
    try {
      const User = factoryUser();
      const user = await User.findByPk(req.userId);
      if (!user || !user.ativo) {
        return res.status(400).json({
          error: 'Usuário(a) não existe ou inativo(a)!',
        });
      }
      const deletedUser = await user.update( { ativo: false }, { where: { id: req.userId }});
      return res.status(200).json({
        success: `Usuário(a) ${deletedUser.nome} deletado(a)!`,
      });
    } catch (err) {
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }
}

UserController.validateUser = (req, res) => {
  const { nome, email, password } = req.body;
  const check = nome && password && email;
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome, sobrenome e email)!',
    });
  };
  if (password.lenght < 6) {
    return res.status(400).json({
      error: 'Fornecer senha com ao menos 06 caracteres!',
    });
  };
  if (nome.lenght < 3) {
    return res.status(400).json({
      error: 'Fornecer nome com ao menos 03 caracteres!',
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Fornecer email válido!',
    });
  }
}

UserController.validateId = (req, res) => {
  const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: 'Id de aluno deve ser fornecido!',
      });
    }
  if (!Number.isInteger(id/1)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!',
    });
  }
}

export default new UserController();
