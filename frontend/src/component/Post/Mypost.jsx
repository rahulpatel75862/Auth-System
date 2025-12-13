import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./MyPost.css";
import "../Auth/Auth.css";

const API_URL = "http://localhost:5000/api";

const MyPost = () => {
  const nav = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const currentUser = useMemo (() => {
    try{
      return JSON.parse(localStorage.getItem("user"));
    } catch(error){
      return null;
    }
  })

  useEffect(() => {
    const fetchUserData = async() => {
      try{
        setLoading(true);
        setErr(null);
        const token = localStorage.getItem("token");
        const res = await axios.get('`${API_URL}/auth/me`', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(res);
      } catch(error){
        setErr(response?.data?.error||"Failed to fetch user data");
      }
    }
    fetchUserData()
  }, [])

  console.log("user data", user);

  const userId = currentUser?.id || currentUser?._id || null;
  const token = localStorage.getItem("token") || null;
  console.log("current user", currentUser);
  
  // useEffect(() => {
  //   const fetchPostData = async() => {
  //     const res = await axios.get(`http://localhost:5000/api/posts/get/post/${userId}`, {
  //       headers:{
  //         "Content-Type" : "application/json",
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     console.log("sing user post",res.data);
  //   }
  //   fetchPostData()
  // }, [userId, token])

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (err) return <div style={{ padding: 20, color: "crimson" }}>{err}</div>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", padding: 12 }}>
      <div className="mp-header">
        <h2>My Posts</h2>
        <div>
          <Link to="/create" className="btn">
            Create New
          </Link>
          <Link to="/posts" className="btn" style={{ marginLeft: 8 }}>
            View All Posts
          </Link>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="mp-controls">
        <input
          className="mp-search"
          placeholder="Search your questions..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <select value={pageSize} onChange={(e) => setPageSize(+e.target.value)}>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="10">10</option>
        </select>
      </div>

      {/* Posts list */}
      <div className="mp-list">
        <div key={post._id} className="mp-card">
          <h3 className="mp-title"></h3>

          <div className="mp-options">
            <div>A. </div>
            <div>B. </div>
            <div>C. </div>
          </div>

          <div className="mp-actions">
            <Link to={``} className="mp-link">
              View
            </Link>
            <Link to={``} className="mp-link">
              Edit
            </Link>
            <button
              className="mp-delete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mp-pagination">
        <button
          className="mp-pagebtn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="mp-pagebtn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyPost;
