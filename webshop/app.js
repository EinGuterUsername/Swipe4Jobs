const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mysql = require('mysql2');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// MySQL-Datenbankverbindung
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Verbindung testen
connection.connect((err) => {
    if (err) {
        console.error('Fehler bei der Verbindung zur Datenbank:', err.stack);
        return;
    }
    console.log('Erfolgreich mit der Datenbank verbunden als ID ' + connection.threadId);
});

// Statische Dateien (z.B. CSS, Bilder) bereitstellen
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'media')));
// Engine konfigurieren
app.engine('hbs', exphbs.engine({ 
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partial') // Korrigiere den Pfad zu den Partials
}));
app.set('view engine', 'hbs');

// Startseite rendern
app.get('/', (req, res) => {
  console.log('Startseite aufgerufen');
  res.render('layouts/main', { 
      title: 'Mein Webshop'
  });
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});

const shutdownServer = () => {
    server.close(() => {
        console.log('Server wurde sauber heruntergefahren');
        process.exit(0); // Beendet den Node-Prozess
    });
};
process.on('SIGINT', shutdownServer);
process.on('SIGTERM', shutdownServer);
