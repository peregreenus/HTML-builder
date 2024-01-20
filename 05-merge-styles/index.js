const { readdir } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const srcFolderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const ws = createWriteStream(bundlePath);

readdir(srcFolderPath, { withFileTypes: true }, (files) => files)
  .then((files) =>
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const rs = createReadStream(path.join(srcFolderPath, file.name));

        rs.on('data', (data) => {
          ws.write(data + '\n');
        });
      }
    }),
  )
  .catch((err) => console.log('Error: ' + err));
