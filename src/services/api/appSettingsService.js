import appSettingsData from '../mockData/appSettings.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let settings = { ...appSettingsData }

export const getAll = async () => {
  await delay(200)
  return { ...settings }
}

export const getById = async (id) => {
  await delay(150)
  if (id !== 'user-settings') {
    throw new Error('Settings not found')
  }
  return { ...settings }
}

export const create = async (settingsItem) => {
  await delay(250)
  const newSettings = {
    ...settingsItem,
    id: 'user-settings',
    updatedAt: new Date().toISOString()
  }
  settings = newSettings
  return { ...newSettings }
}

export const update = async (id, data) => {
  await delay(300)
  if (id !== 'user-settings') {
    throw new Error('Settings not found')
  }
  
  const updatedSettings = {
    ...settings,
    ...data,
    id,
    updatedAt: new Date().toISOString()
  }
  
  settings = updatedSettings
  return { ...updatedSettings }
}

export const delete_ = async (id) => {
  await delay(200)
  if (id !== 'user-settings') {
    throw new Error('Settings not found')
  }
  
  settings = {
    id: 'user-settings',
    theme: 'light',
    defaultView: 'list',
    defaultCategory: '',
    taskSortOrder: 'dueDate'
  }
  return { success: true }
}

export { delete_ as delete }