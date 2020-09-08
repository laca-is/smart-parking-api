const resolver = require('./resolver');

exports.handler = async (event) => {
	try {
		switch (event.field) {
			case 'insertParkingSpots':
				return await resolver.insertParkingSpots(event.arguments);
			case 'getSpotsByStatus':
				return await resolver.getSpotsByStatus(event.arguments);
			case 'requestSpot':
				return await resolver.requestSpot(event.arguments);
			case 'requestSuccess':
				return await resolver.requestSuccess(event.arguments);
			case 'requestFailed':
				return await resolver.requestFailed(event.arguments);
			case 'carArrived':
				return await resolver.carArrived(event.arguments);
			case 'carLeft':
				return await resolver.carLeft(event.arguments);
			case 'getHistory':
				return await resolver.getHistory(event.arguments);
			default:
				throw new Error('Method not allowed');
		}
	} catch (error) {
		console.error(error);
		return {
			errorType: error.code,
			errorMessage: error.message,
		};
	}
};
