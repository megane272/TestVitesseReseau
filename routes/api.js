 
const express = require('express');
//objet router express pour definir des routes specifiques
const router = express.Router();
//importation des controleur depuis speedController.js
const speedController = require('../controllers/speedController');

// Route pour tester la vitesse
router.get('/test-speed', speedController.testSpeed);

/*/ Route pour test manuel (alternative)
router.get('/manual-test', async (req, res) => {
    // Implémentation alternative si besoin
});*/

//exportation vers serveur.js
module.exports = router;