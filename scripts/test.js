const { execute, fileExists } = require('./utils');
const functionName = process.argv[2];
const fileName = process.argv[3];

if (!functionName || !fileName) {
	console.log('ERROR -> Invalid arguments.');
	return;
}

const path = `functions/${functionName}/tests/${fileName}.json`;
fileExists(path) &&
	execute(
		`dotenv-load serverless invoke local --function ${functionName} --path ${path}`
	);
