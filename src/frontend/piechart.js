async function renderPieChart() {
    try {
        const response = await fetch("/assets/client_0.json"); // Assicurati che il percorso sia corretto
        const data = await response.json();

        const netWorth = data.client.NetWorth;

        // Estrai etichette e valori dal JSON
        const labels = Object.keys(netWorth);
        const values = Object.values(netWorth);

        const ctx = document.getElementById("pieChart").getContext("2d");

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: values, // Dati dinamici dal JSON
                    backgroundColor: ["#CD482B", "#EB6955", "#B43C1E", "#822814"] // Aggiungere più colori se necessario
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: "white", // Imposta il colore del testo delle etichette a bianco
                            usePointStyle: true,
                            boxWidth: 10,
                            fullSize: true,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                const dataset = tooltipItem.dataset;
                                const total = dataset.data.reduce((acc, value) => acc + value, 0);
                                const currentValue = dataset.data[tooltipItem.dataIndex];
                                const percentage = ((currentValue / total) * 100).toFixed(2);
                                return `${tooltipItem.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Errore nel caricamento del JSON:", error);
    }
}