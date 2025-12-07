import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AllPosts.css";
import "../Auth/Auth.css";

const AllPosts = () => {
  const nav = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setErr(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErr("Not authenticated");
          return;
        }
        const res = await axios.get(
          "http://localhost:5000/api/posts/get/all/posts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(res.data);
      } catch (error) {
        setErr(
          error.response.data.error ||
            error.response.data.message ||
            "Failed to fetch posts"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  console.log('Fetched Posts:', posts)
  console.log('question', posts.map(p=>p.question));
  return (
    <div style={{ maxWidth: 1100, margin: "18px auto", padding: 12 }}>
      <div className="vp-controls">
        <div>
          <input
            className="vp-search"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label className="vp-label">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <label className="vp-label">Per page</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
        </div>
      </div>

      <div className="vp-list">
        <article className="vp-card">
          <header className="vp-card-head">
            <h3 className="vp-title"></h3>
            <div className="vp-meta">
              <span></span>
              <span> • </span>
              <span></span>
            </div>
          </header>

          <div className="vp-body">
            <div className="vp-options">
              <div className="opt">A. </div>
              <div className="opt">B. </div>
              <div className="opt">C. </div>
              <div className="opt">D. </div>
            </div>
          </div>

          <footer className="vp-actions">
            <Link className="vp-link">View</Link>

            {/* show edit/delete if user is author or admin */}
            <>
              <Link className="vp-link">Edit</Link>
              <button className="vp-delete">Delete</button>
            </>
          </footer>
        </article>
      </div>

      {/* pagination */}
      <div className="vp-pagination">
        <div></div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="vp-pagebtn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <button className="vp-pagebtn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
