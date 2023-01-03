import factoryAluno from '../models/factoryAluno';
const validator = require('validator');
import factoryEndereco from '../models/factoryEndereco';

class AlunoController {
  // user create an aluno
  async create(req, res) {
    AlunoController.validateAluno(req, res);
    if(res.statusCode > 299) return;
    try {
      const Aluno = factoryAluno();
      const aluno = await Aluno.create(req.body);
      const { nome, sobrenome, email, nascimento, endereco_id } = aluno;
      return res.status(201).json( {success: { nome, sobrenome, email, nascimento, endereco_id }});
    } catch (err) {
      console.log(err);
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  // index - show all alunos ativos
  async index(req, res) {
    try {
      const Aluno = factoryAluno();
      const alunos = await Aluno.findAll( {
        where: {
          ativo: true
        },
        attributes: ['nome', 'sobrenome', 'email', 'nascimento', 'endereco_id']
    });
      return res.status(200).json(alunos);
    } catch (err) {
      console.log(err);
      return res.status(204).json(null);
    }
  }

  // show one aluno
  async show(req, res) {
    AlunoController.validateId(req, res);
    if(res.statusCode > 299) return;
    const { id } = req.params;
    try {
      const Aluno = factoryAluno();
      const Endereco = factoryEndereco();
      Aluno.belongsTo(Endereco, {
        foreignKey: 'endereco_id',
        targetKey: 'id',
        as: 'endereco'
      });
      Endereco.hasOne(Aluno);
      const aluno = await Aluno.findOne({
        where: {
          id
        },
        attributes: ['nome', 'sobrenome', 'email', 'nascimento'],
        include: [{
          model: Endereco,
          as: 'endereco',
          attributes: ['municipio', 'rua', 'numero']
        }],
      });
      console.log(aluno)
      const { nome, sobrenome, email, nascimento, endereco } = aluno;
      return res.status(200).json({ nome, sobrenome, email, nascimento, endereco});
    } catch (err) {
      console.log(err);
      return res.status(204).json(null);
    }
  }

  // update an aluno
  async update(req, res) {
    AlunoController.validateId(req, res);
    if(res.statusCode > 299) return;
    AlunoController.validateAluno(req, res);
    if(res.statusCode > 299) return;
    const { id } = req.params;
    try {
      const Aluno = factoryAluno();
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(400).json({
          error: 'Aluno não existe no cadastro!',
        });
      }
      if ('ativo' in req.body) {
        return res.status(400).json({
          error: 'Use outro método adequado para excluir aluno!',
        });
      }
      if ('created_at' in req.body || 'updated_at' in req.body) {
        return res.status(400).json({
          error: 'Não é possível atualizar este(s) campo(s)!',
        });
      }
      const newAlunoData = await aluno.update(req.body);
      const { nome, sobrenome, email, nascimento, endereco_id } = newAlunoData;
      return res.status(200).json( {success: { nome, sobrenome, email, nascimento, endereco_id }});
    } catch (err) {
      console.log(err)
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  // delete an aluno
  async delete(req, res) {
    AlunoController.validateId(req, res);
    if(res.statusCode > 299) return;
    const { id } = req.params;
    try {
      const Aluno = factoryAluno();
      const aluno = await Aluno.findByPk(id);
      if (!aluno) {
        return res.status(400).json({
          error: 'Aluno não existe no cadastro!',
        });
      }
      await aluno.update( { ativo: false }, { where: { id }});
      return res.status(200).json({
        success: 'Aluno excluído(a)!',
      });
    } catch (err) {
      console.log(err);
      return res.status(204).json(null);
    }
  }
}

AlunoController.validateAluno = (req, res) => {
  const { nome, sobrenome, email, nascimento, endereco_id } = req.body;
  const check = nome && sobrenome && email && nascimento && endereco_id;
  console.log(endereco_id)
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (nome, sobrenome, email, nascimento, id de endereço)!',
    });
  };
  const regex = /^\d{2}\/\d{2}\/\d{4}$/
  if (nascimento.match(regex) === null) {
    return res.status(400).json({
      error: 'Fornecer data de nascimento corretamente (dd/mm/aaaa)!',
    });
  }
  const fdate = `${nascimento.slice(6,)}-${nascimento.slice(3,5)}-${nascimento.slice(0,2)}T00:00:00`
  const date = new Date(fdate)
  if (date.toJSON() === null) {
    return res.status(400).json({
      error: 'Fornecer data de nascimento válida!',
    });
  }

  req.body.nascimento = date;

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Fornecer email válido!',
    });
  }

  if (!Number.isInteger(endereco_id)) {
    return res.status(400).json({
      error: 'Endereço id deve ser do tipo inteiro!',
    });
  }
}

AlunoController.validateId = (req, res) => {
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

export default new AlunoController();
