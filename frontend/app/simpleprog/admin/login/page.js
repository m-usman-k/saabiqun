'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${API_URL}/api/auth/login`, 
        new URLSearchParams({ username: formData.username, password: formData.password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      localStorage.setItem("token", resp.data.access_token);
      localStorage.setItem("user", JSON.stringify({ username: formData.username, is_admin: resp.data.is_admin }));
      router.push("/");
      router.refresh();
    } catch {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div className="container page-fade-in">
      <div className="form-container">
        <h2>Sign In to Saabiqun</h2>
        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>Login</button>
        </form>
      </div>
    </div>
  );
}
