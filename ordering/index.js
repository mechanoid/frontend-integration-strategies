import {readFile} from 'fs/promises'
import express from 'express'
import morgan from 'morgan'
import 'pug'

const app = express()
app.use(morgan('combined'))
app.set('view engine', 'pug')

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
    res.render('index')
  })

  return app
}
