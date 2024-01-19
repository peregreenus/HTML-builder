const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');

fs.createReadStream(filePath, 'utf8').on('data', (data) =>
  process.stdout.write(data),
);
