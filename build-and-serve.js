import buildEverything from './scripts/buildEverything';
import startServer from './scripts/startServer';

(async () => {
	await buildEverything();
	await startServer();
})();