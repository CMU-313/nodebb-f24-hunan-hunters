'use strict';

function main() {
	require('./require-main');

	const nconf = require('nconf');
	nconf.argv().env({
		separator: '__',
	});

	const winston = require('winston');
	const path = require('path');
	const file = require('./src/file');

	process.env.NODE_ENV = process.env.NODE_ENV || 'production';
	global.env = process.env.NODE_ENV || 'production';

	const configFile = path.resolve(__dirname, nconf.any(['config', 'CONFIG']) || 'config.json');
	const configExists = file.existsSync(configFile) || (nconf.get('url') && nconf.get('secret') && nconf.get('database'));

	const prestart = require('./src/prestart');
	prestart.loadConfig(configFile);
	prestart.setupWinston();
	prestart.versionCheck();
	winston.verbose('* using configuration stored in: %s', configFile);

	if (!process.send) {
		winston.info(`NodeBB v${nconf.get('version')} Copyright (C) 2013-${(new Date()).getFullYear()} NodeBB Inc.`);
		winston.info('This program comes with ABSOLUTELY NO WARRANTY.');
		winston.info('This is free software, and you are welcome to redistribute it under certain conditions.');
		winston.info('');
	}

	if (nconf.get('setup') || nconf.get('install')) {
		require('./src/cli/setup').setup();
	} else if (!configExists) {
		require('./install/web').install(nconf.get('port'));
	} else if (nconf.get('upgrade')) {
		require('./src/cli/upgrade').upgrade(true);
	} else if (nconf.get('reset')) {
		require('./src/cli/reset').reset({
			theme: nconf.get('t'),
			plugin: nconf.get('p'),
			widgets: nconf.get('w'),
			settings: nconf.get('s'),
			all: nconf.get('a'),
		});
	} else if (nconf.get('activate')) {
		require('./src/cli/manage').activate(nconf.get('activate'));
	} else if (nconf.get('plugins') && typeof nconf.get('plugins') !== 'object') {
		require('./src/cli/manage').listPlugins();
	} else if (nconf.get('build')) {
		require('./src/cli/manage').build(nconf.get('build'));
	} else if (nconf.get('events')) {
		require('./src/cli/manage').listEvents();
	} else {
		require('./src/start').start();
	}
}

main();
