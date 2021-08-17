import {readFile} from 'fs/promises'
import express from 'express'
import morgan from 'morgan'
import 'pug'
import cookieParser from 'cookie-parser'

const app = express()
app.use(morgan('combined'))
app.set('view engine', 'pug')
app.use(cookieParser());

app.use((req, _, next) => {
  if(req.cookies['simple-shop-user-id']) {
    const userId = req.cookies['simple-shop-user-id']

    req.userId = userId
  }

  next()
})

try {
  const assetsManifestFile = await readFile('node_modules/pattern-lib/dist/manifest.json')
  const assetsManifest = JSON.parse(assetsManifestFile)

  app.locals = app.locals || {}
  app.locals.assetsManifest = assetsManifest
} catch(e) {
  console.log('failed to load assets manifest file, due to', e.message);
  throw new Error('Client-Assets could not be loaded')
}

export default config => {
  app.get('/', (req, res) => {
    res.render('index', { loggedIn: !!req.userId })
  })

  app.get('/basket', (req, res) => {
    res.render('basket', { loggedIn: !!req.userId })
  })

  return app
}
