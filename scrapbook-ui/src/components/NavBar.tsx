import { NavLink } from 'react-router-dom';

type NavBarProps = {
  username: string | undefined;
};
export function NavBar({ username }: NavBarProps) {

  function renderLoginLogout() {
    if (username) {
      return (
        <NavLink to='/logout' style={{ float: 'right' }}>
          {username}
        </NavLink>
      );
    } else {
      return (
        <NavLink to='/login' style={{ float: 'right' }}>
          Login
        </NavLink>
      );
    }
  }

  return (
    <div className='navbar'>
      <NavLink to={'/'}>Home</NavLink>
      <NavLink to={'/scrapbook'}>Scrapbook</NavLink>
      <NavLink to={'/create-entry'}>Create Entry</NavLink>
      {renderLoginLogout()}
    </div>
  );
}