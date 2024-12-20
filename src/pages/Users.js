import React, { useEffect, useState } from "react";
import axios from "axios";
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `https://reqres.in/api/users?page=${page}`
      );
      setUsers(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, updatedDetails);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...updatedDetails } : user
        )
      );
      setEditingUser(null);
      setSuccessMessage("User details updated successfully!");
    } catch (err) {
      console.error("Failed to update user.");
    }
  };

  const handleDelete = (id) => {
    try {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setSuccessMessage("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user.");
    }
  };

  const handleLogout = () => {
    // console.log("User logged out.");
    localStorage.removeItem("token");
    alert("You have been logged out.");
    window.location.href = "/";
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="container">
      <div className="header">
        <h1>Users</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div className="user-card" key={user.id}>
              <img src={user.avatar} alt={`${user.first_name}'s avatar`} />
              <h3>{user.first_name} {user.last_name}</h3>
              <p>{user.email}</p>
              <button onClick={() => setEditingUser(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p className="no-results">No users found.</p>
        )}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {editingUser && (
        <div className="edit-modal">
          <h3>Edit User</h3>
          <input
            type="text"
            placeholder="First Name"
            defaultValue={editingUser.first_name}
            onChange={(e) =>
              setUpdatedDetails((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            defaultValue={editingUser.last_name}
            onChange={(e) =>
              setUpdatedDetails((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
          />
          <input
            type="email"
            placeholder="Email"
            defaultValue={editingUser.email}
            onChange={(e) =>
              setUpdatedDetails((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <button onClick={() => handleEdit(editingUser.id)}>Save</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Users;
