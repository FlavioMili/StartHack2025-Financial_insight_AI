const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve la cartella "src/frontend" come root per HTML, CSS e JS
app.use(express.static(path.join(__dirname, 'src/frontend')));

// Serve la cartella "assets" per i JSON
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve "main.html" come homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/frontend/main.html'));
});

app.get("/report", (req, res) => {
  res.sendFile(path.join(__dirname, 'src/frontend/report.html'));
});

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});