import categoryData from '../mockData/category.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let categories = [...categoryData]

export const getAll = async () => {
  await delay(250)
  return [...categories]
}

export const getById = async (id) => {
  await delay(200)
  const category = categories.find(c => c.id === id)
  if (!category) {
    throw new Error('Category not found')
  }
  return { ...category }
}

export const create = async (categoryItem) => {
  await delay(300)
  const newCategory = {
    ...categoryItem,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  categories.push(newCategory)
  return { ...newCategory }
}

export const update = async (id, data) => {
  await delay(300)
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('Category not found')
  }
  
  const updatedCategory = {
    ...categories[index],
    ...data,
    id
  }
  
  categories[index] = updatedCategory
  return { ...updatedCategory }
}

export const delete_ = async (id) => {
  await delay(200)
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('Category not found')
  }
  
  categories.splice(index, 1)
  return { success: true }
}

export { delete_ as delete }