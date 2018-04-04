# MTDBot: Integrating the MTD with Slack

MTDBot is a Slack bot to integrate the [Champaign-Urbana Mass Transit District](https://www.cumtd.com/) API
to enable Slack users to receive real-time bus departure information via a slash command.

### Theory of Operation
MTDBot utilizes the [Botkit](https://github.com/howdyai/botkit) framework running under Node.js to talk to both the
Slack servers as well as the [CUMTD API](https://developer.cumtd.com/). 

Currently, MTDBot only responds to slash command events. But, the core communication code is abstracted into the 'MTD' class (MTD/mtd.js) so other interaction types (conversational et al) could be easily added if desired.

These are the current commands the bot responds to:

`/mtd id <stop name>`: Show the ID of a given named stop.

`/mtd name <stop ID>`: Show the name of a given stop based on its ID.

`/mtd bus <stop name>`: Show the arrivals at a given stop within the next 10 minutes.

### Installation

#### Install MTDBot

Clone this repository using Git:

`git clone https://git.ncsa.illinois.edu/dcarmich/MTDBot.git`

Install dependencies, including [Botkit](https://github.com/howdyai/botkit):

```
cd MTDBot
npm install
```

#### Set up your Slack Application 
Once you have cloned the MTDBot repository and set it up, the next thing you will want to do is set up a new Slack application via the [Slack developer portal](https://api.slack.com/). This is a multi-step process, but only takes a few minutes. 

* [Read this step-by-step guide](https://github.com/howdyai/botkit/blob/master/docs/slack-events-api.md) to make sure everything is set up. 

Update the `.env` file with your newly acquired tokens.

Launch MTDBot by typing:

`node .`

Now, visit MTDBot's login page: http://localhost:3000/login

# About MTDBot

MTDBot was developed by [Douglas Carmichael](mailto:dcarmich@illinois.edu) based on the `botkit-starter-slack` sample code in the [Botkit](https//github.com/howdyai/botkit) distribution.

# About Botkit

Botkit is a product of [Howdy](https://howdy.ai) and made in Austin, TX with the help of a worldwide community of botheads.
