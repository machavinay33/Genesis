import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout.jsx'
import Home from './pages/Home.jsx'
import Roster from './pages/Roster.jsx'
import Achievements from './pages/Achievements.jsx'
import Organization from './pages/Organization.jsx'
import History from './pages/History.jsx'
import Schedule from './pages/Schedule.jsx'
import NotFound from './pages/NotFound.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ManageTeamInfo from './pages/admin/ManageTeamInfo.jsx'
import ManageRoster from './pages/admin/ManageRoster.jsx'
import ManageStaff from './pages/admin/ManageStaff.jsx'
import ManagePlacements from './pages/admin/ManagePlacements.jsx'
import ManageAchievements from './pages/admin/ManageAchievements.jsx'
import ManageAwards from './pages/admin/ManageAwards.jsx'
import ManageTimeline from './pages/admin/ManageTimeline.jsx'
import ManageUpcoming from './pages/admin/ManageUpcoming.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/history" element={<History />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="team-info" element={<ManageTeamInfo />} />
        <Route path="roster" element={<ManageRoster />} />
        <Route path="staff" element={<ManageStaff />} />
        <Route path="placements" element={<ManagePlacements />} />
        <Route path="achievements" element={<ManageAchievements />} />
        <Route path="awards" element={<ManageAwards />} />
        <Route path="timeline" element={<ManageTimeline />} />
        <Route path="upcoming" element={<ManageUpcoming />} />
      </Route>
    </Routes>
  )
}
