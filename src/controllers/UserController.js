import factoryUser from '../models/factoryUser';

class UserController {
  // create
  async create(req, res) {
    try {
      const User = factoryUser();
      const user = await User.create(req.body);
      const { id, nome, email } = user;
      return res.status(201).json( { id, nome, email} );
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
        return res.status(200).json({ id, nome, email, message: 'Senha alterada: é necessário refazer a autenticação!' });
      }
      return res.status(200).json({ id, nome, email });
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

export default new UserController();
