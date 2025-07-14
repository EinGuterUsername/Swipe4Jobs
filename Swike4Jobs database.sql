cd c:\xampp\mysql\bin
.\mysql -u root;
DROP DATABASE Swipe4Jobs;
CREATE DATABASE IF NOT EXISTS Swipe4Jobs;
USE Swipe4Jobs,
CREATE TABLE users (userId INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255),email VARCHAR(255),password VARCHAR(255),pretelefon VARCHAR(20),telefon VARCHAR(20),location VARCHAR(255),userOption VARCHAR(255),bio TEXT,fblink VARCHAR(255),xlink VARCHAR(255),gitlink VARCHAR(255),linkedlink VARCHAR(255),xsinglink VARCHAR(255),profilbild VARCHAR(255),contackte VARCHAR(255)),
CREATE TABLE contacts (contactID INT AUTO_INCREMENT PRIMARY KEY,userId INT,FOREIGN KEY (userId) REFERENCES users(userId)),
CREATE TABLE messages (message_id INT AUTO_INCREMENT PRIMARY KEY,senderId INT,receiverId INT,message_text TEXT,timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (senderId) REFERENCES users(userId),FOREIGN KEY (receiverId) REFERENCES users(userId));
CREATE TABLE contactsList (contactListId INT AUTO_INCREMENT PRIMARY KEY,userId INT,contactuserId INT,FOREIGN KEY (userId) REFERENCES users(userId),FOREIGN KEY (contactuserId) REFERENCES users(userId));
CREATE TABLE skills (skillId INT AUTO_INCREMENT PRIMARY KEY,skill VARCHAR(255) NOT NULL);
CREATE TABLE user_skills (userId INT,skillId INT,FOREIGN KEY (userId) REFERENCES users(userId),FOREIGN KEY (skillId) REFERENCES skills(skillId),PRIMARY KEY (userId, skillId));
INSERT INTO skills (skill) VALUES('JavaScript'),('Python'),('Java'),('C#'),('PHP'),('C++'),('TypeScript'),('Ruby'),('Swift'),('Go'),('Kotlin'),('Rust'),('Scala'),('Perl'),('R'),('Haskell'),('Lua'),('Dart'),('Objective-C'),('Assembly'),('Kommunikationsfähigkeiten'),('Teamarbeit'),('Problemlösungsfähigkeiten'),('Zeitmanagement'),('Flexibilität'),('Anpassungsfähigkeit'),('Kreativität'),('Kritisches Denken'),('Empathie'),('Konfliktlösungsfähigkeiten'),('Eigenmotivation'),('Führungsfähigkeiten'),('Stressbewältigung'),('Zielorientierung'),('Organisationsfähigkeit'),('Selbstbewusstsein'),('Verhandlungsgeschick'),('Kundenorientierung'),('Entscheidungsfähigkeit'),('Belastbarkeit'),('Programmierung'),('Projektmanagement'),('Microsoft Office'),('Data Analysis'),('Sprachkenntnisse'),('Verhandlungsführung'),('Technisches Know-how'),('Finanzanalyse'),('Statistik'),('Kundenbeziehungsmanagement'),('Softwareentwicklung'),('Grafikdesign'),('Digital Marketing'),('Cybersecurity'),('Künstliche Intelligenz'),('Cloud Computing'),('Webentwicklung'),('Mobile App Entwicklung'),('Datenbankmanagement'),('Machine Learning'),('UI/UX Design'),('Netzwerksicherheit'),('Elektronik'),('Betriebswirtschaft'),('Logistik'),('Kommunikationstechnik'),('Robotik'),('Maschinelles Lernen'),('CAD/CAM Design'),('Elektrotechnik'),('Quantencomputing'),('Medizintechnik'),('Blockchain-Technologie'),('3D-Druck'),('ERP-Systeme'),('Softwaretestung'),('Biotechnologie'),('Nanotechnologie'),('Raumfahrttechnik'),('Elektromobilität'),('Automatisierungstechnik'),('Augmented Reality'),('Virtual Reality'),('Industrie 4.0'),('Data Mining'),('Autonome Fahrzeuge'),('Internet of Things (IoT)'),('Fintech'),('E-Commerce');











