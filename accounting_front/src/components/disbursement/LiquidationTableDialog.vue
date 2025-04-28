<template>
  <q-dialog v-model="store.dialogs.liquidationTable" persistent>
    <q-card style="min-width: 1200px">
      <q-card-section>
        <div class="text-h6">Liquidation Details</div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="store.liquidationData"
          :columns="store.liquidationColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 5 }"
          @row-click="(evt, row) => store.openOrDetailsDialog(row)"
        >
          <!-- OR Image Column Slot -->
          <template v-slot:body-cell-orImage="props">
            <q-td :props="props">
              <q-img
                v-if="props.row.orImage"
                :src="props.row.orImage"
                style="max-width: 50px; max-height: 30px"
              />
              <span v-else>-</span>
            </q-td>
          </template>

          <!-- Liquidated Column Slot -->
          <template v-slot:body-cell-liquidated="props">
            <q-td :props="props">
              {{ props.row.liquidated || 'No' }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="negative" @click="store.closeDialog('liquidationTable')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDisbursementStore } from '../../stores/disbursement'
const store = useDisbursementStore()
</script>
