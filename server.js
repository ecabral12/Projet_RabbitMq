// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { sendMessageToRabbitMQ } = require('./producer');
const { startConsumingMessages } = require('./consumer');
const bcrypt = require('bcryptjs');

const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const db = new sqlite3.Database('./database.db');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let messages = [];

io.on('connection', (socket) => {
    console.log('A user connected');
    messages.forEach(msg => {
        socket.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    socket.on('chat message', (data) => {
    // Envoyer l'objet data à RabbitMQ
    sendMessageToRabbitMQ(data);
});
});

startConsumingMessages(io, messages);

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur :', err);
            res.status(500).send('Erreur lors de l\'inscription');
        } else if (row) {
            res.status(409).send('Le nom d\'utilisateur est déjà utilisé');
        } else {
            bcrypt.hash(password, 10, function(err, hash) {
                if (err) {
                    console.error('Erreur lors du hachage du mot de passe :', err);
                    res.status(500).send('Erreur lors de l\'inscription');
                } else {
                    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
                        if (err) {
                            console.error('Erreur lors de l\'inscription dans la base de données :', err);
                            res.status(500).send('Erreur lors de l\'inscription');
                        } else {
                            console.log('Utilisateur inscrit avec succès :', { username });
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Erreur lors de la recherche de l\'utilisateur :', err);
            res.status(500).send('Erreur lors de la connexion');
        } else if (!row) {
            res.status(401).send('Nom d\'utilisateur incorrect');
        } else {
            bcrypt.compare(password, row.password, function(err, result) {
                if (err) {
                    console.error('Erreur lors de la comparaison des mots de passe :', err);
                    res.status(500).send('Erreur lors de la connexion');
                } else if (result) {
                    console.log('Connexion réussie pour l\'utilisateur :', { username });
                    res.sendStatus(200);
                } else {
                    res.status(401).send('Mot de passe incorrect');
                }
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});