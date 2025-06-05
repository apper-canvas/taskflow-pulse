import taskData from '../mockData/task.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...taskData]

export const getAll = async () => {
  await delay(300)
  return [...tasks]
}

export const getById = async (id) => {
  await delay(200)
  const task = tasks.find(t => t.id === id)
  if (!task) {
    throw new Error('Task not found')
  }
  return { ...task }
}

export const create = async (taskItem) => {
  await delay(400)
  const newTask = {
    ...taskItem,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  tasks.push(newTask)
  return { ...newTask }
}

export const update = async (id, data) => {
  await delay(350)
  const index = tasks.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('Task not found')
  }
  
  const updatedTask = {
    ...tasks[index],
    ...data,
    id,
    updatedAt: new Date().toISOString()
  }
  
  tasks[index] = updatedTask
  return { ...updatedTask }
}

export const delete_ = async (id) => {
  await delay(250)
  const index = tasks.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('Task not found')
  }
  
  tasks.splice(index, 1)
  return { success: true }
}

// Alias for delete since 'delete' is a reserved keyword
export { delete_ as delete }