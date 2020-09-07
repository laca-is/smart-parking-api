const { dynamodb } = require('./utils');

const asyncInsertParkingSpot = async (spot) => {
	return dynamodb.insertIntoTable(
		`${process.env.APP}-parking-${process.env.STAGE}`,
		{
			...spot,
		}
	);
};

const insertParkingSpots = async (args) => {
	const { input } = args;

	const requests = [];

	for (let nSpot = 1; nSpot <= input.nSpots; nSpot += 1) {
		requests.push(
			asyncInsertParkingSpot({
				spot: `${input.sector}${nSpot}`,
				status: 'FREE',
				driverId: null,
				startTime: null,
				endTime: null,
				date: null,
				price: null,
			})
		);
	}

	const requestResult = await Promise.all(requests).then(
		(response) => response
	);

	return requestResult.every((result) => result);
};

module.exports = {
	insertParkingSpots,
};
