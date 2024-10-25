const Iroh = require('iroh');
const fs = require('fs');

console.log("Iroh is starting the analysis...");

const code = fs.readFileSync('app.js', 'utf-8');

const stage = new Iroh.Stage(code);

const listener = stage.addListener(Iroh.FUNCTION);
listener.on('enter', (e) => {
  console.log(`Entering function: ${e.name}`);
});
listener.on('return', (e) => {
  console.log(`Returning from function: ${e.name}`);
});

eval(stage.script);
