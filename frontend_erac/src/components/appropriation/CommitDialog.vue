<!-- component.vue -->
<template>
  <q-dialog v-model="appropriationStore.showAllocationDialog" persistent>
    <q-card class="allocation-card" style="min-width: 800px">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Allocate Amounts</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-mb-md">
          <div class="col-md-6 col-12 q-mb-sm">
            <strong>Total:</strong>
            {{ appropriationStore.formatCurrency(appropriationStore.selectedRow?.total || 0) }}
          </div>
          <div class="col-md-6 col-12">
            <strong>Total Unappropriated:</strong>
            {{ appropriationStore.formatCurrency(appropriationStore.remainingUnappropriated || 0) }}
          </div>
        </div>

        <q-input
          outlined
          dense
          placeholder="Search accounts..."
          class="q-mb-md"
          v-model="appropriationStore.searchQuery"
          style="max-width: 500px"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          flat
          bordered
          :rows="appropriationStore.filteredAccounts"
          :columns="accountColumns"
          row-key="id"
          hide-pagination
          class="allocation-table"
          :loading="!appropriationStore.accounts.length"
        >
          <template v-slot:body="props">
            <q-tr :props="props" :class="{ 'bg-grey-2': props.row.isMainCategory }">
              <q-td :style="props.row.indentStyle">
                <span :class="{ 'text-weight-bold': props.row.isMainCategory }">
                  {{ props.row.displayName }}
                </span>
              </q-td>
              <q-td class="text-right">
                <template v-if="props.row.isMainCategory">
                  <div class="text-weight-bold">
                    {{ appropriationStore.formatCurrency(getMainCategoryTotal(props.row.id)) }}
                  </div>
                </template>
                <template v-else>
                  <q-input
                    dense
                    outlined
                    v-model="props.row.amount"
                    prefix="₱"
                    mask="#,##0.00"
                    fill-mask="0"
                    reverse-fill-mask
                    :rules="[(val) => validateAmount(val) || 'Invalid amount']"
                    @update:model-value="updateUnappropriated"
                    class="text-right"
                  />
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row items-center q-mt-md">
          <div class="col-auto">
            <q-select
              outlined
              dense
              :options="[5, 10, 20, 50]"
              v-model="appropriationStore.recordsPerPage"
              label="Records per page"
              style="width: 150px"
            />
          </div>
          <div class="col q-ml-sm">
            {{ paginationRange }}
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn
          label="Save"
          color="primary"
          @click="appropriationStore.saveAllocation"
          :disable="appropriationStore.remainingUnappropriated < 0"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useAppropriationStore } from '../../stores/appropriationStore'
import { computed } from 'vue'

const appropriationStore = useAppropriationStore()

// Account columns definition
const accountColumns = [
  {
    name: 'name',
    label: 'Accounts',
    field: 'displayName',
    align: 'left',
    sortable: false,
  },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'right',
  },
]

// Calculate main category totals
const getMainCategoryTotal = (categoryId) => {
  // Find the category in the flattened structure
  const findAllChildrenIds = (categoryId) => {
    const result = []
    const category = appropriationStore.flattenedAccounts.find((acc) => acc.id === categoryId)

    if (!category) return result

    // Find all children with higher indent levels until we hit another main category
    const categoryIndex = appropriationStore.flattenedAccounts.findIndex(
      (acc) => acc.id === categoryId,
    )
    let currentIndex = categoryIndex + 1

    while (
      currentIndex < appropriationStore.flattenedAccounts.length &&
      appropriationStore.flattenedAccounts[currentIndex].indent > category.indent
    ) {
      result.push(appropriationStore.flattenedAccounts[currentIndex].id)
      currentIndex++
    }

    return result
  }

  // Get all children IDs for this category
  const childrenIds = findAllChildrenIds(categoryId)

  // Sum up all the amounts
  return appropriationStore.flattenedAccounts
    .filter((acc) => childrenIds.includes(acc.id))
    .reduce((sum, child) => {
      const amount = parseFloat(String(child.amount || '0').replace(/,/g, '')) || 0
      return sum + amount
    }, 0)
}

// Validate amount input
const validateAmount = (val) => {
  if (!val) return true
  const num = parseFloat(String(val).replace(/,/g, ''))
  return !isNaN(num) && num >= 0
}

// Update unappropriated amount
const updateUnappropriated = () => {
  if (appropriationStore.selectedRow) {
    appropriationStore.calculateTotals()
  }
}

// Pagination display text
const paginationRange = computed(() => {
  const pageSize = appropriationStore.recordsPerPage || 10
  const total = appropriationStore.filteredAccounts.length || 0
  const end = Math.min(pageSize, total)
  return total > 0 ? `1-${end} of ${total}` : '0 records'
})
</script>

<style scoped>
.allocation-card {
  min-width: 300px;
  max-width: 1000px;
  width: 90vw;
}

.allocation-table {
  width: 100%;
  overflow-x: auto;
}

@media (max-width: 600px) {
  .allocation-card {
    width: 95vw;
  }

  .q-table {
    font-size: 0.9rem;
  }

  .q-input {
    font-size: 0.9rem;
  }
}
</style>
