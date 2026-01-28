// state.js - Export default state object
export default {
  leads: [],
  assignedLeads: [],
  deletedLeads: [],
  isLoading: false,
  error: null,
  selectedLeads: [],
  filters: {
    status: 'all',
    dateRange: null,
    assignee: null
  }
}