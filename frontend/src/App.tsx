import React from 'react';
import UserContext from './Helpers/UserContext.js';
import { useQuery } from '@apollo/client';
import { isLoggedIn } from './Helpers/IsLoggedIn.js';
import { CURRENT_USER, GET_CONFIG } from './GraphQL/Queries.js';
import Session from './Helpers/Session.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loading } from './Components/Loading.js';




const Register = React.lazy(() => import('./Pages/Auth/Register.js'));
const Login = React.lazy(() => import('./Pages/Auth/Login.js'));
const Activate = React.lazy(() => import('./Pages/Auth/Activate.js'));
const Forgot = React.lazy(() => import('./Pages/Auth/Forgot.js'));
const Reset = React.lazy(() => import('./Pages/Auth/Reset.js'));
const Logout = React.lazy(() => import('./Pages/Auth/Logout.js'));

const Dashboard = React.lazy(() => import('./Pages/MenuPages/Dashboard.js'));



const App: React.FC = () => {
  const loggedIn = isLoggedIn();

  const [user, setUser] = React.useState(JSON.parse(Session.getCookie('user') || '{}'));
  const [config, setConfig] = React.useState(JSON.parse(Session.getCookie('config') || '{}'));

  useQuery(GET_CONFIG, {
    fetchPolicy: 'cache-and-network', //cache-first, cache-only, cache-and-network, network-only, no-cache, standby
    onCompleted: data => {
      setConfig(data.getConfig);
      Session.setCookie('config', JSON.stringify(data.getConfig));
    }
  });

  useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only', //cache-first, cache-only, cache-and-network, network-only, no-cache, standby
    onCompleted: data => {
      setUser(data.currentUser);
      Session.setCookie('user', JSON.stringify(data.currentUser));
    }
  });

  if (!loggedIn) {
    return (
      <Router>
        <Routes>
          <Route path={'/register'} element={<React.Suspense fallback={<Loading />}> <Register /> </React.Suspense>} />
          <Route path={'/activate'} element={<React.Suspense fallback={<Loading />}> <Activate /> </React.Suspense>} />
          <Route path={'/forgot'} element={<React.Suspense fallback={<Loading />}> <Forgot /> </React.Suspense>} />
          <Route path={'/reset'} element={<React.Suspense fallback={<Loading />}> <Reset /> </React.Suspense>} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  } else {

    return (
      <UserContext.Provider value={{ user, setUser, config, setConfig }}>
        <Router>
          <Routes>
            <Route path={'/'} element={<React.Suspense fallback={<Loading />}> <Dashboard /> </React.Suspense>} />
            <Route path={'/logout'} element={<Logout />} />

            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    );
  }
};

export default App;