import React from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = React.useState<any>();
  const [formData, setFormData] = React.useState<any>();
  React.useEffect(() => {
    const fetchUsers = async () => {
      const users = await axios.get("http://localhost:8000/api/users");
      setUsers(() => users.data);
    };
    fetchUsers();
  }, []);
  console.log(users);

  const handleFormChange = (e: any) => {
    setFormData(() => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async (e: any) => {
    await axios.post("http://localhost:8000/api/users", formData);
  };

  if (!users) return <div>loading</div>;

  const a = users.map((user: any) => (
    <div key={user.id}>
      {user.username} | {user.email}
    </div>
  ));

  return (
    <React.Fragment>
      <div>Create New User</div>
      <form className="create-user">
        <input
          type="text"
          name="firstName"
          placeholder="first name"
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="last name"
          onChange={handleFormChange}
        />
        <input
          type="username"
          name="username"
          placeholder="username"
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={handleFormChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleFormChange}
        />
        <button type="button" onClick={handleFormSubmit}>
          Submit
        </button>
      </form>
      <hr></hr>
      <div>Current Users: </div>
      {a}
    </React.Fragment>
  );
}

export default App;
