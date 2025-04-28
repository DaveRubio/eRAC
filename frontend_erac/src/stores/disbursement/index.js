//Disbursement Store
import { defineStore } from 'pinia'
import { initialState } from './state'
import { useGetters } from './getters'
import { useDialogActions } from './actions/dialogActions.js'
import { useFormActions } from './actions/formActions'
import { useDisbursementActions } from './actions/disbursementActions'
import { useExpenseActions } from './actions/expenseActions'
import { useLiquidationActions } from './actions/liquidationActions'

export const useDisbursementStore = defineStore('disbursement', () => {
  const state = initialState()
  const getters = useGetters(state)

  // Combine all actions
  const actions = {
    ...useDialogActions(state),
    ...useFormActions(state),
    ...useDisbursementActions(state),
    ...useExpenseActions(state),
    ...useLiquidationActions(state),
  }

  return {
    // State
    ...state,

    // Getters
    ...getters,

    // Actions
    ...actions,
  }
})
