import axios from 'axios';

const LOGGING_API_URL = 'https://20.244.56.144/evaluation-service/logs';

async function Log(stack, level, pkg, message) {
  const payload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await axios.post(LOGGING_API_URL, payload);
    console.log(`[Logger Success] ${level.toUpperCase()} - ${message}`);
    return response.data;
  } catch (error) {
    console.error(`[Logger Error] Failed to send log: ${error.message}`);
  }
}

export default Log;
