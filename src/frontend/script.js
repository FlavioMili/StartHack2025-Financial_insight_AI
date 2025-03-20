document.addEventListener("DOMContentLoaded", function () {
    const viewSelector = document.getElementById("viewSelector");
    const chart = document.getElementById("dynamicChart");
    const table = document.getElementById("dynamicTable");
    const text = document.getElementById("dynamicText");

    viewSelector.addEventListener("change", function () {
        chart.style.display = "none";
        table.style.display = "none";
        text.style.display = "none";

        if (this.value === "grafico") {
            chart.style.display = "block";
            renderChart(); // Funzione per disegnare il grafico
        } else if (this.value === "tabella") {
            table.style.display = "block";
        } else if (this.value === "testo") {
            text.style.display = "block";
        }
    });

    function renderChart() {
        const ctx = document.getElementById("dynamicChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Gen", "Feb", "Mar", "Apr", "Mag"],
                datasets: [{
                    label: "Andamento",
                    data: [500, 600, 550, 700, 750],
                    borderColor: "#00bcd4",
                    backgroundColor: "rgba(0, 188, 212, 0.2)"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});