<!-- src/components/LiquidationDialog.vue -->
<template>
  <q-dialog v-model="store.dialogs.liquidate" persistent>
    <q-card style="min-width: 1200px">
      <q-card-section>
        <div class="text-h6">Liquidation Details</div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="store.liquidationData.items"
          :columns="store.liquidationColumns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 5 }"
        >
          <!-- OR Image Column Slot -->
          <template v-slot:body-cell-orImage="props">
            <q-td :props="props">
              <q-uploader
                v-if="!props.row.orImage"
                flat
                dense
                bordered
                style="max-width: 150px"
                accept=".jpg,.png,.pdf"
                @added="(files) => store.uploadOrImage(props.row, files[0])"
              />
              <q-img
                v-else
                :src="props.row.orImage"
                style="max-width: 100px; max-height: 50px"
                @click="showImagePreview(props.row.orImage)"
              />
            </q-td>
          </template>

          <!-- Liquidated Column Slot -->
          <template v-slot:body-cell-liquidated="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.liquidated"
                @update:model-value="store.toggleLiquidation(props.row)"
              />
            </q-td>
          </template>

          <!-- Actions Column Slot -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense icon="edit" @click="editItem(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="store.closeDialog('liquidate')" />
        <q-btn label="Save" color="primary" @click="store.saveLiquidation" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDisbursementStore } from '../stores/disbursementStore'

const store = useDisbursementStore()

const showImagePreview = (imageUrl) => {
  // Implement image preview dialog if needed
  console.log('Show image:', imageUrl)
}

const editItem = (item) => {
  // Implement edit functionality
  console.log('Edit item:', item)
}
</script>

<style scoped>
.q-uploader {
  max-height: 40px;
}
</style>
