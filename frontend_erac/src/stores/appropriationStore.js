// store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppropriationStore = defineStore('appropriation', () => {
  // State
  const showAllocationDialog = ref(false)
  const selectedRow = ref({
    total: 0,
    unappropriated: 0,
    description: '',
  })
  const searchQuery = ref('')
  const recordsPerPage = ref(5)

  // Accounts data structure with type safety
  const accounts = ref([
    {
      id: 1,
      name: 'Personal Service',
      isMainCategory: true,
      amount: '',
      children: [
        {
          id: 11,
          name: 'Honorarium',
          isMainCategory: false,
          amount: '5000000.00',
        },
        {
          id: 12,
          name: 'Cash Gift',
          isMainCategory: false,
          amount: '',
        },
      ],
    },
    {
      id: 2,
      name: 'MOOE',
      isMainCategory: true,
      amount: '',
      children: [
        {
          id: 21,
          name: 'Travel Expenses',
          isMainCategory: false,
          amount: '',
        },
        {
          id: 22,
          name: 'Supplies',
          isMainCategory: false,
          amount: '',
          children: [
            {
              id: 221,
              name: 'Office Supplies',
              isMainCategory: false,
              amount: '',
            },
          ],
        },
      ],
    },
  ])

  // Computed Properties
  const flattenedAccounts = computed(() => {
    const flatten = (items, depth = 0) => {
      if (!items || !Array.isArray(items)) return []

      return items.reduce((acc, item) => {
        if (!item) return acc

        // Add the current item with proper indentation
        const prefix = depth > 0 ? '→ '.repeat(depth) : ''
        const flatItem = {
          ...item,
          indent: depth,
          displayName: prefix + item.name,
          indentStyle: { paddingLeft: `${depth * 20}px` },
        }
        acc.push(flatItem)

        // Process children if they exist
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          const childItems = flatten(item.children, depth + 1)
          acc.push(...childItems)
        }

        return acc
      }, [])
    }

    return flatten(accounts.value)
  })

  const filteredAccounts = computed(() => {
    if (!searchQuery.value.trim()) return flattenedAccounts.value

    const query = searchQuery.value.toLowerCase()

    // First identify all matching items
    const matchingIds = new Set()
    const matchingItems = flattenedAccounts.value.filter((item) => {
      const matches =
        item.name.toLowerCase().includes(query) ||
        (item.displayName && item.displayName.toLowerCase().includes(query))
      if (matches) matchingIds.add(item.id)
      return matches
    })

    // Add parent categories of matching items
    const parentCategories = flattenedAccounts.value.filter(
      (item) =>
        item.isMainCategory &&
        flattenedAccounts.value.some(
          (child) => child.indent > item.indent && matchingIds.has(child.id),
        ),
    )

    // Combine matches with their parent categories
    return [...new Set([...matchingItems, ...parentCategories])].sort((a, b) => {
      // Sort by the original order in flattenedAccounts
      const indexA = flattenedAccounts.value.findIndex((item) => item.id === a.id)
      const indexB = flattenedAccounts.value.findIndex((item) => item.id === b.id)
      return indexA - indexB
    })
  })

  const totalAllocated = computed(() => {
    return flattenedAccounts.value.reduce((total, account) => {
      if (!account.amount || account.isMainCategory) return total

      const amount = parseFloat(String(account.amount).replace(/,/g, '')) || 0
      return total + amount
    }, 0)
  })

  const remainingUnappropriated = computed(() => {
    return (selectedRow.value?.total || 0) - totalAllocated.value
  })

  // Actions
  const openAllocationDialog = (row) => {
    selectedRow.value = {
      total: row.total || 0,
      unappropriated: row.unappropriated || 0,
      description: row.description || '',
    }
    showAllocationDialog.value = true
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₱0.00'

    const num =
      typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value)

    return isNaN(num)
      ? '₱0.00'
      : num.toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP',
          minimumFractionDigits: 2,
        })
  }

  const calculateTotals = () => {
    // This function will be called whenever an amount changes
    // to recalculate totals and unappropriated amounts

    // Update unappropriated amount
    if (selectedRow.value) {
      selectedRow.value.unappropriated = remainingUnappropriated.value
    }
  }

  const saveAllocation = () => {
    try {
      // Update the original accounts structure based on the flattened view
      const updateAccountRecursively = (items, flatItem) => {
        for (const item of items) {
          if (item.id === flatItem.id) {
            item.amount = flatItem.amount
            return true
          }

          if (item.children && item.children.length) {
            if (updateAccountRecursively(item.children, flatItem)) {
              return true
            }
          }
        }
        return false
      }

      // Update all non-main category accounts
      flattenedAccounts.value
        .filter((item) => !item.isMainCategory)
        .forEach((flatItem) => {
          updateAccountRecursively(accounts.value, flatItem)
        })

      showAllocationDialog.value = false
      return true
    } catch (error) {
      console.error('Failed to save allocation:', error)
      return false
    }
  }

  return {
    // State
    showAllocationDialog,
    selectedRow,
    searchQuery,
    recordsPerPage,
    accounts,

    // Computed
    flattenedAccounts,
    filteredAccounts,
    totalAllocated,
    remainingUnappropriated,

    // Actions
    openAllocationDialog,
    formatCurrency,
    saveAllocation,
    calculateTotals,
  }
})
