<template>
  <q-dialog v-model="store.dialogs.expenseDetail">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Add Expense</div>
      </q-card-section>

      <q-card-section>
        <!-- Display selected account info -->
        <div class="text-subtitle1 q-mb-sm">
          <strong>Account:</strong> {{ store.forms.expense.account }}
        </div>
        <div class="text-subtitle1 q-mb-md">
          <strong>Balance:</strong> ₱{{ store.forms.expense.balance.toLocaleString() }}
        </div>

        <!-- Particulars Field -->
        <q-input
          outlined
          dense
          v-model="store.forms.expense.particulars"
          label="Particulars"
          class="q-mb-md"
          type="textarea"
          autogrow
        />

        <!-- Amount Field -->
        <q-input
          outlined
          dense
          v-model="store.forms.expense.amount"
          label="Amount"
          class="q-mb-md"
          prefix="₱"
          type="number"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="store.closeDialog('expenseDetail')" />
        <q-btn label="Save" color="primary" @click="store.saveExpense" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDisbursementStore } from '../../stores/disbursement'
const store = useDisbursementStore()
</script>
