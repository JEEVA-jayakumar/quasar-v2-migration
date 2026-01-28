// SATAgingBarChart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { defineComponent, h, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { Bar } from "vue-chartjs";
import { useQuasar } from "quasar";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: "SATAgingBarChart",
  setup() {
    const chartData = ref({ labels: [], datasets: [] });
    const chartOptions = ref({
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "" }
        }
      }
    });

    const store = useStore();
    const $q = useQuasar();

    const loadAgingGraphData = async () => {
      try {
        $q.loading.show({
          delay: 0,
          spinnerColor: "purple-9",
          message: "Fetching data .."
        });

        await store.dispatch("SAT_Dashboard/FETCH_DASHBOARD_AGING_CHART_DATA", {
          region: JSON.parse(localStorage.getItem("u_i")).region.id
        });

        const data = store.getters["SAT_Dashboard/getSatDashboardAgingGraphData"];

        chartData.value = {
          labels: data.xAxis.categories,
          datasets: data.series
        };

        chartOptions.value = {
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
        };
      } catch (error) {

        console.error(error);
      } finally {
        $q.loading.hide();
      }
    };

    onMounted(() => {
      loadAgingGraphData();
    });

    return () => h(Bar, { chartData: chartData.value, chartOptions: chartOptions.value });
  }
});
