const fs = require('fs').promises;

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
};

const writeFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readFile, writeFile };