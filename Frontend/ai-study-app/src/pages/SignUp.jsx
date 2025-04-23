import { useState } from "react";
import "./styling/SignUp.css";
import { Link } from "react-router-dom";

function SignUp() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    surname: "",
    rEmail: "",
    rPassword: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    console.log(userInfo);
  }

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
            name="rEmail"
            onChange={(e) => handleCredentials("rEmail", e.target.value)}
            value={userInfo.rEmail}
            placeholder="johndoe@example.com"
          />
          <br />
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="rPassword"
            onChange={(e) => handleCredentials("rPassword", e.target.value)}
            value={userInfo.rPassword}
            placeholder="Password"
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
