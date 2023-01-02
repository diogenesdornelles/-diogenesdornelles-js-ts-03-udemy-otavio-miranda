import factoryAluno from '../models/factoryAluno';
import factoryEndereco from '../models/factoryEndereco';

class HomeController {
  async index(req, res) {
    const {municipio, rua, numero, nome, sobrenome, email, nascimento, endereco_id} = req.body;

    const Aluno = factoryAluno();
    const Endereco = factoryEndereco();
    const newEndereco = await Endereco.create({
      municipio: 'Bento Gonçalves',
      rua: 'Vitória',
      numero: '135',
    });
    const newAluno = await Aluno.create({
      nome: 'Diógenes',
      sobrenome: 'Dornelles',
      email: 'diogenes.dornelles@gmail.com',
      nascimento: new Date('1985-03-17'),
      endereco_id: 1,
    });
    res.status(200).json({ endereco: newEndereco, aluno: newAluno });
  }
}

export default new HomeController();
