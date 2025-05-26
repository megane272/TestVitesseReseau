//importation du module qui effectue les requetes HTTP pour les tests de vitesse
const axios = require('axios');
// module de mesure d'intervalles de temps
const { performance } = require('perf_hooks');
// module de manipulation des fichiers(creation et lecture du fichier testfile.bin)
const fs = require('fs');
// module de gestion des chemins de fichiers cross-plateform
const path = require('path');

// Fichier de test pour l'upload (1MB)
const TEST_FILE_PATH = path.join(__dirname, 'testfile.bin');
if (!fs.existsSync(TEST_FILE_PATH)) {
  fs.writeFileSync(TEST_FILE_PATH, Buffer.alloc(1024 * 1024)); // Crée un fichier de 1MB
}

module.exports = {
  testSpeed: async (req, res) => {
    console.log("Requête de test reçue");
    try {
      // 1. Ping Test (via HTTP)
      const pingStart = performance.now();
      await axios.head('http://www.google.com');
      const ping = performance.now() - pingStart;
      console.log("Début du ping...");

      // 2. Download Test (10MB)
      const downloadUrl = 'http://ipv4.download.thinkbroadband.com/10MB.zip';
      const downloadStart = performance.now();
      const { data: downloadData } = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
      const downloadSpeed = ((downloadData.length * 8) / (performance.now() - downloadStart)) / 1000;

      // 3. Upload Test (1MB)
      const uploadStart = performance.now();
      await axios.post('https://httpbin.org/post', fs.createReadStream(TEST_FILE_PATH), {
        headers: { 'Content-Type': 'application/octet-stream' }
      });
      const uploadSpeed = ((fs.statSync(TEST_FILE_PATH).size * 8) / (performance.now() - uploadStart)) / 1000;

      console.log("Test terminé avec succès");
      res.json({
        ping: `${ping.toFixed(2)} ms`,
        download: `${downloadSpeed.toFixed(2)} Mbps`,
        upload: `${uploadSpeed.toFixed(2)} Mbps`,
        server: {
          download: 'thinkbroadband.com',
          upload: 'httpbin.org'
        },
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error("Erreur dans testSpeed:", err); 
      res.status(500).json({
        error: 'Test failed',
        details: err.message,
        alternative: 'Try again later or check your connection'
      });
    }
  }
};