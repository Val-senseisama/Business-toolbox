import React from 'react';
import { useQuery } from '@apollo/client';
import { isLoggedIn } from './Helpers/IsLoggedIn';
import { CURRENT_USER, GET_CONFIG } from './GraphQL/Queries';
import Session from './Helpers/Session';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loading } from './Components/Loading';




const Register = React.lazy(() => import('./Pages/Auth/Register'));
const Login = React.lazy(() => import('./Pages/Auth/Login'));
const Activate = React.lazy(() => import('./Pages/Auth/Activate'));
const Forgot = React.lazy(() => import('./Pages/Auth/Forgot'));
const Reset = React.lazy(() => import('./Pages/Auth/Reset'));
const Logout = React.lazy(() => import('./Pages/Auth/Logout'));

const Dashboard = React.lazy(() => import('./Pages/MenuPages/Dashboard'));



const App: React.FC = () => {
  const loggedIn = isLoggedIn();

  useQuery(GET_CONFIG, {
    fetchPolicy: 'cache-and-network', //cache-first, cache-only, cache-and-network, network-only, no-cache, standby
    onCompleted: (data: { getConfig: any; }) => {
      Session.setCookie('config', JSON.stringify(data.getConfig));
    }
  });

  const { loading } = useQuery(CURRENT_USER, {
    fetchPolicy: 'cache-first', //cache-first, cache-only, cache-and-network, network-only, no-cache, standby
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
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

    if (loading) return <Loading />;
    return (
      <Router>
        <Routes>
          <Route path={'/'} element={<React.Suspense fallback={<Loading />}> <Dashboard /> </React.Suspense>} />
          <Route path={'/logout'} element={<Logout />} />

          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    );
  }
};

export default App;