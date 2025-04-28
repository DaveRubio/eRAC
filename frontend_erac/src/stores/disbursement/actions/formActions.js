export function useFormActions(state) {
  const resetForm = (formName) => {
    if (formName === 'disbursement') {
      state.forms.value.disbursement = {
        date: '',
        dvNumber: '',
        payee: '',
        amount: '',
      }
    } else if (formName === 'expense') {
      state.forms.value.expense = {
        account: '',
        balance: 0,
        particulars: '',
        disbursementId: null,
      }
    } else if (formName === 'orDetails') {
      state.forms.value.orDetails = {
        receivedFrom: '',
        address: '',
        paymentFor: '',
        receivedBy: '',
      }
    }
  }

  const uploadOrImage = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      state.currentLiquidation.value.orImage = e.target.result
    }
    reader.readAsDataURL(file)
  }

  return {
    resetForm,
    uploadOrImage,
  }
}
