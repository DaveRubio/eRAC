<template>
  <!-- Expense Selection Dialog -->
  <q-dialog v-model="store.dialogs.expense">
    <q-card style="min-width: 800px">
      <q-card-section>
        <div class="text-h6">Select Expense Account</div>
      </q-card-section>

      <q-card-section>
        <q-input
          outlined
          dense
          placeholder="Search expense account..."
          v-model="store.expenseSearch"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Expense Account Selection Table -->
        <q-table
          :rows="store.expenseAccounts"
          :columns="store.expenseAccountColumns"
          row-key="id"
          :filter="store.expenseSearch"
        >
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn
                flat
                label="Select"
                color="primary"
                @click="store.openExpenseDetail(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="store.closeDialog('expense')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDisbursementStore } from '../../stores/disbursement'
const store = useDisbursementStore()
</script>
