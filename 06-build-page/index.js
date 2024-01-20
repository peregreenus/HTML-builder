const path = require('path');
const fs = require('fs');

const templatePath = path.join(__dirname, 'template.html');
const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const bundleCssPath = path.join(__dirname, 'project-dist', 'style.css');
const componentsPath = path.join(__dirname, 'components');

createDist();

function saveComponents() {
  const components = {};

  fs.readdir(componentsPath, (err, files) => {
    if (err) throw err;

    files = files.filter((file) => path.extname(file) === '.html');
    files.forEach((file, ind) => {
      const component = path.parse(file).name;
      fs.readFile(path.join(componentsPath, file), 'utf-8', (err, data) => {
        if (err) throw err;

        components[component] = data;

        if (ind === files.length - 1) {
          readTemplate(components);
        }
      });
    });
  });
}

function readTemplate(components) {
  const rs = fs.createReadStream(templatePath, 'utf-8');
  const ws = fs.createWriteStream(path.join(distPath, 'index.html'));
  const regExp = /{{(\w+)}}/;

  rs.on('data', (data) => {
    for (const component in components) {
      console.log(component);
      let componentName = data.match(regExp);
      data = data.replace(regExp, components[componentName[1]]);
    }

    ws.write(data);
  });
}

function createDist() {
  fs.mkdir(distPath, { recursive: true }, (err) => {
    if (err) console.log('Error: ' + err);

    saveComponents();
    putStyles();
    clearDir().then(() => copyDir('assets'));
  });
}

function putStyles() {
  const ws = fs.createWriteStream(bundleCssPath);
  fs.readdir(stylesPath, (err, files) => {
    if (err) throw err;

    for (let file of files) {
      if (path.extname(file) === '.css') {
        const rs = fs.createReadStream(path.join(stylesPath, file));
        rs.on('data', (data) => {
          ws.write(data + '\n');
        });
      }
    }
  });
}

function copyDir(folder) {
  fs.readdir(
    path.join(__dirname, folder),
    { withFileTypes: true },
    (err, files) => {
      if (err) throw err;

      fs.mkdir(
        path.join(distPath, folder),
        { recursive: true, force: true },
        (err) => {
          if (err) throw err;
        },
      );

      for (let file of files) {
        if (file.isDirectory()) {
          copyDir(path.join(folder, file.name));
        } else {
          fs.copyFile(
            path.join(__dirname, folder, file.name),
            path.join(distPath, folder, file.name),
            (err) => {
              if (err) throw err;
            },
          );
        }
      }
    },
  );
}

async function clearDir() {
  return await fs.promises.rm(
    path.join(distPath, 'assets'),
    { recursive: true, force: true },
    (err) => {
      if (err) throw err;
    },
  );
}
