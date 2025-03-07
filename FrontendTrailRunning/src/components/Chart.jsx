import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registramos los elementos que necesitamos para usar el gráfico
ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin personalizado para mostrar el total en el centro
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: function(chart) {
    if (chart.config.options.plugins.centerText) {
      // Get ctx from chart
      const ctx = chart.ctx;
      
      // Get options from the center object in options
      const centerConfig = chart.config.options.plugins.centerText;
      const txt = centerConfig.text;
      
      if (txt) {
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        const fontStyle = centerConfig.fontStyle || 'Arial';
        const fontSize = centerConfig.fontSize || Math.min(chart.width, chart.height) * 0.1;
        
        ctx.save();
        ctx.font = fontSize + 'px ' + fontStyle;
        ctx.fillStyle = centerConfig.color || '#1a1204'; // Color del texto del tema
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, centerX, centerY);
        ctx.restore();
      }
    }
  }
};

// Registrar el plugin
ChartJS.register(centerTextPlugin);

const Chart = ({ allKm, races }) => {
  // Colores del tema
  const themeColors = [
    '#9B9D79', // --color-primary
    '#B4C7B2', // --color-secondary
    '#8EAC93', // --color-accent
    '#9B9D79',
    '#B4C7B2',
    '#8EAC93',
    // Variaciones de los colores principales para tener más opciones
    '#8A8C68', // Variación más oscura de primary
    '#A3B6A1', // Variación más oscura de secondary
    '#7D9B82'  // Variación más oscura de accent
  ];
  
  // Preparamos los datos para la gráfica
  const chartData = {
    labels: races.map((race) => `${race.name}, ${race.distance} Km`), // Etiquetas con los nombres y distancias
    datasets: [
      {
        label: 'Kilómetros por carrera',
        data: races.map((race) => race.distance), // Datos de los kilómetros de cada carrera
        backgroundColor: races.map((_, index) => themeColors[index % themeColors.length]), // Usar colores del tema
        borderWidth: 1,
        borderColor: '#fdf7ed', // --color-background como color de borde
      },
    ],
  };
  
  // Opciones para la gráfica
  const chartOptions = {
    responsive: true, // Asegura que el gráfico sea responsivo
    maintainAspectRatio: false, // Permite que la gráfica cambie de tamaño según el contenedor
    plugins: {
      legend: {
        labels: {
          color: '#1a1204', // --color-text para las etiquetas
          font: {
            family: 'Arial',
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} km`; // Personalizar la visualización del tooltip
          },
        },
        backgroundColor: '#fdf7ed', // --color-background
        titleColor: '#1a1204', // --color-text
        bodyColor: '#1a1204', // --color-text
        borderColor: '#9B9D79', // --color-primary
        borderWidth: 1
      },
      // Configuración para el texto central
      centerText: {
        text: allKm ? `${allKm} km` : '',
        fontSize: 18,
        color: '#1a1204' // --color-text
      }
    },
  };

  return (
    <div className="chart-container w-64 h-64 my-5">
      <h3 className="text-center text-[#1a1204]">Kilómetros por Carrera</h3>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

export default Chart;