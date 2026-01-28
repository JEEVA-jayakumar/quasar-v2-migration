// MerchantAgingBarChart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { defineComponent, h, watch } from "vue";
import { Bar } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: "MerchantAgingBarChart",
  props: {
    merchantTrackerData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // Function to build chart data and options
    const getChartConfig = (data) => {
      return {
        chartData: {
          labels: data.xAxis.categories,
          datasets: data.series
        },
        chartOptions: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: !!data.yAxis?.title?.text,
                text: data.yAxis?.title?.text || ""
              }
            }
          }
        }
      };
    };

    let { chartData, chartOptions } = getChartConfig(props.merchantTrackerData);

    // Watch for prop changes to update chart dynamically
    watch(
      () => props.merchantTrackerData,
      (newData) => {
        const config = getChartConfig(newData);
        chartData = config.chartData;
        chartOptions = config.chartOptions;
      },
      { deep: true }
    );

    return () => h(Bar, { chartData, chartOptions });
  }
});
