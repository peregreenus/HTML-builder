const path = require('path');
const fs = require('fs');

const originalFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.promises.rm(copyFolderPath, { recursive: true, force: true });
  await fs.promises
    .mkdir(copyFolderPath, { recursive: true })
    .then(
      fs.readdir(originalFolderPath, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          fs.promises.copyFile(
            path.join(originalFolderPath, file),
            path.join(copyFolderPath, file),
          );
        });
      }),
    )
    .catch((err) => console.log(err));
}

copyDir();
