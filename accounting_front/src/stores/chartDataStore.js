import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

export const useChartDataStore = defineStore('chartData', () => {
  // Reactive date range
  const dateFrom = ref(new Date(new Date().getFullYear(), 0, 1)) // Start of current year
  const dateTo = ref(new Date()) // Current date

  // Enhanced Summary Cards Data
  const summaryCards = ref([
    {
      label: 'Total Appropriation',
      value: '₱50,000,000.00',
      icon: 'account_balance',
      color: 'secondary',
      trend: 'up',
      change: '2.5%',
    },
    {
      label: 'Total Obligation',
      value: '₱21,000,000.00',
      icon: 'assignment',
      color: 'secondary',
      trend: 'down',
      change: '1.2%',
    },
    {
      label: 'Total Balance',
      value: '₱29,000,000.00',
      icon: 'balance',
      color: 'secondary',
      trend: 'up',
      change: '3.8%',
    },
  ])

  // Modern Doughnut Chart Data
  const doughnutChartData = ref({
    labels: [
      'MOOE',
      'Personal Services',
      'Capital Outlay',
      'Other Expenses',
      'Miscellaneous',
      'Supplies',
      'Equipment',
      'Utilities',
    ],
    datasets: [
      {
        data: [35000, 25000, 40000, 15000, 20000, 30000, 25000, 10000],
        backgroundColor: ['#2E7D32', '#1565C0', '#FFA000'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  })

  const formatDate = (date, options = {}) => {
    if (!date) return '' // Handle empty dates

    const d = new Date(date)
    const {
      fullYear = false, // Show full year (YYYY) if true, else YY
      separator = '/', // Custom separator (default '/')
    } = options

    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const year = fullYear ? d.getFullYear() : String(d.getFullYear()).slice(-2)

    return [month, day, year].join(separator)
  }

  const recentDisbursementRows = ref([
    {
      dvNumber: '',
      dvAmount: '',
      date: '',
      status: '',
      liquidatedAmount: '',
    },
    {
      dvNumber: '',
      dvAmount: '',
      date: '',
      status: '',
      liquidatedAmount: '',
    },
    {
      dvNumber: '',
      dvAmount: '',
      date: '',
      status: '',
      liquidatedAmount: '',
    },
    {
      dvNumber: '',
      dvAmount: '',
      date: '',
      status: '',
      liquidatedAmount: '',
    },
  ])

  // Table columns definition
  const recentDisbursementColumns = computed(() => [
    {
      name: 'dvNumber',
      required: true,
      label: 'DV Number',
      align: 'center',
      sortable: true,
    },
    {
      name: 'dvAmount',
      label: 'DV Amount',
      align: 'center',
      field: 'dvAmount',
      sortable: true,
    },
    {
      name: 'date',
      label: 'Date',
      align: 'center',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Status',
      align: 'center',
      field: 'status',
      sortable: true,
    },
    {
      name: 'liquidatedAmount',
      label: 'Liquidated Amount',
      align: 'center',
      field: 'liquidatedAmount',
      sortable: true,
    },
  ])

  // Status color mapping
  const getStatusColor = (status) => {
    const statusMap = {
      Completed: 'positive',
      'For Liquidation': 'warning',
      Pending: 'negative',
    }
    return statusMap[status] || 'grey'
  }

  // Chart Options
  const chartOptions = ref({
    doughnut: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return ` ${context.label}: ₱${context.raw.toLocaleString()}`
            },
          },
        },
      },
    },
    line: {
      // ... (keep your line chart options if needed)
    },
  })

  // Function to fetch data based on date range
  const fetchData = async () => {
    console.log('Fetching data for date range:', dateFrom.value, dateTo.value)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summaryCards: summaryCards.value,
          doughnutChartData: doughnutChartData.value,
        })
      }, 300)
    })
  }

  // Watch for date changes and automatically update data
  watch(
    [dateFrom, dateTo],
    async () => {
      await fetchData()
    },
    { immediate: true },
  )

  return {
    dateFrom,
    dateTo,
    summaryCards,
    doughnutChartData,
    recentDisbursementColumns,
    formatDate,
    getStatusColor,
    recentDisbursementRows,
    chartOptions,
    fetchData,
  }
})
