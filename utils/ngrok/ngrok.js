const ngrok = require("ngrok");

// Start Ngrok tunnel
const startNgrokTunnel = async (port) => {
  try {
    const url = await ngrok.connect({
      addr: port,
      authtoken: process.env.NGROK_AUTHTOKEN,
      region: "in",
    });

    console.log(`Ngrok tunnel started at: ${url}`);
  } catch (error) {
    console.error("Error starting Ngrok:", error);
  }
};

module.exports = startNgrokTunnel;
