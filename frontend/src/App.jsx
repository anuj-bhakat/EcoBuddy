import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { UserLogin } from './UserLogin';
import { UserSignup } from './UserSignup';
import { CreatorLogin } from './CreatorLogin';
import { AdminLogin } from './AdminLogin';
import { ForgotPassword } from './ForgotPassword';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<h1>EcoBuddy</h1>} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/creator-login" element={<CreatorLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
