import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../styles/CommentDisplay.css";
import Comment from "./Comment";

function CommentDisplay() {
  const { provinceId } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [repliedCommentId, setRepliedCommentId] = useState("");
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/servergetcomments/${provinceId}`);
        const fetchedComments = response.data; // hold the fetched data in a variable
        setComments(fetchedComments); // set state for later re-use in the component
        const replies = fetchedComments.filter(comment => comment.parent_id !== null); // filter directly on fetched data
        setReplies(replies); // set filtered replies to state if needed elsewhere
        console.log(replies); // Now this will log the correct, expected data
      } catch (error) {
          console.log("Error fetching comments:", error.message);
          setError("Yorumlar Database'den alınmadı")
      } 
    }
    getComments();
  }, [provinceId]);

  const replyComment = async (replyId) => {
    try {
      setRepliedCommentId(replyId);
      setIsReply(true);
    } catch (error) {
      console.log(error.message);
    }
  }
    
  return (
    <>
      { isReply ? <div></div> : <Comment /> }
      <div className="comments-list">
        {error ? <div className="error-message">{error}</div> : <></>}
        {comments.filter(comment => comment.parent_id === null).map( (comment) => (
            <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-name">{comment.name}</span>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <div className='comment-body'>
                  <div className="comment-text">{comment.comment}</div>
                  {replies.map( (reply, index) => (
                    replies.parent_id === comment.id ? 
                        <div className="replyDiv" key={index}>
                          <span>{reply.comment}</span> 
                        </div>
                      : 
                        <></>
                  ))}
                  <button className='replyCommentBtn' onClick={() => replyComment(comment.id)}>Cevapla</button>
                  { isReply ? 
                    repliedCommentId === comment.id ? 
                      <Comment /> 
                    :
                      <></>
                  : 
                    <div></div> 
                  }
                </div>
            </div>
        ))}
        {replies.map((reply, index) => (
          <div key={index}>{reply.comment}</div>
        ))}
      </div>
    </>

  )
}

export default CommentDisplay;