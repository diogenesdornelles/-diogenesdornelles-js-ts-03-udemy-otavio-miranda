import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';
import databaseConfig from '../config/database';

export default function factoryUser() {
  class User extends Model {}
  User.init({
    nome: {
      type: Sequelize.STRING,
      defaultValue: '',
      validate: {
        len: {
          args: [3, 255],
          msg: 'Nome deve ter mais que 03 caracteres.',
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      defaultValue: '',
      unique: {
        args: true,
        msg: 'Email já consta na base de dados!',
      },
      validate: {
        isEmail: {
          msg: 'E-mail inválido.',
        },
      },
    },
    password_hash: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    ativo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    password: {
      type: Sequelize.VIRTUAL,
      defaultValue: '',
      validate: {
        len: {
          args: [6, 50],
          msg: 'Senha deve ter mais que 06 caracteres.',
        },
      },
    },
  }, {
    sequelize: new Sequelize(databaseConfig),
    tableName: 'users',
    modelName: 'User',
  });
  User.addHook('beforeSave', (user) => {
    if (user.password) {
      const salt = bcrypt.genSaltSync();
      // eslint-disable-next-line no-param-reassign
      user.password_hash = bcrypt.hashSync(user.password, salt);
    }
  });
  return User;
}
