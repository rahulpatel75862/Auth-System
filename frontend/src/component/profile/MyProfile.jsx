import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../Auth/auth.css";
import "./MyProfile.css";


const MyProfile = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [role, setRole] = useState("user")
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try{
        const token = localStorage.getItem("token");
        if(!token){
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        })
        setLoading(false);
        setUserId(res.data.user._id.toString());
        setUsername(res.data.user.username);
        setEmail(res.data.user.email);
        setRole(res.data.user.role || "user");
      } catch(error){
        setError(error.response?.data?.error || error.response?.data?.message || "Failed to load profile");
      } finally{
        setLoading(false);
      }
    }
    fetchProfile();
  },[])

  const handleSave = async(e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try{
      const payload = {
        username:username.trim(),
        email:email.trim().toLowerCase()
      }
      if(password.trim().length>0){
        payload.password = password;
      }
      console.log('fetched profile data',payload);
      const token = localStorage.getItem("token");
      if(!token){
        setError("Not authenticated");
        setSaving(false);
        return;
      }
      const id = userId || JSON.parse(localStorage.getItem("user"))._id;
      const res = await axios.put(`http://localhost:5000/api/users/update/user/${id}`, payload,
      {headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`
      }}
      )
      const updatedData = res.data || res.data.user;
      localStorage.setItem("user",JSON.stringify(updatedData));
      setSuccess("Profile updated successfully");
      setPassword("");
    }catch(error){
      setError(error.response?.data?.error || error.response?.data?.message || "Failed to save profile");
    } finally{
      setSaving(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/")
  }



  if (loading) {
    return <div style={{ padding: 24 }}>Loading profile...</div>;
  }

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: 40 }}>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()||'U'}
          </div>
          <div className="profile-meta">
            <h2 style={{ margin: 0 }}>{username}</h2>
            <div className="muted">{role}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button className="btn" onClick={() => navigate("/userDashboard")}>Back</button>
            <button className="btn" style={{ marginLeft: 8 }} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <form className="profile-form">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

          <label>New password <small className="muted"> (leave blank to keep current)</small></label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn" type="submit" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <Link to={'/userDashboard'}>
            <button type="button" className="btn" onClick={() => { setPassword(""); setError(null); setSuccess(null); }}>
              Cancel
            </button>
            </Link>
          </div>

          {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
          {success && <div className="success" style={{ marginTop: 12 }}>{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
