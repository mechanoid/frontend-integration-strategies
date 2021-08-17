import { readFile } from 'fs/promises'
import express from 'express'
import morgan from 'morgan'
import 'pug'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { Baskets } from './lib/baskets.js'

const app = express()
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use((req, _, next) => {
  const method = req.body._method && req.body._method.toUpperCase()
  if (method) {
    req.method = method
  }
  next()
})
app.use(morgan('combined'))

app.use((req, _, next) => {
  if (req.cookies['simple-shop-user-id']) {
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
} catch (e) {
  console.log('failed to load assets manifest file, due to', e.message)
  throw new Error('Client-Assets could not be loaded')
}

export default config => {
  const baskets = new Baskets()

  app.get('/', (req, res) => {
    if (req.userId) {
      res.render('index', { loggedIn: !!req.userId })
    } else {
      res.status(401)
      res.send("You're not logged in. Go Back!!")
    }
  })

  app.get('/basket', (req, res) => {
    if (req.userId) {
      const basket = baskets.getOrCreateBasketByUserId(req.userId)
      res.render('basket', { loggedIn: !!req.userId, items: basket.items })
    } else {
      res.status(401)
      res.send("You're not logged in. Go Back!!")
    }
  })

  app.post('/basket', (req, res) => {
    if (req.userId) {
      const { id, name, count } = req.body
      const basket = baskets.getOrCreateBasketByUserId(req.userId)
      basket.add({ id, name, count })
      res.redirect('/ordering/basket')
    } else {
      res.status(401)
      res.send("You're not logged in. Go Back!!")
    }
  })

  app.delete('/basket/:id', (req, res) => {
    if (req.userId) {
      const basket = baskets.getOrCreateBasketByUserId(req.userId)
      const productId = parseInt(req.params.id)
      console.log('to be deleted', productId)
      if (productId) {
        basket.remove(productId)
        res.redirect('/ordering/basket')
      } else {
        res.status(400)
        res.send('Bad Request! Product ID is missing!')
      }
    } else {
      res.status(401)
      res.send("You're not logged in. Go Back!!")
    }
  })

  return app
}
