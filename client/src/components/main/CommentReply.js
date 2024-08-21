import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../styles/Comment.css";

function CommentReply({commentId2}) {
    const { provinceId } = useParams();
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    
    const handleSubmit = async (e) => {
        if (name.length > 30 || text.length > 300) {
            alert("İsim veya Yorum alanları çok uzun");
            return;
        }
        if(name.length < 5 || text.length < 5) {
            alert("İsim veya yorum alanları çok kısa");
            return;
        }
        e.preventDefault();
        if (name && text) {
            const date = new Date().toLocaleDateString('en-GB');
            const newComment = {
                provinceId: Number(provinceId), // Ensure provinceId is a number
                name,
                text,
                date,
                commentId: Number(commentId2) // Ensure commentId is a number
            }
            try {
                const response = await axios.post("http://localhost:5000/serversavecommentreply", newComment)
                alert(response.data.message);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    alert("Yeni cevap için biraz bekleyiniz.");
                } else {
                    alert("An error occurred while saving your comment. Please try again later.");
                } 
            } finally {
                setName("");
                setText("");
            }
        } else {
            alert("Please fill in comment fields");
        } 
    }
    return (
        <div className="comment-container">
            <form className="comment-form" onSubmit={handleSubmit}> 
                <div className="form-group">
                    <label htmlFor='name'>İsim ve Soyisim</label>
                    <input type='text' id='name' required placeholder='İsim ve Soyisim' maxLength={30} 
                        value={name}
                        onChange={ (e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor='text'>Yorum</label>
                    <textarea type='text' id='text' required placeholder='Yorum' maxLength={300}
                        value={text}
                        onChange={ (e) => setText(e.target.value)} > 
                    </textarea>
                </div>
                <button type='submit'>Kaydet</button>
            </form>
        </div>
    )
}

export default CommentReply;