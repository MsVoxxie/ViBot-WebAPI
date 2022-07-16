const router = require('express').Router();
const moment = require('moment');
const axios = require('axios');
require('dotenv').config();

router.get('/b62', async (req, res) => {
	//Get Response from API
	const response = await axios.get(`http://bustime.mta.info/api/siri/stop-monitoring.json?key=${process.env.BUS_KEY}&version=2&OperatorRef=MTA&MonitoringRef=304940&LineRef=MTA%20NYCT_B62`); //&MaximumStopVts=1`);

	//Get the data from the response
	//Sort all expected times and return the soonest one first.
	const MonitoredVehicleJourney = response.data.Siri.ServiceDelivery.StopMonitoringDelivery?.[0]?.MonitoredStopVisit?.map((bus) => bus.MonitoredVehicleJourney).sort((a, b) => {
		return a.MonitoredCall.ExpectedArrivalTime > b.MonitoredCall.ExpectedArrivalTime ? 1 : -1;
	});

	const Data = {
		LineName: MonitoredVehicleJourney ? MonitoredVehicleJourney[0].PublishedLineName[0] : 'No Data',
		Destination: MonitoredVehicleJourney ? MonitoredVehicleJourney[0].DestinationName[0] : 'No Data',
		ExpectedArrivalTime: `${MonitoredVehicleJourney ? `Arriving ${moment(MonitoredVehicleJourney[0].MonitoredCall.ExpectedArrivalTime).fromNow()}` : "You're deadass out of luck"}`,
		NumberOfStopsAway: MonitoredVehicleJourney ? MonitoredVehicleJourney[0].MonitoredCall.NumberOfStopsAway : 'No Data',
	};
	if (Data) {
		res.send(Data);
	} else {
		res.send(500);
	}
});

module.exports = router;