<============>
Demodaten
INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Alice Johnson', 'alice.johnson@example.com', '123', '49', '1234567890', 'Berlin', 'Arbeitssuchend', 'Bio 1', 'fb.com/alicejohnson', 'x.com/alicejohnson', 'github.com/alicejohnson', 'linkedin.com/in/alicejohnson', 'xsing.com/alicejohnson', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Bob Smith', 'bob.smith@example.com', '123', '49', '1234567891', 'München', 'Ausbildungssuchend/Duales Studium', 'Bio 2', 'fb.com/bobsmith', 'x.com/bobsmith', 'github.com/bobsmith', 'linkedin.com/in/bobsmith', 'xsing.com/bobsmith', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Charlie Brown', 'charlie.brown@example.com', '123', '49', '1234567892', 'Hamburg', 'Praktikum/Trainee/Werkstudent', 'Bio 3', 'fb.com/charliebrown', 'x.com/charliebrown', 'github.com/charliebrown', 'linkedin.com/in/charliebrown', 'xsing.com/charliebrown', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Diana Martinez', 'diana.martinez@example.com', '123', '49', '1234567893', 'Frankfurt am Main', 'Ich bin offen für Angebote', 'Bio 4', 'fb.com/dianamartinez', 'x.com/dianamartinez', 'github.com/dianamartinez', 'linkedin.com/in/dianamartinez', 'xsing.com/dianamartinez', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Eva Wang', 'eva.wang@example.com', '123', '49', '1234567894', 'Köln', 'Freelancer', 'Bio 5', 'fb.com/evawang', 'x.com/evawang', 'github.com/evawang', 'linkedin.com/in/evawang', 'xsing.com/evawang', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Frank Garcia', 'frank.garcia@example.com', '123', '49', '1234567895', 'Stuttgart', 'Arbeitgeber', 'Bio 6', 'fb.com/frankgarcia', 'x.com/frankgarcia', 'github.com/frankgarcia', 'linkedin.com/in/frankgarcia', 'xsing.com/frankgarcia', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Grace Lee', 'grace.lee@example.com', '123', '49', '1234567896', 'Düsseldorf', 'Auftraggeber', 'Bio 7', 'fb.com/gracelee', 'x.com/gracelee', 'github.com/gracelee', 'linkedin.com/in/gracelee', 'xsing.com/gracelee', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Henry Nguyen', 'henry.nguyen@example.com', '123', '49', '1234567897', 'Dortmund', 'Arbeitssuchend', 'Bio 8', 'fb.com/henrynguyen', 'x.com/henrynguyen', 'github.com/henrynguyen', 'linkedin.com/in/henrynguyen', 'xsing.com/henrynguyen', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Ivy Patel', 'ivy.patel@example.com', '123', '49', '1234567898', 'Essen', 'Ausbildungssuchend/Duales Studium', 'Bio 9', 'fb.com/ivypatel', 'x.com/ivypatel', 'github.com/ivypatel', 'linkedin.com/in/ivypatel', 'xsing.com/ivypatel', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Jack Kim', 'jack.kim@example.com', '123', '49', '1234567899', 'Leipzig', 'Praktikum/Trainee/Werkstudent', 'Bio 10', 'fb.com/jackkim', 'x.com/jackkim', 'github.com/jackkim', 'linkedin.com/in/jackkim', 'xsing.com/jackkim', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Karen Chen', 'karen.chen@example.com', '123', '49', '1234567800', 'Dresden', 'Ich bin offen für Angebote', 'Bio 11', 'fb.com/karenchen', 'x.com/karenchen', 'github.com/karenchen', 'linkedin.com/in/karenchen', 'xsing.com/karenchen', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Liam Wilson', 'liam.wilson@example.com', '123', '49', '1234567801', 'Hannover', 'Freelancer', 'Bio 12', 'fb.com/liamwilson', 'x.com/liamwilson', 'github.com/liamwilson', 'linkedin.com/in/liamwilson', 'xsing.com/liamwilson', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Mia Taylor', 'mia.taylor@example.com', '123', '49', '1234567802', 'Nürnberg', 'Arbeitgeber', 'Bio 13', 'fb.com/miataylor', 'x.com/miataylor', 'github.com/miataylor', 'linkedin.com/in/miataylor', 'xsing.com/miataylor', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Noah Anderson', 'noah.anderson@example.com', '123', '49', '1234567803', 'Duisburg', 'Auftraggeber', 'Bio 14', 'fb.com/noahanderson', 'x.com/noahanderson', 'github.com/noahanderson', 'linkedin.com/in/noahanderson', 'xsing.com/noahanderson', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Olivia Martinez', 'olivia.martinez@example.com', '123', '49', '1234567804', 'Bochum', 'Arbeitssuchend', 'Bio 15', 'fb.com/oliviamartinez', 'x.com/oliviamartinez', 'github.com/oliviamartinez', 'linkedin.com/in/oliviamartinez', 'xsing.com/oliviamartinez', '/Uploads/default/Defaultprofilbild.jpg', '');

INSERT INTO users (name, email, password, pretelefon, telefon, location, userOption, bio, fblink, xlink, gitlink, linkedlink, xsinglink, profilbild, contackte)
VALUES('Peter Nguyen', 'peter.nguyen@example.com', '123', '49', '1234567805', 'Wuppertal', 'Ich bin offen für Angebote', 'Bio 16', 'fb.com/peternguyen', 'x.com/peternguyen', 'github.com/peternguyen', 'linkedin.com/in/peternguyen', 'xsing.com/oliviamartinez', '/Uploads/default/Defaultprofilbild.jpg', '');
