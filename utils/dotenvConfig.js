const dotenv = require("dotenv");

const env = dotenv.config();

if (env.error){
    throw new Error("Failed to load env.")
}

module.exports = env;
