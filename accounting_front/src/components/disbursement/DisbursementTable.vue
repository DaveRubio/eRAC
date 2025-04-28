<template>
  <!-- Main Data Table -->
  <q-card>
    <q-table
      :rows="store.disbursements"
      :columns="store.disbursementColumns"
      row-key="id"
      :pagination="store.pagination"
    >
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="button-group">
            <q-btn class="edit-btn" icon="edit" @click="store.editDisbursement(props.row)" />
            <q-btn
              class="allocate-btn"
              icon="visibility"
              @click="store.editDisbursement(props.row)"
            />
            <q-btn
              outlined
              label="Liquidate"
              class="allocate-btn"
              @click="store.openOrDetailsDialog(props.row)"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script setup>
import { useDisbursementStore } from '../../stores/disbursement'

const store = useDisbursementStore()

// Access state
console.log(store.disbursements)

// Use getters
console.log(store.filteredDisbursements)
</script>
