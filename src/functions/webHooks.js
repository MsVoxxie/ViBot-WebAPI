const moment = require('moment');
const axios = require('axios');

async function sendWebhook(data) {
	//An array of Discord Embeds.
	let embeds = [
		{
			title: data.title,
			color: 16557849,
			footer: {
				text: `📅 ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss A')}`,
			},
		},
	];

	if (data.description) {
		embeds[0].description = data.description;
	}

	if (data.fieldName && data.fieldValue) {
		embeds[0].fields = [
			{
				name: data.fieldName,
				value: data.fieldValue,
			},
		];
	}

	let webHookData = JSON.stringify({ embeds });

	var config = {
		method: 'POST',
		url: data.URL,
		headers: { 'Content-Type': 'application/json' },
		data: webHookData,
	};

	//Send the request
	axios(config)
		.then((response) => {
			return response;
		})
		.catch((error) => {
			console.log(error);
			return error;
		});
}

module.exports = { sendWebhook };
