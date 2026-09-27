import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Saved from './pages/Saved';
import OpportunityDetail from './pages/OpportunityDetail';
import PathPage from './pages/PathPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing — standalone layout */}
        <Route path="/" element={<Landing />} />

        {/* Interior pages — app shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/goal" element={<PathPage title="My Goal" subtitle="Track your career goal milestones and opportunity progression." />} />
          <Route path="/journey" element={<PathPage title="My Journey" subtitle="Map the journey from where you are to where you want to be." />} />
          <Route path="/path" element={<PathPage title="Opportunity Path" subtitle="See how opportunities can connect toward your goal." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
