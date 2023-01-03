import factoryEndereco from '../models/factoryEndereco';

class AddressController {
  // user create adress
  async create(req, res) {
    AddressController.validateAdress(req, res);
    if(res.statusCode > 299) return;
    try {
      const Address = factoryEndereco();
      const address = await Address.create(req.body);
      const { municipio, rua, numero } = address;
      return res.status(201).json( {success: { municipio, rua, numero }});
    } catch (err) {
      const { errors } = err;
      const er = {};
      errors.forEach((error) => {
        er[`Erro de ${error.path}`] = error.message;
      });
      return res.status(400).json(er);
    }
  }

  // index - user show all adresses
  async index(req, res) {
    try {
      const Address = factoryEndereco();
      const address = await Address.findAll( {
        where: {
          ativo: true
        },
        attributes: ['municipio', 'rua', 'numero']
    });
      return res.status(200).json(address);
    } catch (err) {
      console.log(err);
      return res.status(204).json(null);
    }
  }

  // show one adress
  async show(req, res) {
    AddressController.validateId(req, res);
    const { id } = req.params;
    try {
      const Address = factoryEndereco();
      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(400).json({
          error: 'Endereço de aluno não existe!',
        });
      }
      const { municipio, rua, numero } = address;
      return res.status(200).json({ municipio, rua, numero });
    } catch (err) {
      console.log(err);
      return res.status(204).json(null);
    }
  }

  // update an adress
  async update(req, res) {
    AddressController.validateId(req, res);
    if(res.statusCode > 299) return;
    AddressController.validateAdress(req, res);
    if(res.statusCode > 299) return;
    const { id } = req.params;
    try {
      const Address = factoryEndereco();
      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(400).json({
          error: 'Endereço de aluno não existe!',
        });
      }
      if ('ativo' in req.body) {
        return res.status(400).json({
          error: 'Use outro método adequado para deletar endereço!',
        });
      }
      if ('created_at' in req.body || 'updated_at' in req.body) {
        return res.status(400).json({
          error: 'Não é possível atualizar este(s) campo(s)!',
        });
      }
      const newAddress = await address.update(req.body);
      const { municipio, rua, numero } = newAddress;
      return res.status(200).json({success: { municipio, rua, numero }});
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

  // delete an adress
  async delete(req, res) {
    AddressController.validateId(req, res);
    if(res.statusCode > 299) return;
    const { id } = req.params;
    try {
      const Address = factoryEndereco();
      const address = await Address.findByPk(id);
      if (!address) {
        return res.status(400).json({
          error: 'Endereço de aluno não existe!',
        });
      }
      await address.update( { ativo: false }, { where: { id }});
      return res.status(200).json({
        success: 'Endereço deletado(a)!',
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

AddressController.validateAdress = (req, res) => {
  const { municipio, rua, numero } = req.body;
  const check = municipio && rua && numero;
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (município, rua e número)!',
    });
  };
  if (!Number.isInteger(numero)) {
    return res.status(400).json({
      error: 'Número deve ser do tipo inteiro!',
    });
  }
}

AddressController.validateId = (req, res) => {
  const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: 'Id de endereço deve ser fornecido!',
      });
    }
  if (!Number.isInteger(id/1)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!',
    });
  }
}

export default new AddressController();
