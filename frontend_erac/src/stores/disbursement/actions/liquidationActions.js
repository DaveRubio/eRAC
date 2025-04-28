export function useLiquidationActions(state) {
  const saveOrDetails = () => {
    const index = state.liquidationData.value.findIndex(
      (d) => d.id === state.currentLiquidation.value.id,
    )

    if (index !== -1) {
      const hasOrDetails =
        state.currentLiquidation.value.orNumber &&
        state.currentLiquidation.value.orAmount &&
        state.currentLiquidation.value.orImage

      state.liquidationData.value[index] = {
        ...state.currentLiquidation.value,
        liquidated: hasOrDetails ? 'Yes' : 'No',
        actualExpense: state.currentLiquidation.value.orAmount,
        returnAmount:
          state.currentLiquidation.value.dvAmount - state.currentLiquidation.value.orAmount,
      }
    }
  }

  const addOrDetail = () => {
    if (!state.currentLiquidation.value.orDetails) {
      state.currentLiquidation.value.orDetails = []
    }

    state.currentLiquidation.value.orDetails.push({
      orNumber: '',
      orAmount: '',
      orImage: null,
    })

    // Recalculate totals
    calculateTotals()
  }

  const calculateTotals = () => {
    if (!state.currentLiquidation.value.orDetails) return

    const totalOrAmount = state.currentLiquidation.value.orDetails.reduce(
      (sum, or) => sum + (parseFloat(or.orAmount) || 0),
      0,
    )

    state.currentLiquidation.value.actualExpense = totalOrAmount
    state.currentLiquidation.value.returnAmount =
      state.currentLiquidation.value.dvAmount - totalOrAmount
  }

  const uploadOrImage = (files, index) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      state.currentLiquidation.value.orDetails[index].orImage = e.target.result
    }
    reader.readAsDataURL(files[0])
  }

  return {
    saveOrDetails,
    addOrDetail,
    calculateTotals,
    uploadOrImage,
  }
}
