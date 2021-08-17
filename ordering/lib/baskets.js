class Item {
  constructor({id, name, count = 1}) {
    Object.assign(this, { id, name, count })
  }
}

class Basket {
  constructor(userId) {
    this.userId = userId
    this._items = {}
  }

  get items() {
    return this._items.reduce((result, item) => result.concat(item), [])
  }

  itemById(id) {
    return this._items[id]
  }

  add({id, name, count}) {
    if(!this.itemById(id)) {
      this._items[id] = { id, name, count }
    } else {
      const item = this.itemById(id)
      item.count += count
    }
  }

  remove(id) {
    delete this._items[id]
  }

  updateCount({ id, count }) {
    const item = this.itemById(id)
    item.count = count
  }
}

class Baskets {
  constructor () {
    this.basketsByUsers = {}
  }

  basketByUserId(userId) {
    return this.basketsByUsers[userId]
  }

  addBasketForUserId(userId, basket) {
    this.basketsByUsers[userId] = basket
  }

  basketByUserIdExists(userId) {
    return !!this.basketByUserId(userId)
  }

  getOrCreateBasketByUserId(userId) {
    if(this.basketByUserIdExists(userId)) {
      return this.basketByUserId(userId)
    } else {
      const basket = new Basket(userId)
      this.addBasketForUserId(userId, basket)
      return basket
    }
  }
}
