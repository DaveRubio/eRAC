import { computed } from 'vue'

export function useGetters(state) {
  const disbursementColumns = computed(() => [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
    { name: 'dvNumber', label: 'DV Number', field: 'dvNumber', align: 'left', sortable: true },
    {
      name: 'checkNumber',
      label: 'Check Number',
      field: 'checkNumber',
      align: 'left',
      sortable: true,
    },
    { name: 'bank', label: 'Bank', field: 'bank', align: 'left', sortable: true },
    { name: 'payee', label: 'Payee', field: 'payee', align: 'left', sortable: true },
    { name: 'amount', label: 'Amount', field: 'amount', align: 'left', sortable: true },
    { name: 'aging', label: 'Aging', field: 'aging', align: 'left', sortable: true },
    { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
    { name: 'action', label: 'Action', field: '', align: 'center' },
  ])

  const expenseColumns = computed(() => [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    {
      name: 'accountName',
      label: 'Account Name',
      field: 'accountName',
      align: 'left',
      sortable: true,
    },
    { name: 'amount', label: 'Amount', field: 'amount', align: 'left', sortable: true },
    { name: 'particular', label: 'Particular', field: 'particular', align: 'left', sortable: true },
    { name: 'action', label: 'Action', field: '', align: 'center' },
  ])

  const expenseAccountColumns = computed(() => [
    { name: 'account', label: 'Account', field: 'account', align: 'left', sortable: true },
    {
      name: 'balance',
      label: 'Balance',
      field: (row) => `₱${row.balance.toLocaleString()}`,
      align: 'left',
      sortable: true,
    },
    { name: 'action', label: 'Action', field: '', align: 'center' },
  ])

  const liquidationColumns = computed(() => [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'date', label: 'Date', field: 'date', align: 'left' },
    { name: 'dvNumber', label: 'DV Number', field: 'dvNumber', align: 'left', sortable: true },
    {
      name: 'particulars',
      label: 'Particulars',
      field: 'particulars',
      align: 'left',
      sortable: true,
    },
    {
      name: 'dvAmount',
      label: 'DV Amount',
      field: 'dvAmount',
      align: 'left',
      sortable: true,
      format: (val) => `₱${val.toFixed(2)}`,
    },
    { name: 'orNumber', label: 'OR Number', field: 'orNumber', align: 'left', sortable: true },
    {
      name: 'orAmount',
      label: 'OR Amount',
      field: 'orAmount',
      align: 'left',
      format: (val) => (val ? `₱${val.toFixed(2)}` : '-'),
      sortable: true,
    },
    { name: 'orImage', label: 'OR Image', field: 'orImage', align: 'left', sortable: true },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'left',
    },
  ])

  const filteredDisbursements = computed(() => {
    return state.disbursements.value.filter((disbursement) => {
      const matchesSearch =
        disbursement.payee.toLowerCase().includes(state.searchQuery.value.toLowerCase()) ||
        disbursement.dvNumber.toLowerCase().includes(state.searchQuery.value.toLowerCase())
      const matchesDate = true // Add date filtering logic here
      return matchesSearch && matchesDate
    })
  })

  return {
    disbursementColumns,
    expenseColumns,
    expenseAccountColumns,
    liquidationColumns,
    filteredDisbursements,
  }
}
