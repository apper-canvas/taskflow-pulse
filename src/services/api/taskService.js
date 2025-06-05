// Initialize ApperClient for task operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const tableName = 'task'
const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 'due_date', 'category_id', 'status', 'notes']

export const getAll = async () => {
  try {
    const apperClient = getApperClient()
    const params = {
      fields: tableFields
    }
    const response = await apperClient.fetchRecords(tableName, params)
    return response?.data || []
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export const getById = async (id) => {
  try {
    const apperClient = getApperClient()
    const params = {
      fields: tableFields
    }
    const response = await apperClient.getRecordById(tableName, id, params)
    return response?.data || null
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error)
    throw new Error("Task not found")
  }
}

export const create = async (taskItem) => {
  try {
    const apperClient = getApperClient()
    // Only include Updateable fields
    const params = {
      records: [{
        Name: taskItem.title || taskItem.Name || '',
        Tags: taskItem.tags || taskItem.Tags || '',
        title: taskItem.title || '',
        description: taskItem.description || '',
        priority: taskItem.priority || 'medium',
        due_date: taskItem.dueDate || taskItem.due_date || null,
        category_id: taskItem.categoryId || taskItem.category_id || null,
        status: taskItem.status || 'todo',
        notes: taskItem.notes || ''
      }]
    }
    
    const response = await apperClient.createRecord(tableName, params)
    if (response?.success && response?.results?.[0]?.success) {
      return response.results[0].data
    } else {
      throw new Error(response?.results?.[0]?.message || "Failed to create task")
    }
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

export const update = async (id, data) => {
  try {
    const apperClient = getApperClient()
    // Only include Updateable fields
    const params = {
      records: [{
        Id: id,
        Name: data.title || data.Name || '',
        Tags: data.tags || data.Tags || '',
        title: data.title || '',
        description: data.description || '',
        priority: data.priority || 'medium',
        due_date: data.dueDate || data.due_date || null,
        category_id: data.categoryId || data.category_id || null,
        status: data.status || 'todo',
        notes: data.notes || ''
      }]
    }
    
    const response = await apperClient.updateRecord(tableName, params)
    if (response?.success && response?.results?.[0]?.success) {
      return response.results[0].data
    } else {
      throw new Error(response?.results?.[0]?.message || "Failed to update task")
    }
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export const delete_ = async (id) => {
  try {
    const apperClient = getApperClient()
    const params = {
      RecordIds: [id]
    }
    
    const response = await apperClient.deleteRecord(tableName, params)
    if (response?.success) {
      return { success: true }
    } else {
      throw new Error("Failed to delete task")
    }
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

// Alias for delete since 'delete' is a reserved keyword
export { delete_ as delete }