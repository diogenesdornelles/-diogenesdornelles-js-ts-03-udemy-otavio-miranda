import factoryPhoto from '../models/factoryPhoto'
import multer from 'multer'
import multerConfig from '../../src/config/multer'
const photo = multer(multerConfig).single('file')

class PhotoController {
  async store (req, res) {
    photo(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Somente arquivos png ou jpg são permitidos!' })
      }
      const { originalname, filename } = req.file
      const Photo = factoryPhoto()
      Photo.create({ originalname, filename })
        .then((_photo) => {
          return res.status(200).json({
            message: 'Foto salva!',
            id: _photo.id,
            info: req.file,
            url: _photo.url
          })
        })
        .catch((err) => {
          console.log(err)
          return res.status(400).json({
            error: 'Erro ao salvar a foto!'
          })
        })
    })
  }

  async index (req, res) {
    try {
      const Photo = factoryPhoto()
      const photos = await Photo.findAll({
        attributes: ['id', 'filename', 'originalname', 'url']
      })
      return res.status(200).json({ success: photos })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }

  async update (req, res) {
    PhotoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Photo = factoryPhoto()
      const _photo = await Photo.findByPk(id)
      if (!_photo) {
        return res.status(400).json({
          error: 'Foto não existe no cadastro!'
        })
      }
      photo(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: 'Somente arquivos png ou jpg são permitidos!' })
        }
        const { originalname, filename } = req.file
        _photo.update({ originalname, filename })
          .then((_photo_) => {
            return res.status(200).json({
              message: 'Foto atualizada!',
              id: _photo_.id,
              info: req.file
            })
          })
          .catch((err) => {
            console.log(err)
            return res.status(400).json({
              error: 'Erro ao salvar a foto!'
            })
          })
      })
    } catch (e) {
      console.log(e)
      return res.status(204).json(null)
    }
  }

  async delete (req, res) {
    PhotoController.validateId(req, res)
    if (res.statusCode > 299) return
    const { id } = req.params
    try {
      const Photo = factoryPhoto()
      const photo = await Photo.findByPk(id)
      if (!photo) {
        return res.status(400).json({
          error: 'Foto não existe no cadastro!'
        })
      }
      await photo.destroy()
      return res.status(200).json({
        success: 'Foto excluída!'
      })
    } catch (err) {
      console.log(err)
      return res.status(204).json(null)
    }
  }
}

PhotoController.validateId = (req, res) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      error: 'Id de aluno deve ser fornecido!'
    })
  }
  if (!Number.isInteger(id / 1)) {
    return res.status(400).json({
      error: 'Id deve ser do tipo inteiro!'
    })
  }
}

export default new PhotoController()
