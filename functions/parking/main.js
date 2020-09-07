const resolver = require('./resolver');

exports.handler = async (event) => {
	console.log('lambda started: ', event);
	try {
		switch (event.field) {
			case 'insertParkingSpots':
				return await resolver.insertParkingSpots(event.arguments);
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
