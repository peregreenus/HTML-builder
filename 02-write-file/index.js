const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const filePath = path.join(__dirname, './text.txt');
const rl = readline.createInterface(stdin, stdout);

rl.setPrompt('Please, enter some text\n', () => {});

rl.prompt(fs.writeFile(filePath, '', (err) => (err ? err : 1)));

rl.on('line', (data) => {
  if (data !== 'exit') {
    fs.appendFile(filePath, data + '\n', (err) => (err ? err : 1));
  } else {
    rl.close();
  }
});

rl.on('close', () => stdout.write('Record is done. Bye.'));
