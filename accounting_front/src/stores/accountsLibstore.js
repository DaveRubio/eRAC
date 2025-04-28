import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useAuthStore } from './auth'

// Helper function with better debugging
const getAuthConfig = () => {
  const authStore = useAuthStore()
  console.log('Current auth token:', authStore.token ? 'Token exists' : 'No token')

  if (!authStore.token) {
    console.warn('No authentication token found')
    throw new Error('Authentication required')
  }

  return {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  }
}

export const useAccountsLibraryStore = defineStore('accounts-library', {
  state: () => ({
    years: [],
    selectedYear: null,
    loading: false,
    error: null,
  }),

  getters: {
    yearOptions: (state) => {
      const yearsArray = Array.isArray(state.years) ? state.years : []
      return yearsArray.map((year) => ({
        label: year.year.toString(),
        value: year.year.toString(),
      }))
    },
  },

  actions: {
    async fetchYears() {
      this.loading = true
      try {
        // Let's try using auth for this call too, in case it's needed
        const config = getAuthConfig()
        console.log('Fetching years with config:', config)

        const response = await api.get('/api/barangay/fiscal-years', config)
        console.log('Years response:', response)

        this.years = response.data.data || []
        if (this.years.length > 0) {
          this.selectedYear = this.years[0].year.toString()
        }

        // Set current year as default if available
        const currentYear = new Date().getFullYear().toString()
        const yearExists = this.years.some((y) => y.year.toString() === currentYear)
        this.selectedYear = yearExists
          ? currentYear
          : this.years.length > 0
            ? this.years[0].year.toString()
            : null
      } catch (error) {
        console.error('Failed to fetch years:', error)
        this.error = error.response?.data?.message || error.message
        this.years = []
      } finally {
        this.loading = false
      }
    },

    async addYear(newYear) {
      this.loading = true
      try {
        console.log('Adding new year:', newYear)
        const config = getAuthConfig()
        console.log('Using auth config:', config)

        const response = await api.post('/api/barangay/fiscal-years', { year: newYear }, config)

        console.log('Add year response:', response)
        this.years.push(response.data)
        this.years.sort((a, b) => b.year - a.year)
        this.selectedYear = newYear

        return response.data
      } catch (error) {
        console.error('Failed to add year:', error)
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Add a method to ensure auth token is available
    async ensureAuthenticated() {
      const authStore = useAuthStore()
      if (!authStore.token) {
        console.log('No token found, attempting to refresh auth...')
        // If your auth store has a refresh method, call it here
        // await authStore.refreshToken()

        // If you still don't have a token after refresh attempt
        if (!authStore.token) {
          throw new Error('Authentication required')
        }
      }
      return true
    },
  },
})
