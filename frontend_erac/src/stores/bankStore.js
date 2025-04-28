import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBankStore = defineStore('bank', () => {
  const banks = ref([
    {
      id: 1,
      name: 'BDO Unibank',
      status: 'Available',
      cheques: [
        { chequeNo: 'CHK-1001', dvNo: 'DV2023-001', date: '2023-05-15' },
        { chequeNo: 'CHK-1002', dvNo: 'DV2023-002', date: '2023-05-20' },
      ],
    },
    {
      id: 2,
      name: 'Bank of the Philippine Islands',
      status: 'Consumed',
      cheques: [{ chequeNo: 'CHK-2001', dvNo: 'DV2023-003', date: '2023-05-18' }],
    },
  ])

  const columns = [
    { name: 'name', label: 'Bank', field: 'name', align: 'center', sortable: true },
    {
      name: 'status',
      label: 'Status',
      field: 'status',
      align: 'center',
      format: (val) =>
        ({
          Available: '✅ Available',
          Consumed: '🔄 Consumed',
        })[val],
    },
  ]

  const chequeColumns = [
    { name: 'chequeNo', label: 'Cheque No.', field: 'chequeNo', align: 'left' },
    { name: 'dvNo', label: 'DV Number', field: 'dvNo', align: 'left' },
    { name: 'date', label: 'Date', field: 'date' },
  ]

  return { banks, columns, chequeColumns }
})
