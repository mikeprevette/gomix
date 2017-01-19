There are three stages to setting up conditional triggers in IFTTT:

# Stage 1: Triggering your Gomix app:

Create a new applet by selecting ‘New Applet’

For the ‘if’ condition, select whatever service notification you want to initially trigger your Gomix app. I’m going to use the ‘iOS Location’ with the ‘you enter an area’ action, so I can trigger things as I'm getting close to home.

For the ‘then’ condition, search and select Maker, and use the ‘Make a web request’ action. Set the URL to your Gomix project URL - this has the format of ‘`https://project-name.gomix.me/`’, so in this example I used ‘https://conditional-ifttt-triggers.gomix.me’. Set the Method to ‘`POST`’ and Content Type to ‘`application/json`’. You don’t need to set anything in the ‘Body’.

e.g. ![](https://cdn.gomix.com/4761356a-9369-4e79-9d1e-a8306e8c00b5%2FiftttWebRequestSettings.png)

Now when that service triggers, Gomix will receive a request. You can create additional applets if you want your app to handle multiple requests. In our example, we have used two: one for our location using the iOS location service, and a second one to get notified about sunset via the Weather Underground service.

Now you need to tell your Gomix app which services to trigger in IFTTT.

# Stage 2: Setup your Gomix app to trigger multiple services:

From your [Maker settings page](https://ifttt.com/services/maker/settings), copy and paste the `URL` value for the `IFTTT_MAKER_URL` variable into the `.env` file in your Gomix project.

![](https://cdn.gomix.com/4761356a-9369-4e79-9d1e-a8306e8c00b5%2FiftttMakerURL.png)

Then, for each service that you want your Gomix app to trigger you need to create a new applet in IFTTT. For each one:

Create a new applet by selecting ‘New Applet’

For the ‘if’ condition, search and select Maker, and use the ‘Receive a web request’ action. Set an event name, and set that event name against the `IFTTT_SERVICE_X` variable in the `.env` file in your Gomix project. E.g. if I created an event name called ‘lights_on’, I would set `IFTTT_SERVICE_1=lights_on` in `.env`.

For the ‘then’ condition, search and select whatever service you want to trigger, such as turning on your lights, turning off a plug, sending an email etc.

And click ‘finish’ to create the applet.

Repeat for each service. By the end your `.env` file will look a bit like:
![](https://cdn.gomix.com/4761356a-9369-4e79-9d1e-a8306e8c00b5%2FiftttEnvFile.png)

# Stage 3: Edit the conditions

Conditions are enforced by the code in our Gomix app. In this example, we have two routes to handle the two different POST requests we receive. One sends stuff to `/home` and the other to `/sunset`. These are handled in `server.js`.

Requests to `/sunset` tell the app that the sun has set. We store them in the database to refer to later.

Requests to `/home` tell the app that we're close to home. So we check to see whether our conditions are met. The implementation of the conditions is done so in `checkConditions()` also in `server.js`. In our example they are, whether the sun has set, so we look in the database to see whether we've been told the sun has set today. And we also check whether we're close to home. If both conditions are met then we trigger the services in IFTTT.

# The Result

Upon receiving a request your Gomix app will check whether conditions are met, and if so, it will trigger the multiple other services in IFTTT. So in this example, when I get close to home, if it is after sunset, then IFTTT will turn my lights on.