const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;
const jsonFilePath = path.join(__dirname, 'assets', 'llm_response_example.json');

let cachedData = {}; // Memorizza i dati JSON per evitare letture ripetute

// Funzione per caricare i dati JSON
function loadJsonData() {
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Errore nella lettura del file JSON:", err);
      return;
    }
    try {
      cachedData = JSON.parse(data);
      console.log("JSON ricaricato:", cachedData);
    } catch (parseError) {
      console.error("Errore nel parsing del JSON:", parseError);
    }
  });
}

// Carica i dati iniziali
loadJsonData();

// Monitora il file per modifiche e aggiorna la cache
fs.watch(jsonFilePath, (eventType) => {
  if (eventType === 'change') {
    console.log("Rilevata modifica nel JSON, aggiornamento...");
    loadJsonData();
  }
});

// Serve la cartella "src/frontend" come root per HTML, CSS e JS
app.use(express.static(path.join(__dirname, 'src/frontend')));

// Serve la cartella "assets" per i JSON
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware per abilitare il parsing dei JSON nelle richieste POST
app.use(express.json());

// Serve "main.html" come homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/frontend/main.html'));
});

// Endpoint per ottenere il JSON aggiornato
app.get('/data', (req, res) => {
  res.json(cachedData);
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});