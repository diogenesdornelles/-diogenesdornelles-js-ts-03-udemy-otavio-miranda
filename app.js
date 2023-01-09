import express from 'express'
import homeRoutes from './src/routes/homeRoutes'
import userRoutes from './src/routes/userRoutes'
import tokenRoutes from './src/routes/tokenRoutes'
import enderecoRoutes from './src/routes/enderecoRoutes'
import alunoRoutes from './src/routes/alunoRoutes'
import cursoRoutes from './src/routes/cursoRoutes'
import turmaRoutes from './src/routes/turmaRoutes'
require('dotenv').config()

class App {
  constructor () {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }

  routes () {
    this.app.use('/', homeRoutes)
    this.app.use('/addresses/', enderecoRoutes)
    this.app.use('/users/', userRoutes)
    this.app.use('/tokens/', tokenRoutes)
    this.app.use('/alunos/', alunoRoutes)
    this.app.use('/cursos/', cursoRoutes)
    this.app.use('/turmas/', turmaRoutes)
  }
}

const app = new App()
export default app.app
