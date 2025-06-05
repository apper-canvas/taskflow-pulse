// Initialize ApperClient for category operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const tableName = 'category'
const tableFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']

export const getAll = async () => {
  try {
    const apperClient = getApperClient()
    const params = {
      fields: tableFields
    }
    const response = await apperClient.fetchRecords(tableName, params)
    return response?.data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
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
    console.error(`Error fetching category with ID ${id}:`, error)
    throw new Error("Category not found")
  }
}

export const create = async (categoryItem) => {
  try {
    const apperClient = getApperClient()
    // Only include Updateable fields: Name, Tags, Owner
    const params = {
      records: [{
        Name: categoryItem.name || categoryItem.Name,
        Tags: categoryItem.tags || categoryItem.Tags || '',
        Owner: categoryItem.owner || categoryItem.Owner || ''
      }]
    }
    
    const response = await apperClient.createRecord(tableName, params)
    if (response?.success && response?.results?.[0]?.success) {
      return response.results[0].data
    } else {
      throw new Error(response?.results?.[0]?.message || "Failed to create category")
    }
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

export const update = async (id, data) => {
  try {
    const apperClient = getApperClient()
    // Only include Updateable fields: Name, Tags, Owner
    const params = {
      records: [{
        Id: id,
        Name: data.name || data.Name,
        Tags: data.tags || data.Tags || '',
        Owner: data.owner || data.Owner || ''
      }]
    }
    
    const response = await apperClient.updateRecord(tableName, params)
    if (response?.success && response?.results?.[0]?.success) {
      return response.results[0].data
    } else {
      throw new Error(response?.results?.[0]?.message || "Failed to update category")
    }
  } catch (error) {
    console.error("Error updating category:", error)
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
      throw new Error("Failed to delete category")
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}

export { delete_ as delete }