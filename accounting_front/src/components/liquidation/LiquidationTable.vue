<!-- components/liquidation/LiquidationTable.vue -->
<template>
  <div>
    <!-- Liquidation Table Dialog -->
    <q-dialog v-model="liquidationStore.dialogs.liquidationTable" persistent>
      <q-card style="min-width: 1200px">
        <q-card-section>
          <div class="text-h6">Liquidation Details</div>
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="liquidationStore.liquidationData"
            :columns="liquidationStore.liquidationColumns"
            row-key="id"
            flat
            bordered
            :pagination="{ rowsPerPage: rowsPerPage }"
            @row-click="(evt, row) => liquidationStore.openOrDetailsDialog(row)"
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

        <q-card-section class="text-right">
          Records per page: 
          <q-select
            v-model="rowsPerPage"
            :options="[5, 10, 20]"
            dense
            options-dense
            style="min-width: 60px; display: inline-block"
          />
          <span class="q-ml-md">
            {{ pagination.firstItem }}-{{ pagination.lastItem }} of {{ liquidationStore.liquidationData.length }}
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="CLOSE"
            color="negative"
            @click="liquidationStore.closeDialog('liquidationTable')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- OR Details Dialog -->
    <q-dialog v-model="liquidationStore.dialogs.orDetails" persistent>
      <q-card style="min-width: 800px">
        <q-card-section class="bg-grey-2">
          <div class="text-h6">{{ liquidationStore.selectedRow?.dvNumber || 'DV Details' }}</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Date -->
            <div class="col-12 col-md-6">
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.date" 
                label="Date:"
                mask="##/##/####"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="liquidationStore.orDetailsForm.date" mask="DD/MM/YYYY" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            
            <!-- Empty Space -->
            <div class="col-12 col-md-6"></div>

            <!-- DV Amount -->
            <div class="col-12 col-md-6">
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.dvAmount" 
                label="DV Amount:"
                readonly
                prefix="₱"
                type="number"
              />
            </div>

            <!-- Actual Expense -->
            <div class="col-12 col-md-6">
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.actualExpense" 
                label="Actual Expense:"
                readonly
                prefix="₱"
                type="number"
              />
            </div>

            <!-- Amount to Return -->
            <div class="col-12 col-md-6">
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.amountToReturn" 
                label="Amount to Return to Appropriation:"
                readonly
                prefix="₱"
                type="number"
              />
            </div>

            <!-- Remarks -->
            <div class="col-12 col-md-6">
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.remarks" 
                label="Remarks:"
                type="text"
              />
            </div>

            <!-- OR Image -->
            <div class="col-12 col-md-6">
              <p class="q-mb-sm">OR Image:</p>
              <div 
                class="upload-area q-pa-md" 
                style="border: 1px solid #ddd; border-radius: 4px; height: 200px; position: relative;"
              >
                <q-img 
                  v-if="liquidationStore.orDetailsForm.orImage" 
                  :src="liquidationStore.orDetailsForm.orImage" 
                  style="max-height: 180px; max-width: 100%;"
                />
                <q-btn 
                  v-else 
                  class="upload-btn" 
                  color="primary" 
                  label="Upload Image" 
                  style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                >
                  <q-uploader
                    @added="(files) => liquidationStore.handleImageUpload(files[0])"
                    auto-upload
                    hide
                  />
                </q-btn>
              </div>
            </div>

            <!-- OR Number and Amount -->
            <div class="col-12 col-md-6">
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.orNumber" 
                label="OR Number:"
                type="text"
                :disable="!liquidationStore.orDetailsForm.orImage"
                class="q-mb-md"
              />
              <q-input 
                filled 
                v-model="liquidationStore.orDetailsForm.orAmount" 
                label="OR Amount:"
                type="number"
                prefix="₱"
                :disable="!liquidationStore.orDetailsForm.orImage"
                @update:model-value="liquidationStore.updateOrAmount($event)"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            label="Submit" 
            color="primary" 
            @click="liquidationStore.submitOrDetails" 
            :disable="!liquidationStore.orDetailsForm.orImage || !liquidationStore.orDetailsForm.orNumber || !liquidationStore.orDetailsForm.orAmount"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
  
<script setup>
import { useDisbursementStore } from '../../stores/disbursementStore'
import { useLiquidationStore } from '../../stores/LiquidationStore'
import { onMounted, ref, computed } from 'vue'

const disbursementStore = useDisbursementStore()
const liquidationStore = useLiquidationStore()
const rowsPerPage = ref(5)

// Compute pagination for display
const pagination = computed(() => {
  const page = 1
  const firstItem = (page - 1) * rowsPerPage.value + 1
  const lastItem = Math.min(page * rowsPerPage.value, liquidationStore.liquidationData.length)
  
  return {
    firstItem: liquidationStore.liquidationData.length ? firstItem : 0,
    lastItem: liquidationStore.liquidationData.length ? lastItem : 0
  }
})

// Initialize data when component mounts
onMounted(() => {
  // If your disbursement store already has the data, load it into the liquidation store
  if (disbursementStore.disbursements?.length) {
    liquidationStore.loadLiquidationData(disbursementStore.disbursements)
  }
  // Otherwise you might need to fetch it first
})
</script>

<style scoped>
.upload-btn {
  position: relative;
  overflow: hidden;
}

.upload-btn :deep(input) {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  filter: alpha(opacity=0);
}
</style>