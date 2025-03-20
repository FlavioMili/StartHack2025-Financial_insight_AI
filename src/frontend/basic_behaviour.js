document.addEventListener("DOMContentLoaded", function () { //VIEW SELECTOR LOGIC 
    const buttons = document.querySelectorAll(".view-btn");
    if (buttons.length === 0) {
        console.error("Nessun elemento .view-btn trovato nel DOM.");
    }

    const text1 = document.getElementById("text1");
    const text2 = document.getElementById("text2");

    text2.style.display = "block"; // Mostra la Vista 1 di default

        renderPieChart(); // Disegna il grafico quando si seleziona la Vista 2
    

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            text1.style.display = "none";
            text2.style.display = "none";

            if (this.dataset.view === "text1") {
                text1.style.display = "block";
            } else if (this.dataset.view === "text2") {
                text2.style.display = "block";
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () { //PIE CHART 
    const buttons = document.querySelectorAll(".view-btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            const selectedView = this.getAttribute("data-view");
            document.getElementById("text1").style.display = selectedView === "text1" ? "block" : "none";
            document.getElementById("text2").style.display = selectedView === "text2" ? "block" : "none";

            if (selectedView === "text2") {
                renderPieChart(); // Disegna il grafico quando si seleziona la Vista 2
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/assets/client_0.json");
        const data = await response.json();
        const client = data.client;

        // Mostra il nome dell'utente
        document.getElementById("client-name").innerText = client.Name + ", ";

        // Mostra il profilo con lo stile badge
        const profileDetails = document.getElementById("profile-details");
        for (const [profileType, profileValue] of Object.entries(client.Profile)) {
            let badge = document.createElement("p");
            badge.className = "profile-badge";
            badge.innerText = `${profileValue}`;
            profileDetails.appendChild(badge);
        }

        // Informazioni fiscali
        const taxInfo = document.getElementById("tax-info");
        for (const [taxType, taxValue] of Object.entries(client.Taxes)) {
            let taxElement = document.createElement("p");
            taxElement.innerHTML = `<strong class="enphasis">${taxType.replace(/_/g, " ")}:</strong> ${taxValue > 0 ? taxValue+"%" : "n.a."}`;
            taxInfo.appendChild(taxElement);
        }

        // Stato e bandiera
        const countryInfo = document.getElementById("country-info");
        
        const countryFlags = {
            "Switzerland": "🇨🇭",
            "Italy": "🇮🇹",
            "Germany": "🇩🇪",
            "France": "🇫🇷",
            "USA": "🇺🇸"
        };

        const countryAbbr = {
            "Switzerland": "CH",
            "Italy": "ITA",
            "Germany": "DEU",
            "France": "FRA",
            "USA": "USA"
        };

        let countryText = document.createElement("p");
        let country = client.TaxZone;
        countryText.innerText = `${countryAbbr[country] || "n.a."} ${countryFlags[country] || ""}`;
        countryInfo.appendChild(countryText);

    } catch (error) {
        console.error("Errore nel caricamento del JSON:", error);
    }
});

