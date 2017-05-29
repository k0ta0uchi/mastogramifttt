# MastGramIFTTT

Instagram and Mastodon bypass for IFTTT.

## How to use
### On your server
Exec `node app.js` to set your instance url or domain.

Follow the instructions and get access_token.
(It will be saved as plain text, so be carefull.)

Exec `node app.js` again and your bypass server will be ready.

### Create IFTTT recipe
Go to [IFTTT](https://ifttt.com/create/).

For +this, just select "Instagram".

For +that, choose "Maker Webhooks".
Click on "Make a web request".
Place URL for your server.
Select POST for Method.
Select "application/json" for Content Type.

For Body, it will be like this:
`
{"status": "{{Caption}} {{Url}}", "imageUrl": "{{SourceUrl}}"}
`
({{Url}} is a link to Instagram's post, so delete it if unneeded.)
