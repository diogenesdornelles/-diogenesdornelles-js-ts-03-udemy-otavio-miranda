import factoryUser from '../models/factoryUser';

class UserController {
  async create(req, res) {
    try {
      const User = factoryUser();
      const newUser = await User.create(req.body);
      return res.status(201).json(newUser);
    } catch (err) {
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  // index
  async index(req, res) {
    try {
      const User = factoryUser();
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(204).json(null);
    }
  }

  // show
  async show(req, res) {
    try {
      const User = factoryUser();
      const user = await User.findByPk(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(204).json(null);
    }
  }

  // update
  async update(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['ID do usuário não enviado!'],
        });
      }
      const User = factoryUser();
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não existe!'],
        });
      }

      const newData = await user.update(req.body);
      return res.status(200).json(newData);
    } catch (err) {
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  async delete(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          errors: ['ID do usuário não enviado!'],
        });
      }
      const User = factoryUser();
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['Usuário não existe!'],
        });
      }
      await user.destroy();
      return res.status(200).json({
        success: `Usuário "${user.nome}" deletado!`,
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
