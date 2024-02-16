import { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { NavBar } from './components/NavBar';
import { CreateScrapbookEntry } from './components/scrapbook/CreateScrapbookEntry';
import { ScrapbookList } from './components/scrapbook/ScrapbookList';
import { AuthService } from './services/AuthService';
import { DataService } from './services/DataService';

const authService = await  AuthService.build();
const dataService = new DataService(authService);

function App() {

  const [username, setUsername] = useState<string | undefined>(authService.getSignedInUser());

  const handleNameChange = (name: string) => setUsername(name);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar username={username}/>
          <Outlet />
        </>
      ),
      children:[
        {
          path: "/",
          element: <h1>Welcome to your Scrapbook!</h1>,
        },
        {
          path: "/login",
          element: <Login authService={authService} handleNameChange={handleNameChange} />,
        },
        {
          path: "/logout",
          element: <Logout authService={authService} handleNameChange={handleNameChange} />,
        },
        {
          path: "/create-entry",
          element: <CreateScrapbookEntry authService={authService} dataService={dataService}/>,
        },
        {
          path: "/scrapbook",
          element: <ScrapbookList authService={authService} dataService={dataService}/>
        },
      ]
    },
  ]);

  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  )
}

export default App