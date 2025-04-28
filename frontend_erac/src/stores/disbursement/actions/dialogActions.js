export function useDialogActions(state) {
  const openDialog = (dialogName) => {
    state.dialogs.value[dialogName] = true
  }

  const closeDialog = (dialogName) => {
    state.dialogs.value[dialogName] = false
  }

  /* const openLiquidationTable = () => {
    state.dialogs.value.liquidationTable = true
  }*/

  const openOrDetailsDialog = (item) => {
    state.currentLiquidation.value = {
      ...JSON.parse(JSON.stringify(item)),
      orNumber: '',
      orAmount: '',
      orImage: null,
    }
    state.dialogs.value.orDetails = true
  }

  const openExpenseDetail = (account) => {
    state.forms.value.expense = {
      ...state.forms.value.expense,
      account: account.account,
      balance: account.balance,
      particulars: '',
      amount: 0,
    }
    state.dialogs.value.expense = false
    state.dialogs.value.expenseDetail = true
  }

  return {
    openDialog,
    closeDialog,
    //openLiquidationTable,
    openOrDetailsDialog,
    openExpenseDetail,
  }
}
