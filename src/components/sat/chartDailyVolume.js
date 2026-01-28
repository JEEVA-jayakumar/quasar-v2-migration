// merchant-bar-chart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { defineComponent, h } from "vue";
import { Bar } from "vue-chartjs";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: "MerchantBarChart",
  props: {
    merchantTrackerData: {
      type: Object,
      required: false, // optional if you want default data
      default: () => ({
        xAxis: { categories: [
          "January","February","March","April","May","June",
          "July","August","September","October","November","December"
        ] },
        series: [
          {
            label: false,
            backgroundColor: "rgb(156, 156, 156)",
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
          }
        ],
        yAxis: { title: { text: "Values" } }
      })
    }
  },
  setup(props) {
    const chartData = {
      labels: props.merchantTrackerData.xAxis.categories,
      datasets: props.merchantTrackerData.series
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: !!props.merchantTrackerData.yAxis?.title?.text,
            text: props.merchantTrackerData.yAxis?.title?.text || ""
          }
        }
      }
    };

    return () => h(Bar, { chartData, chartOptions });
  }
});
