import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import "../Auth/Auth.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUserData = async() => {
      setLoading(true);
      setErr(null);
      try{
        const token = localStorage.getItem("token");
        if(!token){
          setErr("Not authenticated");
          return;
        }
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers:{
            "Content-Type":'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        setUser(res.data.user);
      } catch(error){
        setErr(error.response.data.error || error.response.data.message || "Failed to fetch user data");
      } finally{
        setLoading(false);
      }
    }
    fetchUserData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        dropdownRef.current.classList.remove("uc-open");
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const toggleMenu = (e) => {
    e.stopPropagation();
    dropdownRef.current?.classList.toggle("uc-open");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/')
  }

  if(loading) return <div style={{ padding: 24 }}>Loading Dashboard.....</div>
  if(err) return <div style={{ padding: 24, color: "crimson" }}>{err}</div>
 

  return (
    <div>
      {/* top header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottom: "1px solid #eee", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <span style={{ color: "#6b7280" }}>— Welcome back</span>
        </div>

        {/* user profile dropdown */}
        <div ref={dropdownRef}  className="uc-dropdown">
          <button className="uc-trigger" onClick={toggleMenu}>
            <div className="uc-avatar">
            {user.username.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()||"U"}
            </div>
            <div style={{ marginLeft: 8, textAlign: "left" }}>
              <div style={{ fontWeight: 700 }}>{user.username}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{user.role}</div>
            </div>
          </button>

          <div className="uc-menu">
            <Link to="/my/profile" className="uc-item" onClick={() => dropdownRef.current && dropdownRef.current.classList.remove("uc-open")}>
              Profile
            </Link>
            <button onClick={handleLogout} className="uc-item uc-logout" >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* body */}
      <main style={{ maxWidth: 1100, margin: "24px auto", padding: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <Link to="/create/post" className="btn" style={{ textDecoration: "none" }}>
            Create Post
          </Link>

          <Link to="/all/posts" className="btn" style={{ textDecoration: "none", background: "#fff", color: "#334155", border: "1px solid #e6e9ef" }}>
            View Posts
          </Link>
        </div>

        <section style={{ background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 6px 18px rgba(16,24,40,0.04)" }}>
          <h3 style={{ marginTop: 0 }}>Your quick actions</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/all/posts" className="small-action">Browse all questions</Link>
            <Link to="/my/posts" className="small-action">My posts</Link>
            <Link to="/my/profile" className="small-action">Edit profile</Link>
          </div>

          <div style={{ marginTop: 18, color: "#6b7280" }}>
            <strong>Note:</strong> These links assume you have the corresponding routes (`/create`, `/posts`, `/my-posts`, `/profile`) wired. If not, replace them or create simple placeholder pages.
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
