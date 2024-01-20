const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');
const bytesInKbytes = 1000;

const formattingResult = (file) => {
  const filePath = path.join(folderPath, path.basename(file));
  fs.stat(filePath, (err, stats) => {
    if (err) throw err;
    if (stats.isFile()) {
      const [fileName, fileExt] = file.split('.');
      console.log(
        `${fileName} - ${fileExt} - ${(stats.size / bytesInKbytes).toFixed(
          3,
        )}Kb`,
      );
    }
  });
};

fs.readdir(folderPath, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach((file) => formattingResult(file));
  }
});
