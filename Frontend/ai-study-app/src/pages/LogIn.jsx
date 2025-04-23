import { useState } from "react";
import "./styling/LogIn.css";
import { Link } from "react-router-dom";

function LogIn() {
  // const [lEmail, setLEmail] = useState("");
  // const [lPassword, setLPassword] = useState("");

  const [userInfo, setUserInfo] = useState({
    lEmail: "",
    lPassword: "",
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
