const router = require('express').Router();
const moment = require('moment');
const axios = require('axios');
require('dotenv').config();

router.get('/b62', async (req, res) => {
	//Get Response from API
	const response = await axios.get(`http://bustime.mta.info/api/siri/stop-monitoring.json?key=${process.env.BUS_KEY}&version=2&OperatorRef=MTA&MonitoringRef=304940&LineRef=MTA%20NYCT_B62&MaximumStopVts=2`);

	//Get the data from the response
	const MonitoredVehicleJourney = response.data.Siri.ServiceDelivery.StopMonitoringDelivery?.[0]?.MonitoredStopVisit?.[0].MonitoredVehicleJourney;
	// const SituationExchangeDelivery = response.data.Siri.ServiceDelivery.SituationExchangeDelivery;

	//If there is no MonitoredVehicleJourney, return that the service is disrupted
	//Later I will send disruption information...
	if (!MonitoredVehicleJourney) return res.status(503).send('No Data to Display, Service may be disrupted');

	const Data = {
		LineName: MonitoredVehicleJourney.PublishedLineName[0],
		Destination: MonitoredVehicleJourney.DestinationName[0],
		ExpectedArrivalTime: `Arriving ${moment(MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime).fromNow()}`,
		NumberOfStopsAway: parseInt(MonitoredVehicleJourney.MonitoredCall.NumberOfStopsAway),
	};
	if (Data) {
		res.send(Data);
	} else {
		res.send(500);
	}
});

module.exports = router;
