import { ref } from 'vue'

export function initialState() {
  return {
    // Main data collections
    currentItem: ref(null),
    disbursements: ref([
      {
        id: 1,
        date: '22/01/2025',
        dvNumber: 'DV-25-43-01',
        checkNumber: '123456',
        bank: 'BDO',
        payee: 'NORDECO',
        amount: '4,000.00',
        aging: '20 days',
        status: 'Liquidated',
      },

      {
        id: 2,
        date: '22/01/2025',
        dvNumber: 'DV-25-43-21',
        checkNumber: '123456',
        bank: 'Metro Bank',
        payee: 'NORDECO',
        amount: '4,000.00',
        aging: '20 days',
        status: 'Partially Liquidated',
      },
    ]),

    expenses: ref([
      {
        id: 1,
        disbursementId: 1,
        accountName: 'MOOE-Electricity',
        amount: '2,500.00',
        particular: 'Bill for March 2025',
      },
    ]),
    expenseAccounts: ref([

      { id: 1, account: 'MOOE - Electricity', balance: 100000.0 },
      { id: 2, account: 'MOOE - Water', balance: 75000.0 },
      { id: 3, account: 'MOOE - Internet', balance: 50000.0 },
    ]),

    // In state.js
    liquidationData: ref([
      {
        id: 1,
        date: '22/1/2025',
        dvNumber: 'DV-25-43-01',
        particulars: 'Bill for March 2025',
        dvAmount: 5000.0,
        returnAmount: 4000.0,
        actualExpense: 1000.0,
        remarks: 'Approved by Barangay Treasurer',
        orDetails: [
          // Changed to array of OR details
          {
            orNumber: '',
            orAmount: '',
            orImage: null,
          },
        ],
        status: 'Incomplete',
      },
    ]),

    // Current selections
    currentLiquidation: ref(null),

    // Search/filters
    searchQuery: ref(''),
    dateFrom: ref(''),
    dateTo: ref(''),

    // UI state
    dialogs: ref({
      disbursement: false,
      expense: false,
      expenseDetail: false,
      liquidationTable: false,
      orDetails: false,
    }),

    // Form data
    forms: ref({
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
        receivedFrom: '',
        address: '',
        paymentFor: '',
        receivedBy: '',
      },
    }),

    // Pagination
    pagination: ref({ rowsPerPage: 10 }),
  }
}
