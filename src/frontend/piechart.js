function renderPieChart() {
    const ctx = document.getElementById("pieChart").getContext("2d");
    
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Azioni", "Obbligazioni", "Immobili", "Crypto"],
            datasets: [{
                data: [40, 30, 20, 10], // Valori percentuali
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}