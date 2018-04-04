const MTD = require('../MTD/mtd_core.js');

module.exports = function(controller) {

	controller.on('slash_command', async function(bot, message) {
	
		var re = /\s*([^ ]*)\s*(.*)/;
		var userMsg = message.text;
		var msgMatch = userMsg.match(re);
		var ourCommand = msgMatch[1];
		var ourArgument = msgMatch[2];

		switch(ourCommand) {
			case 'id':
				nameToStopID(ourArgument, message);
				break;

			case 'name':
				stopIDToName(ourArgument, message);
				break;
			
			case 'bus':
				getDepartures(ourArgument, message);
				break;

			case 'help':
				bot.replyPrivate(message, helpMessage());
				break;

 
			default:
				bot.replyPrivate(message, helpMessage());
				break;
		

		return;
		};
	});

}

async function nameToStopID(ourArgument, message) {
	if (isEmpty(ourArgument))
	{
		bot.replyPrivate(message, "To find the ID of a given bus stop, use `/mtd id` followed by the name of the stop.");
		return;
	}
	var myMTD = new MTD();
	
	try {
		const stopID = await myMTD.getStopID(ourArgument);
		
		if (stopID != null) {
			const trueStopName = await myMTD.getStopName(stopID);
			var myMessage = trueStopName + " has ID: " + "*" + stopID + "*";
			bot.replyPrivate(message, myMessage);
		} else {
			var myMessage = "Stop name *" + ourArgument + "* is invalid.";
			bot.replyPrivate(message, myMessage);
		}
		
	} catch(error) {
		var myMessage = "We couldn't find the ID for your specified stop.";
		bot.replyPrivate(message, myMessage);
	}
				
}

async function stopIDToName(ourArgument, message)
{
	if (isEmpty(ourArgument))
	{
		bot.replyPrivate(message, "To find the name of a given bus stop, use `/mtd name` followed by the ID of the stop.");
		return;
	}
	var myMTD = new MTD();
	
	try {
		const stopName = await myMTD.getStopName(ourArgument);
		
		if (stopName != null) {
			var myMessage = ourArgument + " has name: " + "*" + stopName + "*";
			bot.replyPrivate(message, myMessage);
		} else {
			var myMessage = "Stop name *" + ourArgument + "* is invalid.";
			bot.replyPrivate(message, myMessage);
		}
		
	} catch(error) {
		var myMessage = "We couldn't find the name for your specified stop.";
		bot.replyPrivate(message, myMessage);
	}
			
}

async function getDepartures(ourArgument, message)
{
	if (isEmpty(ourArgument)) {
		bot.replyPrivate(message, "To find which busses are departing within the next 10 minutes, use `/mtd bus` followed by the name or ID of the stop.");
		return;
	}

	const yourStop = ourArgument;
	var myStopFlag = false;
	var stopArray = [];
	var myMTD = new MTD();

	if (isStopID(yourStop)) {
		// We've got a stop ID, so get the name of the stop

		var yourStopName = await myMTD.getStopName(yourStop);
		if (yourStopName == null) {
			bot.replyPrivate(message, "You didn't specify a valid stop ID.");
			return;
		}

		// NOTE: Uncomment the next two lines if Slack responds with a timeout message.
		
		// var myMessage = "Searching for departures from: *" + yourStopName + "* (`" + yourStop + "`)";
		// bot.replyPrivate(message, myMessage);
		var yourStopID = yourStop;

	}
	else {
		// We've got a stop name, so get the ID of the stop
		
		var yourStopID = await myMTD.getStopID(yourStop);
		if (yourStopID == null) {
			bot.replyPrivate(message, "You didn't specify a valid stop name.");
			return;
		}
	
		// Get the full stop name of the stop the user specified
		
		var yourFullStopName = await myMTD.getStopName(yourStopID);

		var myMessage = "Searching for departures from: *" + yourFullStopName + "* (`" + yourStopID + "`)";
		// bot.replyPrivate(message, myMessage);
	}

	const ourStops = await myMTD.getCurrentStops(yourStopID);
	if (ourStops == null) {
		bot.replyPrivateDelayed(message, "No departure data found for *" + yourStop + "*.");
		return;
	}

	
	for (let Stop of ourStops.departures) {
		if (Stop.expected_mins <= 10) {
		const stopName = await myMTD.getStopName(Stop.destination.stop_id);
		var expectedDate = new Date(Stop.expected);
		const humanTime = expectedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		const myAttachment = await myMTD.buildAttachment(Stop.headsign, humanTime, stopName, Stop.expected_mins);
		stopArray.push(myAttachment);
		myStopFlag = true;
		}
	}

	var yourFullStopName = await myMTD.getStopName(yourStopID);
       	var myJSON = {"text": "*Available departures from " + yourFullStopName + "*:",
                      "attachments": stopArray };
	bot.replyPrivate(message, myJSON);
	if (myStopFlag == false) {
		bot.replyPrivateDelayed(message, "No departures from *" + yourStop + "* within the next 10 minutes.");
	}

}

function isStopID(string) {
	var re = /[A-Z]{2,15}|[0-9]{2,15}/;
	var idMatch = string.match(re);
	if (idMatch != null) {
		return true;
	}
	return false;
}

function helpMessage() {
		var myMessage = "Usage:\n`/mtd id <stop name>`: Show the ID of a named bus stop\n";
		var myMessage = myMessage + "`/mtd name <stop ID>`: Show the name of a stop if you know the ID\n";
		var myMessage = myMessage + "`/mtd bus <stop name>`: Show busses departing from a stop (name or ID) within the next 10 minutes\n";
		return myMessage;
}

function isEmpty(string) {
	return (!string || 0 === string.length);
}

