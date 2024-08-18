import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../styles/CommentDisplay.css";
import Comment from "./Comment";
import CommentReply from "./CommentReply";

function CommentDisplay() {
  const { provinceId } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [isReply, setIsReply] = useState(true);
  //repliedCommentId is used to open reply box only under the replied comment. 
  //Otherwise replyBox will appear under all comments. We will not use this value for prop drilling,
  //because we dont need and also it is not updating fast enough to be sent to CommentReply component
  const [repliedCommentId, setRepliedCommentId] = useState("")
  const [isCommentReply, setIsCommentReply] = useState(false);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/servergetcomments/${provinceId}`);
        const fetchedComments = response.data; // hold the fetched data in a variable
        setComments(fetchedComments); // set state for later re-use in the component
        const replies = fetchedComments.filter(comment => comment.parent_id !== null); // filter directly on fetched data
        setReplies(replies); // set filtered replies to state if needed elsewhere
        //console.log(replies);
      } catch (error) {
          console.log("Error fetching comments:", error.message);
          setError("Yorumlar Database'den alınmadı")
      } 
    }
    getComments();
  }, [provinceId]);

  const replyComment = async (replyId) => {
    setRepliedCommentId(replyId);
    console.log(replyId);
    try {
      setIsReply(false)
      setIsCommentReply(true);
    } catch (error) {
      console.log(error.message);
    }
  }
    
  return (
    <>
      { isReply ? <Comment /> : <div></div> }
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
                    reply.parent_id === comment.id ? 
                        <div key={index}
                          style={{paddingLeft:"20px", fontFamily: "Kanit", textAlign: "left !important"}}>
                          <span>{reply.comment}</span> 
                        </div>
                      : 
                        <></>
                  ))}
                  <button className='replyCommentBtn' onClick={() => replyComment(comment.id)}>Cevapla</button>
                  { isCommentReply ? 
                      repliedCommentId === comment.id ?
                          <CommentReply commentId2={comment.id} /> 
                        :
                          <></>
                      :
                      <></>
                  }
                </div>
            </div>
        ))}
      </div>
    </>

  )
}

export default CommentDisplay;