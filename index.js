const express = require("express");
const mysql = require("mysql2");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./.env" });
const fs = require("fs");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const moment = require("moment");
const bodyParser = require('body-parser');
const Sequelize = require("sequelize");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { DataTypes } = require('sequelize');
const store = new session.MemoryStore();

// Verbindung zur MySQL-Datenbank herstellen
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Verbindung zur MySQL-Datenbank herstellen
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Middleware und Konfigurationen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));
app.use(fileUpload());
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

// Verbindung zur MySQL-Datenbank herstellen
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Erfolgreich verbunden mit MySQL");
    // Server starten, wenn die Verbindung zur Datenbank hergestellt wurde
    app.listen(5010, () => {
      console.log("Server gestartet auf Port 5010");
    });
  }
});

const geheimnis = process.env.MEIN_GEHEIMNIS || "fallback-geheimnis";
app.use(
  session({
    secret: geheimnis,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
    store,
  })
);

app.post("/registration", (req, res) => {
  const {
    name,
    email,
    password,
    password2,
    pretelefon,
    telefon,
    location,
    userOption,
  } = req.body;

  // Überprüfe, ob die Passwörter übereinstimmen
  if (password !== password2) {
    return res.status(400).send("Die Passworteingaben sind nicht identisch");
  }

  // Überprüfe, ob die E-Mail bereits in der Datenbank vorhanden ist
  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Fehler beim Registrieren.");
    }

    if (results.length > 0) {
      // Es gibt bereits einen Benutzer mit dieser E-Mail-Adresse
      return res
        .status(400)
        .send("Diese E-Mail-Adresse ist bereits registriert.");
    }

    // Füge den Benutzer in die Datenbank ein, wenn die E-Mail-Adresse noch nicht vorhanden ist
    db.query(
      "INSERT INTO users (name, email, pretelefon, telefon, location, userOption, password, profilbild) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, pretelefon, telefon, location, userOption, password, "/Uploads/default/Defaultprofilbild.jpg"],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).send("Fehler beim Registrieren.");
        }
        // Weiterleitung zur Login-Seite nach erfolgreicher Registrierung
        res.redirect("/login.hbs");
      }
    );
  });
});
//-----Login & Session-----
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  db.query( 
    "SELECT userId, email, password FROM users WHERE email = ? AND password = ?",
    [email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        console.log(results);
        return res.status(500).send("Internal Server Error");
      }
      console.log(results)
      if (results.length === 0) {
        // Kein Benutzer mit den angegebenen Anmeldeinformationen gefunden
        return res.status(401).send("Ungültige Anmeldeinformationen.");
      }

      const user = results[0]; // Erste Zeile aus den Abfrageergebnissen
      const usersObject = {
        userId: user.userId,
        email: user.email,
        name: user.name,
      };

      // Setze die userId und Authentifizierungsstatus in der Session
      req.session.userId = usersObject.userId;
      req.session.authenticated = true;
      res.redirect("/profile/" + usersObject.userId);
    }
  );
});

//-----Aktualisierung der Benutzerdaten-----
app.get("/settings", (req, res) => {
  const userId = req.session.userId;
  // Datenbankabfrage, um nur die Benutzerdaten des angemeldeten Benutzers abzurufen
  db.query(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      const userData = results[0];
      // Rendern der Einstellungsseite und Übergabe der Benutzerdaten an das Template
      res.render("settings", { userData: userData });
    }
  );
});

app.post("/settings", (req, res) => {
  const userId = req.session.userId;
  const {
    name,
    pretelefon,
    telefon,
    location,
    userOption,
    bio,
    fblink,
    xlink,
    gitlink,
    linkedlink,
    xsinglink,
  } = req.body;

  db.query(
    "UPDATE users SET name=?, pretelefon=?, telefon=?, location=?, userOption=?, bio=?, fblink=?, xlink=?, gitlink=?, linkedlink=?, xsinglink=? WHERE userId=?",
    [
      name,
      pretelefon,
      telefon,
      location,
      userOption,
      bio,
      fblink,
      xlink,
      gitlink,
      linkedlink,
      xsinglink,
      userId,
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      console.log(results);
      // Weitere Verarbeitung nach erfolgreicher Aktualisierung der Benutzerdaten
    }
  );

  // Daten erfolgreich aktualisiert
  console.log("Benutzerdaten erfolgreich aktualisiert");

  db.query(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      const userData = results[0];
      // Rendern der Profilseite mit den aktualisierten Benutzerdaten
      res.render("profile", { userData: userData });
    }
  );
});

