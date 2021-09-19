const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
app.use(express.json())
app.use(cors());

app.post('/events', async (req, res) => {
  const {type, data} = req.body;
  console.log(type)
  if(type === 'commentCreated'){
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    console.log(status);
    await axios.post('http://event-bus-svr:4005/events', {
      type: 'commentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status
      }
    })
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('moderation runnng on port 4003');
});