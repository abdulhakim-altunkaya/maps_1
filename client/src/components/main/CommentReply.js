import React, { useState } from 'react';
import axios from "axios";
import "../../styles/CommentReply.css";

function CommentReply({ parentId, provinceId, onReplySent }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (name.length > 30 || text.length > 300) {
      alert("Name or Comment is too long");
      return;
    }
    if (name.length < 5 || text.length < 5) {
      alert("Name or Comment is too short");
      return;
    }
    if (name && text) {
      const date = new Date().toLocaleDateString('en-GB');
      const newReply = { provinceId, name, text, date, parentId };
      try {
        const response = await axios.post("http://localhost:5000/serversavecomment", newReply);
        alert(response.data.message);
        setName("");
        setText("");
        onReplySent();
      } catch (error) {
        console.error("Error saving reply:", error.message);
        alert("Error saving reply");
      }
    } else {
      alert("Please fill in the reply fields");
    }
  };

  return (
    <div className="reply-form-container">
      <form className="reply-form" onSubmit={handleReplySubmit}>
        <div className="form-group">
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            id='name'
            required
            placeholder='Name'
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor='text'>Reply</label>
          <textarea
            id='text'
            required
            placeholder='Reply'
            maxLength={300}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <button type='submit'>Reply</button>
      </form>
    </div>
  );
}

export default CommentReply;
