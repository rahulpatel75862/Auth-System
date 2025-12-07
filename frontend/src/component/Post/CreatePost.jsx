import React, {useState} from 'react'
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';
import './CreatePost.css';
import '../Auth/Auth.css';

const CreatePost = () => {

  const nav = useNavigate();

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);

  const validateInputs = () => {
    if(question.trim().length===0){
      setError("Question Cannot be empty");
      return null;
    }
    if(option1.trim().length===0 || option2.trim().length===0 || option3.trim().length===0){
      setError("Atleast two options are required");
      return null;
    }
    const options = [option1, option2, option3].map(s=>s.toLowerCase().trim());
    const optionSet = new Set(options);
    if(optionSet.size !== options.length){
      setError("Options must be unique");
      return null;
    }
    return {question: question.trim(), option1: option1.trim(), option2: option2.trim(), option3: option3.trim()};
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError(null);
    try{
      const payload = validateInputs();
      console.log('hello', payload);
      if(!payload){
        return;
      }
      setSaving(false);
      const token = localStorage.getItem("token");
      if(!token){
        setError("Not authenticated");
        return;
      }
      const res = await axios.post('http://localhost:5000/api/posts/create/post', payload, {
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`
        }
      })
      setSuccess("Post Created Successfully");
      setQuestion(""); 
      setOption1(""); 
      setOption2(""); 
      setOption3("");
      setTimeout(() => {
        nav('/my/posts')
      },900)
    } catch(error){
      setError(error?.response?.data?.error || error?.response?.data?.message || "Failed to create a post");
    } finally{
      setSaving(false);
    }
  }



  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: 36 }}>
      <div className="create-card">
        <div className="create-header">
          <h2 style={{ margin: 0 }}>Create Question</h2>
          <div>
            <Link to="/" className="btn" style={{ marginRight: 8 }}>Back</Link>
            <Link to="/posts" className="btn" style={{ background: "#fff", color: "#374151", border: "1px solid #e6e9ef" }}>View Posts</Link>
          </div>
        </div>

        <form className="create-form">
          <label>Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Write the question here..."
            rows={3}
          />

          <div className="options-grid">
            <div>
              <label>Option 1</label>
              <input value={option1} onChange={(e) => setOption1(e.target.value)} />
            </div>
            <div>
              <label>Option 2</label>
              <input value={option2} onChange={(e) => setOption2(e.target.value)} />
            </div>
            <div>
              <label>Option 3</label>
              <input value={option3} onChange={(e) => setOption3(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn" type="submit" disabled={saving} onClick={handleSubmit}>
              {saving ? "Creating..." : "Create Question"}
            </button>

            <button type="button" className="btn" onClick={() => {
              setQuestion(""); setOption1(""); setOption2(""); setOption3("");
              setError(null); setSuccess(null);
            }}>
              Reset
            </button>
          </div>

          {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
          {success && <div className="success" style={{ marginTop: 12 }}>{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;