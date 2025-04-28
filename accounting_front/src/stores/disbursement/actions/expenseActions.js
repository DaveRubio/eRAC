export function useExpenseActions(state) {
  const saveExpense = () => {
    state.expenses.value.push({
      id: state.expenses.value.length + 1,
      disbursementId: state.forms.value.expense.disbursementId,
      accountName: state.forms.value.expense.account,
      amount: state.forms.value.expense.amount.toLocaleString(),
      particular: state.forms.value.expense.particulars,
    })
  }

  const editExpense = (row) => {
    const index = state.expenses.value.findIndex((e) => e.id === row.id)
    if (index !== -1) {
      state.expenses.value[index] = row
    }
  }

  const deleteExpense = (id) => {
    state.expenses.value = state.expenses.value.filter((e) => e.id !== id)
  }

  return {
    saveExpense,
    editExpense,
    deleteExpense,
  }
}
