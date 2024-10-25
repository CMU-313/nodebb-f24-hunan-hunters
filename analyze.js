'use strict';

const Iroh = require('iroh');
// const Iroh = require('./node_modules/iroh');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
// const Iroh = require('./node_modules/iroh');


console.log('Iroh is starting the analysis...');

const code = fs.readFileSync('app.js', 'utf-8');

const stage = new Iroh.Stage(code);

const listener = stage.addListener(Iroh.FUNCTION);
listener.on('enter', (e) => {
	console.log(`Entering function: ${e.name}`);
});
listener.on('return', (e) => {
	console.log(`Returning from function: ${e.name}`);
});


const script = new vm.Script(stage.script);

const currentDir = __dirname;

const context = vm.createContext({
	Iroh,
	require,
	console,
	process,
	global,
	__dirname: currentDir,
	__filename: path.join(currentDir, 'app.js'),
});

script.runInContext(context);


console.log('Iroh has finished the analysis.');
