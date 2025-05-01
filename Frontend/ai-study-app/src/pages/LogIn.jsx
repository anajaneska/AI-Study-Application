import { useState } from "react";
import "./styling/LogIn.css";
import { Link } from "react-router-dom";

import {useNavigate } from "react-router-dom";

function LogIn() {
  const [userInfo, setUserInfo] = useState({
    lEmail: "",
    lPassword: "",
  });
  
  const navigate = useNavigate(); // For navigation after login

  // Handling form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Send login request to backend
    fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lEmail: userInfo.lEmail,
        lPassword: userInfo.lPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // If login is successful
        } else {
          throw new Error("Invalid credentials");
        }
      })
      .then((data) => {
        alert("Login successful!");
        console.log(data); // You may handle user info or JWT token here

        // Redirect to the home or dashboard page
        navigate("/"); // Adjust based on your app's routes
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  }

  // Update userInfo state when credentials change
  function handleCredentials(identifier, value) {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [identifier]: value,
    }));
  }

  return (
    <>
      <section id="loginSection">
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <br />
          <input
            type="email"
            name="lEmail"
            onChange={(event) =>
              handleCredentials("lEmail", event.target.value)
            }
            value={userInfo.lEmail}
            placeholder="johndoe@example.com"
          />
          <br />
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="lPassword"
            onChange={(e) => handleCredentials("lPassword", e.target.value)}
            value={userInfo.lPassword}
            placeholder="Password"
          />
          <br />
          <input type="submit" value={"Sign in"} />
        </form>
        <div>
          <Link
            to="/SignUp"
            style={{ marginLeft: "4rem", textDecoration: "underline" }}
          >
            Don't have an account?
          </Link>
        </div>
      </section>
    </>
  );
}

export default LogIn;

