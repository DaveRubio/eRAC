// src/stores/disbursementStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDisbursementStore = defineStore('disbursement', () => {
  // State
  const currentItem = ref(null)
  const disbursements = ref([
    {
      id: 1,
      date: '22/01/2025',
      dvNumber: 'DV-25-43-01',
      checkNumb: '1234',
      dvAmount: '4,000.00',
      payee: 'NORDECO',
      bank: 'BDO',
    },
  ])

  const expenses = ref([
    {
      id: 1,
      disbursementId: 1,
      accountName: 'MOOE-Electricity',
      amount: '2,500.00',
      particular: 'Bill for March 2025',
      sortable: true,
    },
    {
      id: 2,
      disbursementId: 1,
      accountName: 'MOOE-Electricity',
      amount: '1,500.00',
      particular: 'Bill for April 2025',
      sortable: true,
    },
  ])

  const expenseAccounts = ref([
    { id: 1, account: 'MOOE - Electricity', balance: 100000.0, sortable: true },
    { id: 2, account: 'MOOE - Water', balance: 75000.0, sortable: true },
    { id: 3, account: 'MOOE - Internet', balance: 50000.0, sortable: true },
    { id: 4, account: 'MOOE - Office Supplies', balance: 30000.0, sortable: true },
  ])

  const liquidationData = ref([
    {
      id: 1,
      date: '22/1/2025',
      dvNumber: 'DV-25-43-01',
      particulars: 'Bill for March 2025',
      dvAmount: 5000.0,
      returnAmount: 40000.0,
      actualExpense: 10000.0,
      remarks: 'Approved by Barangay Treasurer',
      orNumber: '',
      orAmount: '',
      orImage: null,
      liquidated: 'No',
    },
  ])

  const currentLiquidation = ref(null)

  // Search/filters
  const searchQuery = ref('')
  const dateFrom = ref('')
  const dateTo = ref('')

  // Dialogs
  const dialogs = ref({
    disbursement: false,
    expense: false,
    expenseDetail: false,
    liquidationTable: false, // Added for liquidation table view
    orDetails: false, // Added for OR details input form
  })

  // Forms
  const forms = ref({
    disbursement: {
      date: '',
      dvNumber: '',
      payee: '',
      amount: '',
    },
    expense: {
      account: '',
      balance: 0,
      particulars: '',
      amount: 0,
      disbursementId: null,
    },
    orDetails: {
      // Added for OR details form
      receivedFrom: '',
      address: '',
      paymentFor: '',
      receivedBy: '',
    },
  })

  // Getters (computed properties)
  const disbursementColumns = computed(() => [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
    { name: 'dvNumber', label: 'DV Number', field: 'dvNumber', align: 'left', sortable: true },
    { name: 'checkNumb', label: 'Check Number', field: 'checkNumb', align: 'left', sortable: true },
    { name: 'dvAmount', label: 'DV Amount', field: 'dvAmount', align: 'left', sortable: true },
    { name: 'payee', label: 'Payee', field: 'payee', align: 'left', sortable: true },
    { name: 'bank', label: 'Bank', field: 'bank', align: 'left', sortable: true },
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
    { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
    { name: 'particular', label: 'Particular', field: 'particular', align: 'left', sortable: true },
    { name: 'action', label: 'Action', field: '', align: 'center' },
  ])

  const expenseAccountColumns = computed(() => [
    { name: 'account', label: 'Account', field: 'account', align: 'left' },
    {
      name: 'balance',
      label: 'Balance',
      field: (row) => `₱${row.balance.toLocaleString()}`,
      align: 'right',
      sortable: true,
    },
    { name: 'action', label: 'Action', field: '', align: 'center' },
  ])

  const liquidationColumns = [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
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
      sortable: true,
      format: (val) => (val ? `₱${val.toFixed(2)}` : '-'),
    },
    { name: 'orImage', label: 'OR Image', field: 'orImage', align: 'center', sortable: true },
    {
      name: 'liquidated',
      label: 'Liquidated',
      field: 'liquidated',
      align: 'center',
      format: (val) => val || 'No',
    },
  ]

  const pagination = ref({ rowsPerPage: 10 })

  // Actions
  const openDialog = (dialogName) => {
    dialogs.value[dialogName] = true
  }

  const closeDialog = (dialogName) => {
    dialogs.value[dialogName] = false
  }

  // Liquidation specific actions
  const openLiquidationTable = () => {
    dialogs.value.liquidationTable = true
  }

  const openOrDetailsDialog = (item) => {
    currentLiquidation.value = {
      ...JSON.parse(JSON.stringify(item)),
      orNumber: '',
      orAmount: '',
      orImage: null,
    }
    dialogs.value.orDetails = true
  }

  const saveOrDetails = () => {
    const index = liquidationData.value.findIndex((d) => d.id === currentLiquidation.value.id)
    if (index !== -1) {
      const hasOrDetails =
        currentLiquidation.value.orNumber &&
        currentLiquidation.value.orAmount &&
        currentLiquidation.value.orImage

      liquidationData.value[index] = {
        ...currentLiquidation.value,
        liquidated: hasOrDetails ? 'Yes' : 'No',
        actualExpense: currentLiquidation.value.orAmount,
        returnAmount: currentLiquidation.value.dvAmount - currentLiquidation.value.orAmount,
      }
    }
    dialogs.value.orDetails = false
  }

  const uploadOrImage = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      currentLiquidation.value.orImage = e.target.result
    }
    reader.readAsDataURL(file)
  }

  // Existing disbursement actions
  const openExpenseDetail = (account) => {
    forms.value.expense = {
      ...forms.value.expense,
      account: account.account,
      balance: account.balance,
      particulars: '',
      amount: 0,
    }
    dialogs.value.expense = false
    dialogs.value.expenseDetail = true
  }

  const saveDisbursement = () => {
    const newId = disbursements.value.length + 1
    disbursements.value.push({
      id: newId,
      ...forms.value.disbursement,
    })
    resetForm('disbursement')
    closeDialog('disbursement')
  }

  const saveExpense = () => {
    expenses.value.push({
      id: expenses.value.length + 1,
      disbursementId: forms.value.expense.disbursementId,
      accountName: forms.value.expense.account,
      amount: forms.value.expense.amount.toLocaleString(),
      particular: forms.value.expense.particulars,
    })
    closeDialog('expenseDetail')
  }

  const resetForm = (formName) => {
    if (formName === 'disbursement') {
      forms.value.disbursement = {
        date: '',
        dvNumber: '',
        payee: '',
        amount: '',
      }
    } else if (formName === 'expense') {
      forms.value.expense = {
        account: '',
        balance: 0,
        particulars: '',
        amount: 0,
        disbursementId: null,
      }
    } else if (formName === 'orDetails') {
      forms.value.orDetails = {
        receivedFrom: '',
        address: '',
        paymentFor: '',
        receivedBy: '',
      }
    }
  }

  // Other CRUD operations
  const editItem = (row) => console.log('Editing:', row)
  const deleteItem = (row) => console.log('Deleting:', row)
  const editDisbursement = (row) => console.log('Editing disbursement:', row)
  const deleteDisbursement = (row) => console.log('Deleting disbursement:', row)
  const viewDisbursement = (row) => console.log('Viewing disbursement:', row)

  return {
    // State
    currentItem,
    disbursements,
    expenses,
    expenseAccounts,
    liquidationData,
    currentLiquidation,
    searchQuery,
    dateFrom,
    dateTo,
    dialogs,
    forms,
    pagination,

    // Getters
    disbursementColumns,
    expenseColumns,
    expenseAccountColumns,
    liquidationColumns,

    // Actions
    openDialog,
    closeDialog,
    openExpenseDetail,
    saveDisbursement,
    saveExpense,
    resetForm,
    editItem,
    deleteItem,
    editDisbursement,
    deleteDisbursement,
    viewDisbursement,

    // Liquidation actions
    openLiquidationTable,
    openOrDetailsDialog,
    saveOrDetails,
    uploadOrImage,
  }
})
