import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../styles/CommentDisplay.css";
import Comment from "./Comment";
import CommentReply from "./CommentReply";

function CommentDisplay() {
  const { provinceId } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [isReply, setIsReply] = useState(false); 
  const [repliedCommentId, setRepliedCommentId] = useState("");

  useEffect(() => {
    const getComments = async () => {
      try {
          const response = await axios.get(`http://localhost:5000/servergetcomments/${provinceId}`);
          setComments(response.data);
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

  const renderComments = (comments) => {
    return comments
      .filter(comment => comment.parent_id === null) // Filter out top-level comments
      .map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-name">{comment.name}</span>
            <span className="comment-date">{comment.date}</span>
          </div>
          <div className='comment-body'>
            <div className="comment-text">{comment.comment}</div>
            <button className='replyCommentBtn' onClick={() => replyComment(comment.id)}>Cevapla</button>
            {isReply && repliedCommentId === comment.id && (
              <CommentReply commentId={repliedCommentId} />
            )}
            {renderReplies(comment.id)}
          </div>
        </div>
      ));
  }

  const renderReplies = (parentId) => {
    return comments
      .filter(comment => comment.parent_id === parentId) // Filter replies to the given parent comment
      .map(reply => (
        <div key={reply.id} className="reply-item">
          <div className="reply-header">
            <span className="reply-name">{reply.name}</span>
            <span className="reply-date">{reply.date}</span>
          </div>
          <div className='reply-body'>
            <div className="reply-text">{reply.comment}</div>
            {renderReplies(reply.id)} {/* Recursively render nested replies */}
          </div>
        </div>
      ));
  }
    
  return (
    <>
      {isReply ? <div></div> : <Comment />}
      <div className="comments-list">
        {error && <div className="error-message">{error}</div>}
        {renderComments(comments)}
      </div>
    </>
  );
}

export default CommentDisplay;