//-----Profilbild Upload-----

app.post("/upload-profile-pic", (req, res) => {
  // Zugriff auf das hochgeladene Bild
  const profilePic = req.files.profilePic;
  const userId = req.session.userId;
  const userIdString = JSON.stringify(userId);
  const uploadPath = path.join(__dirname, "Uploads", userIdString); // Speicherpfad für das Bild festlegen
  app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
  app.use(
    "/upload-profile-pic",
    express.static(path.join(__dirname, "Uploads"))
  );
  //UserData definieren
  db.query(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      const userData = results[0];

    }
  );

  //Alter Pfad wird gelöscht (falls vorhanden)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  // Altes Profilbild löschen (falls vorhanden)
  try {
    fs.unlinkSync(path.join(uploadPath, "profilbild.*"));
  } catch (err) {
    if (err.code !== "ENOENT") {
      // Fehler ignorieren, wenn Datei nicht existiert
      console.error("Fehler beim Löschen des alten Profilbilds:", err);
    }
  }
    const currentDate = moment().format("DD-MM-YYYY"); // Aktuelles Datum und Uhrzeit im Format: Jahr-Monat-Tag_Stunde-Minute-Sekunde
    const newFileName = `profilbild_${currentDate}.${profilePic.name
      .split(".")
      .pop()}`; // Neuer Dateiname mit aktuellem Datum und Originaldateierweiterung
    // Alten Upload löschen (falls vorhanden)
    fs.unlink(path.join(uploadPath, profilePic.name), (err) => {
      if (err && err.code !== "ENOENT") {
        // Fehler ignorieren, wenn Datei nicht existiert
        console.error("Fehler beim Löschen des alten Profilbilds:", err);
      }
      // Bild speichern
      profilePic.mv(path.join(uploadPath, newFileName), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Fehler beim Hochladen des Profilbilds");
        }

        // Link zum Profilbild erstellen
        const profilePicLink = `/Uploads/${String(userId)}/${String(
          newFileName
        )}`;
        // Link zum Profilbild in die Datenbank einfügen
        const sql = "UPDATE users SET profilbild = ? WHERE userId = ?";
        db.query(sql, [profilePicLink, userId], (err, result) => {
          if (err) {
            console.error(
              "Fehler beim Einfügen des Profilbild-Links in die Datenbank:",
              err
            );
            return res
              .status(500)
              .send(
                "Fehler beim Speichern des Profilbild-Links in der Datenbank"
              );
          }
          db.query(
            "SELECT * FROM users WHERE userId = ?",
            [userId],
            (error, results) => {
              if (error) {
                console.error(error);
                return res.status(500).send("Internal Server Error");
              }
              const userData = results[0];
            }
          );
        });
      });
    });
  });
app.get("/suche", (req, res) => {
  const query = req.query.query; // Suchbegriff aus dem Query-String extrahieren
  // Überprüfen, ob die Länge des Suchbegriffs mindestens 3 ist
  if (query.length < 3) {
    return res
      .status(400)
      .json({
        error: "Der Suchbegriff muss mindestens 3 Buchstaben enthalten",
      });
  }
  // Datenbankabfrage, um nach Benutzern zu suchen, die dem Suchkriterium entsprechen
  db.query(
    "SELECT * FROM users WHERE name LIKE ?",
    [`%${query}%`],
    (error, searchResults) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (searchResults.length === 0) {
        return res.status(404).json({ error: "Keine Benutzer gefunden" });
      }
      // Senden der gefundenen Benutzer als JSON
      res.json(searchResults);
    }
  );
});

//-----Adding user-----

