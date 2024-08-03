import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../styles/Comment.css";

function Comment() {
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
            const newComment = {provinceId, name, text, date};
            console.log(newComment);
            setName("");
            setText("");
            const response = await axios.post("http://localhost:5000/serversavecomment", newComment)
            alert(response.data.message);
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

export default Comment;