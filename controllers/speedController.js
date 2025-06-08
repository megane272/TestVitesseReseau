const speedTest = require('speedtest-net');
const { promisify } = require('util');

module.exports = {
  testSpeed: async (req, res) => {
  try {
    const test = speedTest({ acceptLicense: true, acceptGdpr: true});

    test.on('data', data => {
      console.log('Progression:', data.progress);
  });

    const results = await promisify(test.on.bind(test))('results');

    res.json({
      ping: `${results.ping.latency.toFixed(2)} ms`,
      download: `${(results.download.bandwidth / 125000).toFixed(2)} Mbps`,
      upload: `S{(results.upload.bandwith / 125000).toFixed(2)} Mbps`,
      isp: results.isp,
      server: {
        name: results.server.name,
        location: results.server.location
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
      console.error("Complet error", err);
      res.status(500).json({
        error: 'Test failed',
        details: err.message,
        solution: 'Internet connection issue'
      });
    }
  }
};