app.post("/add-contact/:userId", (req, res) => {
  const userId = req.session.userId; // Benutzer-ID des angemeldeten Benutzers (der die Anfrage stellt)
  const contactID = req.params.userId; // Benutzer-ID des gesuchten Benutzers

  // Prüfen, ob der Kontakt bereits existiert
  db.query(
    "SELECT * FROM contacts WHERE userId = ? AND contactID = ?",
    [userId, contactID],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }

      // Wenn der Kontakt bereits existiert, senden Sie eine Nachricht an den Client
      if (results.length > 0) {
        return res.status(400).send("Kontakt bereits vorhanden");
      }

      // Wenn der Kontakt noch nicht existiert, fügen Sie ihn in die Datenbank ein
      db.query(
        "INSERT INTO contacts (userId, contactID) VALUES (?, ?)",
        [userId, contactID], // Hier umgedreht, um den angemeldeten Benutzer als Kontakt des gesuchten Benutzers hinzuzufügen
        (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
          }
          // Erfolgreiche Antwort senden
          res.status(200).send("Kontakt erfolgreich hinzugefügt");
        }
      );
    }
  );
});
//-----Profil-----
app.get("/profile/:userId", (req, res) => {
  const userId = req.session.userId; // Benutzer-ID des angemeldeten Benutzers
  // Datenbankabfrage, um die Benutzerdaten abzurufen
  db.query(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
    (error, userDataResults) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      const userData = userDataResults[0]; // Benutzerdaten

      if (!userData) {
        return res.status(404).send("Benutzer nicht gefunden");
      }
      // Datenbankabfrage, um die Kontaktliste des Benutzers abzurufen
      db.query(
        "SELECT users.name, users.profilbild, users.location, users.userOption FROM contacts JOIN users ON contacts.contactID = users.userId WHERE contacts.userId = ?",
        [userId],
        (error, contactDetailsResults) => {
          if (error) {
            console.error("Fehler beim Abrufen der Kontaktliste:", error);
            return res.status(500).send("Internal Server Error");
          }
          const contactDetails = contactDetailsResults; // Kontaktdetails
          // Erfolgreiche Antwort senden
          res.render("profile", { userData: userData, contacts: contactDetails });
        }
      );
    }
  );
});
app.get("/getuserId", (req, res) => {
  const userId = req.session.userId; // Die userId aus der Sitzung erhalten
  res.json({ userId: userId }); // Die userId als JSON-Antwort senden
});
// Route zum Hinzufügen eines Kontakts
app.post("/add-contact", (req, res) => {
  const userId = req.session.userId;
  const contactID = req.body.contactID; // ID des Benutzers, der als Kontakt hinzugefügt werden soll

  // Füge den Kontakt in die Datenbank ein
  db.query(
    "INSERT INTO contacts (userId, contactID) VALUES (?, ?)",
    [userId, contactID],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Fehler beim Hinzufügen des Kontakts.");
      }
      // Erfolgreiche Antwort senden
      res.send("Kontakt erfolgreich hinzugefügt");
    }
  );
});
app.post("/searchSkill", (req, res) => {
  const { query } = req.body;
  db.query('SELECT * FROM skills WHERE skill LIKE ?', [`%${query}%`], (error, results) => {
      if (error) {
          console.error('Fehler beim Suchen nach Skills:', error);
          res.status(500).json({ error: 'Interner Serverfehler' });
      } else {
          res.json(results); // Senden der gefundenen Skills als JSON-Antwort
      }
  });
});
app.post("/addSkillToUser", (req, res) => {
  const { userId, skillId } = req.body; // Benutzer-ID und Skill-ID aus dem Request Body extrahieren
  // Annahme: Es gibt eine Tabelle namens user_skills mit den Spalten userId und skillId
  db.query('INSERT INTO user_skills (userId, skillId) VALUES (?, ?)', [userId, skillId], (error, results) => {
      if (error) {
          console.error('Fehler beim Hinzufügen des Skills zum Benutzer:', error);
          res.status(500).json({ error: 'Interner Serverfehler' });
      } else {
          console.log("Skill erfolgreich zum Benutzer hinzugefügt " +userId+"  "+ skillId);
          res.sendStatus(200); // Erfolgsstatus senden
      }
  });
});
app.get("/loadskills", (req, res) => {
  const userId = req.session.userId;
  db.query('SELECT skills.skill FROM user_skills JOIN skills ON user_skills.skillId = skills.skillId WHERE user_skills.userId = ?', [userId], (error, results) => {
      if (error) {
          console.error('Fehler beim Abrufen der Skills:', error);
          res.status(500).json({ error: 'Interner Serverfehler' });
      } else {
          const skills = results.map(result => result.skill);
          res.json(skills);
      }
  });
});
app.post("/deleteSkill", (req, res) => {
  const { userId, skill } = req.body;
  // Führe eine SQL-Abfrage aus, um die Skill-ID für den gegebenen Skill-Namen zu finden
  console.log(userId, skill);
  db.query(
      "SELECT skillId FROM skills WHERE skill = ?",
      [skill],
      (error, results) => {
          if (error) {
              console.error("Fehler beim Suchen der Skill-ID:", error);
              return res.status(500).json({ error: "Interner Serverfehler" });
          }

          if (results.length === 0) {
              return res.status(404).json({ error: "Skill nicht gefunden" });
          }

          const skillId = results[0].skillId;
          console.log(skillId);
          // Führe eine SQL-Abfrage aus, um den Skill für den Benutzer zu löschen
          db.query(
              "DELETE FROM user_skills WHERE userId = ? AND skillId = ?",
              [userId, skillId],
              (error, results) => {
                  if (error) {
                      console.error("Fehler beim Löschen des Skills:", error);
                      return res.status(500).json({ error: "Interner Serverfehler" });
                  }
                  console.log(skillId);
                  res.sendStatus(200); // Erfolgsstatus senden
              }
          );
      }
  );
});
app.post("/messages", (req, res) => {
  const userId = req.session.userId; // Benutzer-ID des angemeldeten Benutzers

  // Datenbankabfrage, um die Nachrichten und dazugehörigen Benutzernamen abzurufen
  db.query(
    `SELECT messages.*, sender.name AS senderName, receiver.name AS receiverName 
    FROM messages 
    JOIN users AS sender ON messages.senderId = sender.userId 
    JOIN users AS receiver ON messages.receiverId = receiver.userId 
    WHERE messages.senderId = ? OR messages.receiverId = ? 
    ORDER BY messages.timestamp DESC`,
    [userId, userId],
    (error, results) => {
      if (error) {
        console.error("Fehler beim Abrufen der Nachrichten:", error);
        return res.status(500).json({ error: "Interner Serverfehler" });
      }

      // Erfolgreiche Antwort mit den Nachrichten und dazugehörigen Benutzernamen senden
      res.json(results);
    }
  );
});

