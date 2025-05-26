//recuperation du module express et lancement du serveur
const express = require("express"); 
//importation du module path de Node.js pour manipuler les chemins de fichiers
const path = require('path');
//chargement du middleware CORS(Cross-Origin Ressource Sharing) pour autoriser les requetes entre domaines differents
const cors = require('cors');
//importation de la route API 
const apiRoutes = require('./routes/api');

//execution du serveur
const app = express(); 

//definition du port
const PORT = 9090;

//definit le dossier views comme repertoire pour les templates EJS
app.set('views', path.join(__dirname, 'views')); 
//definir le moteur de templates qui est EJS
app.set('view engine', 'ejs');

// Activez CORS (toujours avant les routes)
app.use(cors({
    origin: `http://localhost:${PORT}`, 
  methods: ['GET', 'POST']
}));

//Integrer les routes API
app.use('/api', apiRoutes);

//Lecture de donnees envoyees par le formulaire HTML en POST
app.use(express.urlencoded({ extended: true }));

//permettre au serveur de renvoyer la page index.ejs lors de la demande de "/"
app.get('/', (req, res) => {
    /*var obj = {
        nom : "Meg",
        age : 20
    }
    res.render('index',obj);*/
    res.render('index'); //res.send() envoie du texte brut ou HTML directement
});

//Route GET pour la page "A propos"
app.get('/about', (req, res) => {
    res.send(`
        <h1>A propos</h1>
        <p>Ceci est une page minimaliste creee avec Express.js.</p>
        <a href="/">Retour a l'acceuil</a>`);
});

//Route GET pour la page "Contact"
app.get('/contact', (req, res) => {
    res.send(`
        <h1>Contactez-moi</h1>
        <form action="/submit-form" method="POST">
            <input type="text" name="email" placeholder="Votre email">
            <button type="submit">Envoyer</button>
        </form>
        <a href="/">Retour a l'accueil</a>
        `);
});


app.post('/submit-form', (req, res) => {
    const userEmail = req.body.email; //Recupere l'email du formulaire
    res.send(`Merci ! Votre email (${userEmail}) a ete recu.`);
});

// 404
app.use(function(req, res, next){
    res.status(404).send('Page introuvable oooooooo');
});


app.listen(PORT, () => {
    console.log(`Mon serveur ecoute sur le port ${PORT}!`)
});
