const fs = require('fs');

let buffer;

function read() {
  buffer = Buffer.alloc(1024);

  const stdin = fs.openSync('/dev/stdin', 'rs');
  const stdout = fs.openSync('/dev/stdout', 'as');

  fs.writeSync(stdout, '*vm> ');
  fs.readSync(stdin, buffer, 0, 1024, null);

  fs.closeSync(stdin);
  fs.closeSync(stdout);

  return buffer.toString('utf8').replace(/\0/g, '').trim();
}

function repl(machine) {
  const expression = read();

  if (expression === 'quit') {
    return;
  }

  try {
    const fn = new Function('machine', `return ${expression}`);
    console.log(fn(machine));
  } catch (e) {
    console.log(
      `\x1b[31mVM: Error evaluating expression "${expression}"\x1b[0m`
    );
  }
  repl(machine);
}

module.exports = ({ machine }) => {
  return {
    execute: function () {
      repl(machine);
    },
  };
};
