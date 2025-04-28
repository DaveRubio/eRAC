<template>
  <q-card flat class="q-pa-md">
    <canvas ref="chartCanvas"></canvas>
  </q-card>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

export default defineComponent({
  props: {
    chartData: Object,
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
      chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: props.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      })
    }

    watch(() => props.chartData, createChart, { deep: true })
    onMounted(createChart)

    return { chartCanvas }
  },
})
</script>
