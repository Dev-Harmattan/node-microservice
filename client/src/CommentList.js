const CommentList = ({comments}) => {
  
  let renderedComments;

  if(comments.length === 0 ){
    renderedComments = ''
  }

  if(comments.length !== 0){
    renderedComments = comments.map((comment) => {
      let content;
      if(comment.status === 'pending'){
        content = 'Comment waiting for moderation'
      }
      if(comment.status === 'approved'){
        content = comment.content;
      }
      if(comment.status === 'rejected'){
        content = 'This was rejected comment rejected';
      }
      return <li key={comment.id}>{content}</li>;
    });
  }

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
