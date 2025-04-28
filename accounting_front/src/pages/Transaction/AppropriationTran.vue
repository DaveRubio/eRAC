<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-weight-bold">Appropriation Transaction</div>
    </div>

    <!-- Search and Date Filter -->
    <div class="q-mb-md">
      <div class="row items-center justify-between q-gutter-sm">
        <!-- Search Input -->
        <q-input
          outlined
          dense
          placeholder="Search..."
          class="col-md-3 col-sm-5 custom-search-input"
          style="min-width: 450px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="t q-px-xl"></div>

        <!-- Date Range Group -->
        <div class="row items-center justify-between">
          <!-- From Date -->
          <q-input
            outlined
            label="From"
            dense
            v-model="dateFrom"
            mask="##/##/####"
            class="custom-date-from"
            style="width: 220px"
          >
            <template v-slot:append>
              <q-icon name="event" class="calend-icon">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateFrom" mask="DD/MM/YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <!-- To Label -->
          <div class="t q-px-xs"></div>
          <div class="t q-px-xs"></div>

          <!-- To Date -->

          <q-input
            outlined
            label="To"
            dense
            v-model="dateTo"
            mask="##/##/####"
            class="custom-date-to"
            style="width: 220px"
          >
            <template v-slot:append>
              <q-icon name="event" class="calend-icon">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="dateTo" mask="DD/MM/YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- Add Button -->
        <q-btn label="Add" icon="add" class="add-table-btn" @click="addAppropriation" />
      </div>

      <q-dialog v-model="showDialog">
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Add</div>
          </q-card-section>
          <div><br /></div>
          <q-card-section class="q-pt-none">
            <div class="q-mb-md">
              <strong>Date:</strong><br />
              <q-input filled v-model="date" mask="date" :rules="['date']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="date" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="q-mb-md">
              <strong>Description:</strong><br />
              <q-input filled v-model="description" placeholder="Budget for 2025" />
            </div>

            <div class="q-mb-md">
              <strong>Amount:</strong><br />
              <q-input
                filled
                v-model="amount"
                prefix="₱"
                type="number"
                placeholder="125,000,000.00"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right" class="custom-actions">
            <q-btn flat label="Cancel" v-close-popup class="modal-cancel-btn" />
            <q-btn label="Save" class="modal-save-btn" @click="saveAppropriation" />
          </q-card-actions>
          <div><br /></div>
        </q-card>
      </q-dialog>
    </div>

    <!-- Data Table -->
    <q-card>
      <q-table :rows="appropriation" :columns="columns" row-key="id" :pagination="pagination">
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="button-group">
              <q-btn class="edit-btn" icon="edit" @click="editAllocate(props.row)" />
              <q-btn
                class="allocate-btn"
                label="Commit"
                @click="openAllocationDialog"
                :disable="!canAllocate"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <CommitDialog />
    <!-- Allocation Dialog -->
    <!-- <q-dialog v-model="showAllocationDialog">
      <q-card style="min-width: 1000px">
        <q-card-section>
          <div class="text-h6">Allocate Amounts</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-6"><strong>Total:</strong> {{ formatCurrency(selectedRow.total) }}</div>
            <div class="col-6">
              <strong>Total Unappropriated:</strong>
              {{ formatCurrency(selectedRow.unappropriated) }}
            </div>
          </div>

          <q-input
            outlined
            dense
            placeholder="Search accounts..."
            class="q-mb-md"
            v-model="searchQuery"
            style="width: 500px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-table
            flat
            bordered
            :rows="filteredAccounts"
            :columns="accountColumns"
            hide-pagination
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-amount="props">
              <q-td :props="props">
                <q-input
                  dense
                  outlined
                  v-model="props.row.amount"
                  prefix="₱"
                  mask="###,###,###.##"
                  fill-mask="0"
                  reverse-fill-mask
                />
              </q-td>
            </template>
          </q-table>

          <div class="row items-center q-mt-md">
            <div class="col">
              <q-select
                outlined
                dense
                :options="[5, 10, 20, 50]"
                v-model="recordsPerPage"
                label="Records per page"
                style="width: 150px"
              />
              <span class="q-ml-sm"
                >1-{{ Math.min(5, filteredAccounts.length) }} of {{ filteredAccounts.length }}</span
              >
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="custom-actions">
          <q-btn flat label="Cancel" v-close-popup class="modal-cancel-btn" />
          <q-btn label="Save" class="modal-save-btn" @click="saveAllocation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    -->
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import CommitDialog from '../../components/appropriation/CommitDialog.vue'
import { useAppropriationStore } from '../../stores/appropriationStore'
import { computed } from 'vue'
const showDialog = ref(false)
const date = ref('2025/01/22')
const description = ref('Budget for 2025')
const amount = ref(125000000.0)
const dateFrom = ref('')
const dateTo = ref('')

const appropriationStore = useAppropriationStore()
const saveAppropriation = () => {
  // Handle save logic here
  console.log('Saved:', {
    date: date.value,
    description: description.value,
    amount: amount.value,
  })
  showDialog.value = false
}

const currentAppropriation = {
  total: 125000000,
  unappropriated: 120000000,
  id: 'appropriation-123', // example ID
}

const openAllocationDialog = () => {
  appropriationStore.openAllocationDialog(currentAppropriation)
}

const canAllocate = computed(() => {
  return currentAppropriation.unappropriated > 0
})

const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'id',
  },
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: 'date',
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    field: 'description',
  },
  {
    name: 'amount',
    label: 'Amount',
    align: 'right',
    field: 'amount',
  },
  {
    name: 'unappropriated',
    label: 'Unappropriated',
    align: 'right',
    field: 'unappropriated',
  },
  {
    name: 'action',
    label: 'Action',
    align: 'center',
    field: 'action',
  },
]

const appropriation = ref([
  {
    id: 1,
    date: '1/22/25',
    description: 'Budget for 2025',
    amount: '125,000,000.00',
    unappropriated: '120,000,000.00',
  },
  {
    id: 2,
    date: '1/22/26',
    description: 'Budget for 2026',
    amount: '125,000,000.00',
    unappropriated: '0.00',
  },
])

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

// const allocate = (row) => {
//console.log('Allocating:', row)
// Add your allocation logic here
//}

const addAppropriation = () => {
  showDialog.value = true
}
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.custom-actions {
  margin-right: 10px;
}
.custom-actions .q-btn:not(:last-child) {
  margin-right: 5px; /* Adjust this value as needed */
}

/* Using the deep selector (Vue 3 syntax) */
.q-mb-md :deep(.q-input .q-field__control) {
  border-radius: 8px;
}
</style>
