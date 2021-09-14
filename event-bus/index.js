const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const events = [];

app.get('/events', (req, res) => {
  res.send(events);
})

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);

  axios.post('http://localhost:4000/events', event).catch(error => console.log(error.message));
  axios.post('http://localhost:4001/events', event).catch(error => console.log(error.message));
  axios.post('http://localhost:4002/events', event).catch(error => console.log(error.message));
  axios.post('http://localhost:4003/events', event).catch(error => console.log(error.message));

  res.send({status: 'OK'});
})

app.listen(4005, () => {
  console.log('Event bus listen at port 4005');
})