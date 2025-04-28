<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-weight-bold">Disbursement Transaction</div>
    </div>
    <div class="q-mb-md">
      <SearchFilters />
      <DisbursementDialog />
      <ExpenseSelectionDialog />
      <ExpenseDetailDialog />
      <DisbursementTable />
      <LiquidationTableDialog />
      <OrDetailsDialog />
    </div>
  </q-page>
</template>

<script setup>
import SearchFilters from '../../components/disbursement/SearchFilters.vue'
import DisbursementDialog from '../../components/disbursement/DisbursementDialog.vue'
import ExpenseSelectionDialog from '../../components/disbursement/ExpenseSelectionDialog.vue'
import ExpenseDetailDialog from '../../components/disbursement/ExpenseDetailDialog.vue'
import DisbursementTable from '../../components/disbursement/DisbursementTable.vue'
import LiquidationTableDialog from '../../components/disbursement/LiquidationTableDialog.vue'
import OrDetailsDialog from '../../components/disbursement/OrDetailsDialog.vue'
</script>
