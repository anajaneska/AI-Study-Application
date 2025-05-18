import { useState } from "react";
import "./styling/SignUp.css";
import { Link } from "react-router-dom";
import { createUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("User info:", userInfo);
      await createUser(userInfo);
      alert("User registered");
      navigate("/logIn");
    }
    catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };


  function handleCredentials(identifier, value) {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [identifier]: value,
    }));
  }

  return (
    <>
      <section id="signupSection">
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <br />
          <input
            type="text"
            name="name"
            onChange={(e) => handleCredentials("name", e.target.value)}
            value={userInfo.name}
            placeholder="John"
          />
          <br />
          <label>Surname:</label>
          <br />
          <input
            type="text"
            name="surname"
            onChange={(e) => handleCredentials("surname", e.target.value)}
            value={userInfo.surname}
            placeholder="Doe"
          />
          <br />
          <label>Email:</label>
          <br />
          <input
            type="email"
            name="email"
            onChange={(e) => handleCredentials("email", e.target.value)}
            value={userInfo.email}
            placeholder="johndoe@example.com"
          />
          <br />
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            onChange={(e) => handleCredentials("password", e.target.value)}
            value={userInfo.password}
            placeholder="password"
          />
          <br />
          <input type="submit" value={"Sign up"} />
        </form>
        <div style={{ marginLeft: "2rem" }}>
          Already have an account?
          <Link
            to="/LogIn"
            style={{ textDecoration: "underline", marginLeft: "5px" }}
          >
            Sign in
          </Link>
        </div>
      </section>
    </>
  );
}

export default SignUp;
