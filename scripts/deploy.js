const { execute } = require('./utils');
const functionName = process.argv[2];

if (!functionName) {
	console.log('ERROR -> Invalid arguments.');
	return;
}

execute(`dotenv-load sls deploy function --function ${functionName}`);
