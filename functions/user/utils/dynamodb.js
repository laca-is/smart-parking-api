const DynamoDB = require('aws-sdk/clients/dynamodb');
const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });
const dynamo = new DynamoDB({ region: 'us-east-1' });
const { v4 } = require('uuid');

const insertIntoTable = async (table, args) => {
	try {
		const params = {
			TableName: table,
			Item: {
				uuid: v4(),
				timestamp: Date.now(),
				...args,
			},
		};
		await docClient.put(params).promise();

		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

const getFromTable = async (table, index, id) => {
	const result = await dynamo
		.query({
			TableName: table,
			IndexName: `${index}Index`,
			ScanIndexForward: false,
			KeyConditionExpression: `#${index} = :${index}`,
			ExpressionAttributeNames: { [`#${index}`]: index },
			ExpressionAttributeValues: {
				[`:${index}`]: {
					S: id.toString(),
				},
			},
		})
		.promise();

	return result.Items.map((item) => DynamoDB.Converter.unmarshall(item));
};

module.exports = {
	insertIntoTable,
	getFromTable,
};
