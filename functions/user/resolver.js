const diff = require('deep-diff');
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

const getUser = async ({ driverId }) => {
	const [result] = await dynamodb.getFromTable(
		`${process.env.APP}-user-${process.env.STAGE}`,
		'driverId',
		driverId
	);

	if (result) return result;

	return null;
};

const insertVehicle = async (args) => {
	const { input } = args;

	const user = await getUser(input);
	const getDiff = diff(user.vehicles, input.plates);

	if (!getDiff) return true;

	const newVehicles = [];
	diff(user.vehicles, input.plates).map((element) => {
		if (element.kind === 'N' || element.kind === 'E') {
			newVehicles.push(element.rhs);
		}
	});

	return dynamodb.insertIntoTable(
		`${process.env.APP}-user-${process.env.STAGE}`,
		{
			...user,
			vehicles: [...newVehicles],
		}
	);
};

module.exports = {
	insertUser,
	getUser,
	insertVehicle,
};
