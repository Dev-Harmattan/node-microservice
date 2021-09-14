const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const eventHandler = (type, data) => {
  if(type === 'postCreated'){
    const {id, title} = data;
    posts[id] = {
      id, title, comments: []
    }
  }

  if(type === 'commentCreated'){
    const {id, content, postId, status} = data;
    const post = posts[postId];
    post.comments.push({id, content, status});
  }

  if(type === 'commentUpdated'){
    const {id, postId, content, status} = data;
    const post = posts[postId];

    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
})

app.post('/events', (req, res) => {
  const {type, data} = req.body;

  eventHandler(type, data);

  res.send({});
})

app.listen(4002, async () => {
  console.log('Query listening at port 4002');

  try {
    const res = await axios.get('htpp://localhost:4005/events');
    for(let event of res.data){
      const {type, data} = event;
      console.log('Processing event', type);
      eventHandler(type, data);
    }
  } catch (error) {
    console.log(error.message);
  }
})