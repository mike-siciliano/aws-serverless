import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

type LoginProps = {
  authService: AuthService;
  handleNameChange: Function;
};

export function Login ({ authService , handleNameChange}: LoginProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (username && password) {
      const loginResponse = await authService.login(username, password);
      handleNameChange(loginResponse);

      if (loginResponse) {
        setLoginSuccess(true);
      } else {
        setErrorMessage("Invalid username or password ");
      }
    } else {
      setErrorMessage("Username and password required!");
    }
  };

  function renderLoginResult() {
    if (errorMessage) {
      return <label>{errorMessage}</label>;
    }
  }

  return (
    <div role="main">
      {loginSuccess && <Navigate to="/scrapbook" replace={true} />}
      <h2>Please login</h2>
      <form onSubmit={(e) => handleSubmit(e)} className={'login-form'}>
        <div className={'login-input'}>
        <label>User name</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        </div>
        <input type="submit" value="Login" className={'login-button'} />
      </form>
      <br />
      {renderLoginResult()}
    </div>
  );
}