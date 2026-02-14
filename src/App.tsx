import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './config/amplify';
import Dashboard from './components/Dashboard';
import FoodLogger from './components/FoodLogger';
import Profile from './components/Profile';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

Amplify.configure(amplifyConfig);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="app">
            <nav className="navbar">
              <div className="nav-brand">NUTRIGEN</div>
              <div className="nav-links">
                <Link to="/">Dashboard</Link>
                <Link to="/log">Log Food</Link>
                <Link to="/profile">Profile</Link>
              </div>
              <div className="nav-user">
                <span>{user?.signInDetails?.loginId}</span>
                <button onClick={signOut}>Sign Out</button>
              </div>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/log" element={<FoodLogger />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
