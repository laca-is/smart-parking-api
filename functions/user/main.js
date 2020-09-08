const resolver = require('./resolver');

exports.handler = async (event) => {
	try {
		switch (event.field) {
			case 'insertUser':
				return await resolver.insertUser(event.arguments);
			case 'getUser':
				return await resolver.getUser(event.arguments);
			case 'insertVehicle':
				return await resolver.insertVehicle(event.arguments);
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
