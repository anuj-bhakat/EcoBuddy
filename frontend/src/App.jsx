import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { UserLogin } from './user/UserLogin';
import { UserSignup } from './user/UserSignup';
import { CreatorLogin } from './creator/CreatorLogin';
import { AdminLogin } from './AdminLogin';
import { ForgotPassword } from './user/ForgotPassword';
import Home from './user/Home';
import NotFound from './NotFound';
import EcoProducts from './user/EcoProducts';
import LandingPage from './LandingPage';
import Challenges from './user/Challenges';
import Dashboard from './user/Dashboard';
// import TestGreenPoints from './test/TestGreenPoints';
import Community from './user/Community';
import MyActivity from './user/MyActivity';
// import AdminSignup from './test/AdminSignup';
// import ManageCreator from './test/ManageCreator';
import CreateChallenge from './creator/CreateChallenge';
import ViewChallenges from './creator/ViewChallenges';
import ModifyChallenge from './creator/ModifyChallenge';
import ChallengeParticipation from './user/ChallengeParticipation';
import GetSubmissions from './creator/GetSubmissions';
import ViewSubmissions from './creator/ViewSubmissions';
import Checkout from './user/Checkout';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/eco-products" element={<EcoProducts />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenge-participation" element={<ChallengeParticipation />} />
          <Route path="/community" element={<Community />} />
          <Route path="/my-activities" element={<MyActivity />} />


          <Route path="/creator-login" element={<CreatorLogin />} />
          <Route path="/creator-home" element={<CreateChallenge />} />
          <Route path="/creator/create-challenge" element={<CreateChallenge />} />
          <Route path="/creator/view-challenge" element={<ViewChallenges />} />
          <Route path="/creator/get-submissions" element={<GetSubmissions />} />
          <Route path="/creator/view-submissions" element={<ViewSubmissions />} />
          <Route path="/creator/modify-challenge" element={<ModifyChallenge />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          {/* <Route path="/admin-signup" element={<AdminSignup />} /> */}
          {/* <Route path="/test-green" element={<TestGreenPoints />} /> */}
          {/* <Route path="/admin-home" element={<ManageCreator />} /> */}

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