app.post("/sendmessage", (req, res) => {
  const { senderId, receiverId, message_text } = req.body;

  db.query(
    "INSERT INTO messages (senderId, receiverId, message_text, timestamp) VALUES (?, ?, ?, NOW())",
    [senderId, receiverId, message_text],
    (error, results) => {
      if (error) {
        console.error("Fehler beim Senden der Nachricht:", error);
        return res.status(500).json({ error: "Interner Serverfehler" });
      }

      console.log("Nachricht erfolgreich gesendet");
      res.sendStatus(200); // Erfolgsstatus senden
    }
  );
});
app.get("/contactsandmessages", (req, res) => {
  const userId = req.session.userId; // Benutzer-ID des angemeldeten Benutzers
  // Datenbankabfrage, um die Benutzerdaten abzurufen
  db.query(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
    (error, userDataResults) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      const userData = userDataResults[0]; // Benutzerdaten

      if (!userData) {
        return res.status(404).json({ error: "Benutzer nicht gefunden" });
      }
      // Datenbankabfrage, um die Kontaktliste des Benutzers abzurufen
      db.query(
        "SELECT users.name, users.profilbild, users.location, users.userOption, GROUP_CONCAT(messages.message_text) AS messages FROM contacts JOIN users ON contacts.contactID = users.userId LEFT JOIN messages ON messages.senderId = users.userId WHERE contacts.userId = ? GROUP BY users.userId",
        [userId],
        (error, contactDetailsResults) => {
          if (error) {
            console.error("Fehler beim Abrufen der Kontaktliste:", error);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          const contactDetails = contactDetailsResults.map(contact => ({
            name: contact.name,
            profilbild: contact.profilbild,
            location: contact.location,
            userOption: contact.userOption,
            messages: contact.messages ? contact.messages.split(',') : [] // Splitte die Nachrichten und erstelle ein Array
          }));
          // Erfolgreiches Ergebnis als JSON an den Client senden
          res.json({ userData: userData, contacts: contactDetails });
        }
      );
    }
  );
});

//-----Routen-----
app.get("/messenger.hbs", (req,res) => {
  res.render("messenger");
});
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login.hbs", (req, res) => {
  res.render("login");
});
app.get("/registration.hbs", (req, res) => {
  res.render("registration");
});
app.get("/howto.hbs", (req, res) => {
  res.render("howto");
});
app.get("/contact.hbs", (req, res) => {
  res.render("contact");
});
app.get("/profile.hbs", (req, res) => {
  res.render("profile");
});
app.get("/aboutus.hbs", (req, res) => {
  res.render("aboutus");
});
