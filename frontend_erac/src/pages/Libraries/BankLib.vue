<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-weight-bold">Bank Library</div>
    </div>

    <div class="q-mb-md">
      <div class="row items-center justify-between q-gutter-sm">
        <q-input
          outlined
          dense
          placeholder="Search banks..."
          class="col-md-3 col-sm-5 custom-search-input"
          style="min-width: 450px"
          v-model="searchTerm"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn label="Add" icon="add" class="add-table-btn" @click="showAddDialog = true" />
      </div>
    </div>

    <q-card>
      <q-table
        :rows="filteredBanks"
        :columns="bankStore.columns"
        row-key="id"
        flat
        bordered
        @row-click="showChequeDetails"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.status === 'Available' ? 'green' : 'orange'"
              :label="props.row.status === 'Available' ? 'Available' : 'Consumed'"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn
              v-if="props.row.status === 'Available'"
              icon="attach_file"
              dense
              round
              color="blue"
              @click="markAsConsumed(props.row.id)"
              title="Mark as Consumed"
            />
            <q-btn icon="delete" dense round color="red" @click="confirmDelete(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Add Bank Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Bank</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newBankName"
            label="Bank Name"
            outlined
            :rules="[(val) => !!val || 'Required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="Save" class="modal-save-btn" @click="addBank" :disable="!newBankName" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Cheque Details Dialog -->
    <q-dialog v-model="showChequeDialog">
      <q-card style="min-width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Cheque Details - {{ selectedBank?.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-table
            :rows="selectedBank?.cheques || []"
            :columns="bankStore.chequeColumns"
            row-key="chequeNo"
            flat
            bordered
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useBankStore } from 'src/stores/bankStore'
import { ref, computed } from 'vue'

const bankStore = useBankStore()
const searchTerm = ref('')
const showAddDialog = ref(false)
const newBankName = ref('')
const showChequeDialog = ref(false)
const selectedBank = ref(null)

const filteredBanks = computed(() => {
  return bankStore.banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  )
})

const addBank = () => {
  bankStore.addBank(newBankName.value)
  showAddDialog.value = false
  newBankName.value = ''
}

const markAsConsumed = (id) => {
  bankStore.consumeBank(id)
}

const showChequeDetails = (evt, row) => {
  selectedBank.value = row
  showChequeDialog.value = true
}
</script>

<style></style>
