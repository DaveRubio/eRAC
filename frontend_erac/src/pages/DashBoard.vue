<template>
  <q-page class="q-pa-lg">
    <!-- Header Section -->
    <div class="page-header q-mb-lg">
      <template v-if="authStore.isLoading">
        <q-skeleton type="text" width="200px" />
      </template>
      <!-- Loaded State -->
      <div class="text-h5 text-weight-bold">
        <!-- Use barangay_name instead of barangay.name -->
        Barangay {{ authStore.user?.barangay_name || 'Dashboard' }}
      </div>
      <div class="text-caption text-grey">
        Welcome back, {{ authStore.user?.first_name || 'User' }}!
      </div>
    </div>
    <q-card-section>
      <div class="text-subtitle1 text-weight-medium q-mb-sm"></div>
      <div class="row items-center q-gutter-md">
        <q-input
          outlined
          dense
          v-model="dateRange.from"
          :display-value="formatDate(dateRange.from)"
          label="From"
          class="custom-rounded-input"
          @click="showFromDatePicker = true"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="dateRange.from"
                  mask="YYYY/MM/DD"
                  @update:model-value="showFromDatePicker = false"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          outlined
          dense
          v-model="dateRange.to"
          :display-value="formatDate(dateRange.to)"
          label="To"
          class="custom-rounded-input"
          @click="showToDatePicker = true"
        >
          >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="dateRange.to"
                  mask="YYYY/MM/DD"
                  :options="toDateOptions"
                  @update:model-value="showToDatePicker = false"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </q-card-section>

    <div class="row q-col-gutter-lg q-mb-lg">
      <div
        class="col-xl-3 col-lg-4 col-md-6 col-sm-12"
        v-for="(card, index) in summaryCards"
        :key="index"
      >
        <q-card class="summary-card" :class="`card-${index}`">
          <q-card-section class="row items-center justify-center q-pa-md" style="height: 100%">
            <div class="row items-center" style="max-width: 90%">
              <q-avatar
                :icon="card.icon"
                size="45px"
                :color="card.color || 'primary'"
                text-color="white"
                class="q-mr-md"
              />
              <div class="text-left">
                <div class="text-caption text-grey">{{ card.label }}</div>
                <div class="text-h5 text-weight-bold">{{ card.value }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-lg-6 col-md-12">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 text-weight-medium">Commitment Distribution</div>
            <div class="text-caption text-grey-6">Current year</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <DoughnutChart :chart-data="doughnutChartData" :options="mergedChartOptions" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-lg-6 col-md-12">
        <q-card class="chart-card">
          <q-card-section>
            <div class="text-h6 text-weight-medium">Recent Liquidated Disbursements</div>
            <div class="text-caption text-grey-6">Current year</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-table
              :rows="recentDisbursementRows"
              :columns="recentDisbursementColumns"
              row-key="id"
              flat
              bordered
              :pagination="{ rowsPerPage: 4 }"
              class="disbursement-table"
            >
              <!-- Highlight fully liquidated rows -->
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useChartDataStore } from 'src/stores/chartDataStore'
import { storeToRefs } from 'pinia'
import DoughnutChart from 'components/DoughnutChart.vue'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()
// 1. Date Pickers UI State
const showFromDatePicker = ref(false)
const showToDatePicker = ref(false)

// 2. Store Connection
const chartStore = useChartDataStore()
const { doughnutChartData, summaryCards, recentDisbursementRows, recentDisbursementColumns } =
  storeToRefs(chartStore)

// 3. Date Handling
const dateRange = ref({
  from: chartStore.dateFrom,
  to: chartStore.dateTo,
})

const formatDateShort = (dateString) => {
  if (!dateString) return '' // Handle empty input
  const d = new Date(dateString)
  return [
    (d.getMonth() + 1).toString().padStart(2, '0'), // MM (2 digits)
    d.getDate().toString().padStart(2, '0'), // DD (2 digits)
    d.getFullYear(), // YYYY (4 digits)
  ].join('/') // Joins as "MM/DD/YYYY"
}

// Alias for QDate compatibility
const formatDate = formatDateShort

// 5. Chart Options (unchanged)
const mergedChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: {
      backgroundColor: '#1e1e1e',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 12 },
    },
  },
}))

// 6. Watch date changes
watch(
  dateRange,
  (newRange) => {
    chartStore.dateFrom = newRange.from
    chartStore.dateTo = newRange.to
  },
  { deep: true },
)
</script>
<style lang="scss" scoped>
.dashboard-header {
  .text-h5 {
    color: #2e7d32;
  }
}

.filter-card {
  border-radius: 1px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.summary-card {
  min-height: 120px !important; /* Override any defaults */
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(88, 178, 101, 0.321);
  }

  &.card-0 {
    border-top: 4px solid rgba(88, 178, 101, 1);
  }
  &.card-1 {
    border-top: 4px solid rgba(88, 178, 101, 1);
  }
  &.card-2 {
    border-top: 4px solid rgba(88, 178, 101, 1);
  }
}

.chart-card {
  border-radius: 12px;
  height: 100%;

  .q-card__section {
    &:first-child {
      padding-bottom: 7px;
    }
    &:last-child {
      height: 350px;
      padding-top: 1;
    }
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-xs-max) {
  .summary-card {
    margin-bottom: 16px;
  }
}

.custom-rounded-input :deep(.q-field__control) {
  border-radius: 10px;
  width: 250px;
}
</style>
