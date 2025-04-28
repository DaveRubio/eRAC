export function useDisbursementActions(state) {
  const saveDisbursement = () => {
    const newId = state.disbursements.value.length + 1
    state.disbursements.value.push({
      id: newId,
      ...state.forms.value.disbursement,
    })
  }

  const editDisbursement = (row) => {
    const index = state.disbursements.value.findIndex((d) => d.id === row.id)
    if (index !== -1) {
      state.disbursements.value[index] = row
    }
  }

  const deleteDisbursement = (id) => {
    state.disbursements.value = state.disbursements.value.filter((d) => d.id !== id)
  }

  const viewDisbursement = (id) => {
    state.currentItem.value = state.disbursements.value.find((d) => d.id === id)
  }

  return {
    saveDisbursement,
    editDisbursement,
    deleteDisbursement,
    viewDisbursement,
  }
}
