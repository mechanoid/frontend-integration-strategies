import faker from 'faker'

const prefilled = n => [...Array(n).keys()]

export default prefilled(100).map((p, i) => ({
  id: i + 1,
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription()
}))
