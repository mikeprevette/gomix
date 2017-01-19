# Conditional IFTTT Triggers with Persistence
Use this app in conjunction with the IFTTT Maker service to trigger one (or more) IFTTT services when certain conditions are met, making it more like if-this-and-this-then-that.

In this example, when the iOS location service notices that we're close to home AND if we've been notified that the sun has set, then we notify IFTTT to turn on the lights.

It uses NeDB for persistence to store notifications about sunset.

![](https://cdn.gomix.com/4761356a-9369-4e79-9d1e-a8306e8c00b5%2FifttMany.png)

# Getting Started
Create a trigger that notifies your Gomix app, which checks whether conditions are met and if they are, then it triggers one or more services in IFTTT. For step-by-step instructions, see `SETUP.md`.