var ourAxios = require('axios');

// NOTE: Insert your CUMTD API key below.
// NOTE: You can receive a key at: https://developer.cumtd.com/
//
var mtd_key = 'insert.your.MTD.API.key.here';
class MTD {

	async getStopID(stop_name) {
		let response;
	try {

		var stop_url = 'https://developer.cumtd.com/api/v2.2/json/GetStopsBySearch';
		const response = await ourAxios.get(stop_url, {
				params: {
					key: mtd_key,
					query: stop_name,
					}
				});
				if (response.data.stops.length) {
					return response.data.stops[0].stop_id;
				} else {
					return null;
				}

				} catch (error) {
					const myErrorMsg = error.errno;
					throw new Error(myErrorMsg);
				}
		if (!response)
		{
			const myErrorMsg = "No stop ID found.";
			var error = new Error(myErrorMsg);
			throw error;
		}
		return response;
	}

	async getStopName(our_stop_id) {
		let response;
	try {

		var stop_url = 'https://developer.cumtd.com/api/v2.2/json/GetStop';
		const response = await ourAxios.get(stop_url, {
				params: {
					key: mtd_key,
					stop_id: our_stop_id,
					}
				});
				if (response.data.stops.length) {
					return response.data.stops[0].stop_name;
				} else {
					return null;
				}

				} catch (error) {
					const myErrorMsg = error.errno;
					throw new Error(myErrorMsg);
				}
		if (!response)
		{
			const myErrorMsg = "No stop name found.";
			var error = new Error(myErrorMsg);
			throw error;
		}
		return response;
	}

	async getCurrentStops(stop_id) {
		let response;
	try {
		var stop_url = 'https://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop';
		const response = await ourAxios.get(stop_url, {
				params: {
					key: mtd_key,
					stop_id: stop_id,
					}
				});
				if (response.data.departures.length) {
					return response.data;
				} else {
			
					return null;
				}

				} catch (error) {
					const myErrorMsg = error.errno;
					throw new Error(myErrorMsg);
				}
		if (!response)
		{
			const myErrorMsg = "No stops found.";
			var error = new Error(myErrorMsg);
			throw error;
		}
		return response;
	}
		

async buildAttachment(headsign, humanTime, destStopName, expected_mins)
{
	var myAttachment = {"pretext": "*" + headsign + "*", 
		"text": "*Arrival*: " + humanTime + " (*" + expected_mins + "* minutes)\n*Destination*: " + destStopName,
		"mrkdwn_in": ["text", "pretext", "fields"]};
	
	return myAttachment;
 }
}
module.exports = MTD;
