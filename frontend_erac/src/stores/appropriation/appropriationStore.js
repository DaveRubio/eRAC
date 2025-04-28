import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppropriationStore = defineStore('appropriation', () => {
  // State
  const showAllocationDialog = ref(false)
  const selectedRow = ref({ total: 0, unappropriated: 0 })
  const searchQuery = ref('')
  const recordsPerPage = ref(5)

  // Accounts data structure with main categories and subcategories
  const accounts = ref([
    {
      id: 1,
      name: 'Personal Service',
      isMainCategory: true,
      amount: '',
      children: [
        { id: 11, name: 'Honorarium', isMainCategory: false, amount: '5000000.00' },
        { id: 12, name: 'Cash Gift', isMainCategory: false, amount: '' },
      ],
    },
    {
      id: 2,
      name: 'MOOE',
      isMainCategory: true,
      amount: '',
      children: [
        { id: 21, name: 'Travel Expenses', isMainCategory: false, amount: '' },
        { id: 22, name: 'Supplies', isMainCategory: false, amount: '' },
      ],
    },
  ])

  // Getters
  const accountColumns = computed(() => [
    { name: 'account', label: 'Accounts', field: 'name', align: 'left' },
    { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  ])

  // Flattened accounts for table display with proper indentation
  const flattenedAccounts = computed(() => {
    let flat = []
    accounts.value.forEach((account) => {
      // Add main category
      flat.push({ ...account, name: account.name, indent: 0 })

      // Add subcategories
      account.children.forEach((child) => {
        flat.push({ ...child, name: `• ${child.name}`, indent: 1 })
      })
    })
    return flat
  })

  // Filtered accounts based on search
  const filteredAccounts = computed(() => {
    if (!searchQuery.value) return flattenedAccounts.value
    return flattenedAccounts.value.filter((account) =>
      account.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  })

  // Calculate total allocated amount
  const totalAllocated = computed(() => {
    let total = 0
    flattenedAccounts.value.forEach((account) => {
      if (account.amount && !isNaN(account.amount)) {
        total += parseFloat(account.amount.replace(/,/g, '')) || 0
      }
    })
    return total
  })

  // Calculate remaining unappropriated amount
  const remainingUnappropriated = computed(() => {
    return selectedRow.value.total - totalAllocated.value
  })

  // Actions
  function openAllocationDialog(row) {
    selectedRow.value = { ...row }
    showAllocationDialog.value = true
  }

  function formatCurrency(value) {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    return num && !isNaN(num)
      ? '₱' +
          num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
      : '₱0.00'
  }

  function saveAllocation() {
    // Update the original accounts structure with the modified amounts
    const flatAccounts = flattenedAccounts.value
    accounts.value.forEach((mainCat) => {
      mainCat.children.forEach((subCat) => {
        const flatItem = flatAccounts.find((item) => item.id === subCat.id)
        if (flatItem) subCat.amount = flatItem.amount
      })
    })

    // Close dialog and potentially emit event or update parent
    showAllocationDialog.value = false
  }

  return {
    showAllocationDialog,
    selectedRow,
    searchQuery,
    recordsPerPage,
    accounts,
    accountColumns,
    flattenedAccounts,
    filteredAccounts,
    totalAllocated,
    remainingUnappropriated,
    openAllocationDialog,
    formatCurrency,
    saveAllocation,
  }
})
