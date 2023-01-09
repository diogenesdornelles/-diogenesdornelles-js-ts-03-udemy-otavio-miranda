import factoryEndereco from '../models/factoryEndereco'

class EnderecoController {
  // user create adress

  async create (req, res) {
    await EnderecoController.validateEndereco(req, res)
    if (res.statusCode > 299) return
    try {
      const Endereco = factoryEndereco()
      const endereco = await Endereco.create(req.body)
      const { id, municipio, rua, numero } = endereco
      return res.status(201).json({ success: { id, municipio, rua, numero } })
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

  // index - user show all adresses
  async index (req, res) {
    try {
      const Endereco = factoryEndereco()
      const endereco = await Endereco.findAll({
        where: {
          ativo: true
        },
        attributes: ['id', 'municipio', 'rua', 'numero']
      })
      return res.status(200).json({ success: endereco })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // show one adress
  async show (req, res) {
    EnderecoController.validateId(req, res)
    const { id } = req.params
    try {
      const Endereco = factoryEndereco()
      const endereco = await Endereco.findByPk(id)
      if (!endereco) {
        return res.status(400).json({
          error: 'Endereço de aluno não existe!'
        })
      }
      const { municipio, rua, numero } = endereco
      const _id = endereco.dataValues.id
      return res.status(200).json({ _id, municipio, rua, numero })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  // update an adress
  async update (req, res) {
    EnderecoController.validateId(req, res)
    if (res.statusCode > 299) return
    await EnderecoController.validateEndereco(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Endereco = factoryEndereco()
      const endereco = await Endereco.findByPk(id)
      if (!endereco) {
        return res.status(400).json({
          error: 'Endereço de aluno não existe!'
        })
      }
      if ('ativo' in req.body) {
        return res.status(400).json({
          error: 'Use outro método adequado para deletar endereço!'
        })
      }
      if ('created_at' in req.body || 'updated_at' in req.body) {
        return res.status(400).json({
          error: 'Não é possível atualizar este(s) campo(s)!'
        })
      }
      const newEndereco = await endereco.update(req.body)
      const _id = newEndereco.dataValues.id
      const { municipio, rua, numero } = newEndereco
      return res.status(200).json({ success: { _id, municipio, rua, numero } })
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

  // delete an adress
  async delete (req, res) {
    EnderecoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Endereco = factoryEndereco()
      const endereco = await Endereco.findByPk(id)
      if (!endereco) {
        return res.status(400).json({
          error: 'Endereço de aluno não existe!'
        })
      }
      await endereco.update({ ativo: false })
      return res.status(200).json({
        success: 'Endereço deletado(a)!'
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
    EnderecoController.validateId(req, res)
    const { id } = req.params
    try {
      const Endereco = factoryEndereco()
      const endereco = await Endereco.findOne({
        where: {
          id
        }
      })
      if (!endereco) {
        return res.status(400).json({
          error: 'Endereço não existe. Utilize método válido para criá-lo!'
        })
      }
      if (endereco.ativo) {
        return res.status(400).json({
          error: 'Endereço já está ativo(a)!'
        })
      }
      await endereco.update({ ativo: true })
      return res.status(200).json({
        success: 'Endereço reativado(a)!'
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
}

EnderecoController.validateEndereco = (req, res) => {
  const { municipio, rua, numero } = req.body
  const check = municipio && rua && numero
  if (!check) {
    return res.status(400).json({
      error: 'Fornecer dados completos (município, rua e número)!'
    })
  };
  if (!Number.isInteger(numero)) {
    return res.status(400).json({
      error: 'Número deve ser do tipo inteiro!'
    })
  }
}

EnderecoController.validateId = (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      error: 'Id de endereço deve ser fornecido!'
    })
  }
  if (!Number.isInteger(id / 1)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!'
    })
  }
}

export default new EnderecoController()
