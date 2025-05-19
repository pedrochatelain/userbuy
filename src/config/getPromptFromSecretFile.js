const fs = require('fs').promises;
const path = require('path');

module.exports = async () => {
  const promptPath = path.join('/etc', 'secrets', 'prompt.txt');
  try {
    const prompt = await fs.readFile(promptPath, 'utf8');
    return prompt;
  } catch (error) {
    console.error('Error reading prompt file:', error);
    throw new Error('Failed to read prompt from secret file');
  }
}