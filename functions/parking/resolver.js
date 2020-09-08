const { dynamodb } = require('./utils');
const { v4 } = require('uuid');

const asyncInsertParkingSpot = async (spot) => {
	return dynamodb.insertIntoTable(
		`${process.env.APP}-parking-${process.env.STAGE}`,
		{
			...spot,
		}
	);
};

const getSpotsByStatus = async ({ status }) => {
	const result = await dynamodb.getFromTable(
		`${process.env.APP}-parking-${process.env.STAGE}`,
		'status',
		status
	);

	if (result) {
		return result;
	}

	return null;
};

const getHistory = async ({ filter }) => {
	let result = null;

	if (filter.driverId) {
		result = await dynamodb.getFromTable(
			`${process.env.APP}-parking-history-${process.env.STAGE}`,
			'driverId',
			filter.driverId
		);
	} else if (filter.spot) {
		result = await dynamodb.getFromTable(
			`${process.env.APP}-parking-${process.env.STAGE}`,
			'spot',
			filter.spot
		);
	}

	if (result) {
		return result;
	}

	return null;
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

const updateParkingSpot = async (payload) => {
	const result = await dynamodb.insertIntoTable(
		`${process.env.APP}-parking-${process.env.STAGE}`,
		payload
	);

	if (result) {
		return payload;
	}

	return null;
};

const requestSpot = async (args) => {
	const payload = {
		...args.input,
		status: 'IN_NEGOTIATION',
	};

	return updateParkingSpot(payload);
};

const requestSuccess = async (args) => {
	const payload = {
		...args.input,
		status: 'WAITING_FOR_PARKING',
	};

	return updateParkingSpot(payload);
};

const clearSpot = async (args) => {
	const payload = {
		...args.input,
		status: 'FREE',
		driverId: null,
		startTime: null,
		endTime: null,
		date: null,
		price: null,
	};

	return updateParkingSpot(payload);
};

const requestFailed = async (args) => {
	return clearSpot(args);
};

const carArrived = async (args) => {
	const payload = {
		...args.input,
		status: 'BUSY',
	};

	if (await updateParkingSpot(payload)) {
		const result = dynamodb.insertIntoTable(
			`${process.env.APP}-parking-history-${process.env.STAGE}`,
			{
				uuid: v4(),
				timestamp: Date.now(),
				driverId: payload.driverId,
				spot: payload.spot,
				price: payload.price,
			}
		);

		if (result) return payload;
	}

	return null;
};

const carLeft = async (args) => {
	return clearSpot(args);
};

module.exports = {
	insertParkingSpots,
	getSpotsByStatus,
	getHistory,
	requestSpot,
	requestSuccess,
	requestFailed,
	carArrived,
	carLeft,
};
