import React, { useState, useEffect, useMemo } from "react";
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

  const filtered = (list, query) => {
    if (!query || !query.trim().length === 0) {
      return list;
    }
    const q = query.trim().toLowerCase();
    return list.filter((l) => String(l.question).toLowerCase().includes(q));
  };
  const filteredPosts = filtered(posts, query);
  const sorts = (list, sortOrder) => {
    const copy = list.slice();
    copy.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
    return copy;
  };
  const sortedPosts = sorts(filteredPosts, sort);
  const paginated = (list, page, pageSize) => {
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pagedItems = list.slice(start, end);
    return { pagedItems, totalPages, total };
  };

  const { pagedItems, totalPages, total } = paginated(
    sortedPosts,
    page,
    pageSize
  );
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    } else if (page < 1) {
      setPage(1);
    }
  }, [page, totalPages]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErr("Not Authenticated");
        return;
      }
      await axios.delete(`http://localhost:5000/api/posts/delete/post/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((p) => p.filter((post) => post._id !== id));
    } catch (error) {
      setErr(
        response?.data?.error ||
          response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  });
  const userId = currentUser?.id || null;
  const isAdmin = currentUser?.role === "admin";

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
        {loading ? (
          <p>Loading Posts.....</p>
        ) : err ? (
          <p style={{ color: "red" }}>{err}</p>
        ) : pagedItems.length === 0 ? (
          <p>No Posts found</p>
        ) : (
          pagedItems.map((p) => (
            <article key={p._id} className="vp-card">
              <header className="vp-card-head">
                <h3 className="vp-title">{p.question}</h3>
                <div className="vp-meta">
                  <span>{p.author?.username}</span>
                  <span> • </span>
                  <span>{p.createdAt}</span>
                </div>
              </header>

              <div className="vp-body">
                <div className="vp-options">
                  <div className="opt">A. {p.option1}</div>
                  <div className="opt">B. {p.option2}</div>
                  <div className="opt">C. {p.option3}</div>
                </div>
              </div>

              <footer className="vp-actions">
                <Link className="vp-link">View</Link>

                {/* show edit/delete if user is author or admin */}
                {(isAdmin ||
                  String(userId) ===
                    String(p.author?._id || p.author)) && (
                  <>
                    <Link to={`/edit/${p._id}`} className="vp-link">
                      Edit
                    </Link>
                    <button
                      className="vp-delete"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </footer>
            </article>
          ))
        )}
      </div>

      {/* pagination */}
      <div className="vp-pagination">
        <div>
          Page {page} of {totalPages} of total {total} posts
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="vp-pagebtn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            className="vp-pagebtn"
            onClick={() => setPage((p) => Math.min(totalPages, 1 + p))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
