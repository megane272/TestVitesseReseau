const FastSpeedtest = require('fast-speedtest-api');
//const { promisify } = require('util');

module.exports = {
  testSpeed: async (req, res) => {
  try {
    const speedtest = new FastSpeedtest({
      verbose: false,
      timeout: 10000
    });

    const [ping, download, upload] = await Promise.all([
      speedtest.getPing(),
      speedtest.getDownloadSpeed(),
      speedtest.getUploadSpeed()
    ]);

    res.json({
      ping: `${ping} ms`,
      download: `${(download / 1000000).toFixed(2)} Mbps`,
      upload: `${(upload / 1000000).toFixed(2)} Mbps`,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
      console.error(err);
      res.status(500).json({error:err.message});
    }
  }
};
