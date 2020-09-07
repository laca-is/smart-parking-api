const { dynamodb } = require('./utils');

const insertUser = async (args) => {
	const { input } = args;

	return dynamodb.insertIntoTable(
		`${process.env.APP}-user-${process.env.STAGE}`,
		{
			...input,
		}
	);
};

const getUser = async (input) => {
	const { cpf } = input;

	const [result] = await dynamodb.getFromTable(
		`${process.env.APP}-user-${process.env.STAGE}`,
		'cpf',
		cpf
	);

	if (result) return result;

	return null;
};

module.exports = {
	insertUser,
	getUser,
};
