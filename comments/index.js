const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios =  require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-svr:4005/events', {
    type: 'commentCreated',
    data: {
      id: commentId,
      postId: req.params.id,
      content,
      status: 'pending'
    }
  })

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const {type, data} = req.body;

  if(type === 'commentModerated') {
    const {id, postId, content, status} = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id );
    comment.status = status;

    await axios.post('http://event-bus-svr:4005/events', {
      type: 'commentUpdated',
      data: {
        id: id,
        content: content,
        postId: postId,
        status: status
      }
    })
  }

  res.send({})

})

app.listen(4001, () => {
  console.log('Listening on  port: 4001');
});
