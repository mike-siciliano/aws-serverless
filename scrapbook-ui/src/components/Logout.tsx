import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";

type LoginProps = {
  authService: AuthService;
  handleNameChange: Function;
};

export function Logout ({ authService, handleNameChange }: LoginProps) {

  const navigate = useNavigate();

  const handleLogout = async () => {
    handleNameChange('');
    await authService.logout();
    navigate('/');
  }

  return (
    <div role="main">
      <h2>Log out</h2>
      <div>
        <div>Click here to log out:</div>
        <br />
        <input type="button" value="Logout" onClick={handleLogout}/>
      </div>
      <br />
    </div>
  );
}