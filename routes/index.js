var express = require('express');
var router = express.Router();
var request = require('request');

var token = "EAAVUOFvmWt4BABZA6SRsnvbnqZARCPopSM0Ayryd9GwJX284ZBZA1ZBF7x7ZA6nE5XqZAW1bGLSxYG4nzCn8bZBCpUb4kGGQXH0oHW1IsSxA0hZBgf9bEY9llfjtmA9RiLFfcRhZCWkKgdn0sGgYMz80N6rFbPKnLGDOJ3eaH8irRn3gZDZD"

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'asdgfdhjgjhlkhjhgfd') {
    console.log("hub challenge OK")
    res.send(req.query['hub.challenge']);
  } else {
    console.log("Wrong validation token: " + req.query['hub.verify_token'])
    res.send('Error, wrong validation token');
  }
});

router.post('/webhook/', function (req, res) {

  console.log("received messages");

  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text
      console.log("echoing " + text);
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
    }
  }
  res.sendStatus(200)
})


module.exports = router;
