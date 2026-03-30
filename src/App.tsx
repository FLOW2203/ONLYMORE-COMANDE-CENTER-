import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './views/Dashboard'
import Queue from './views/Queue'
import Workflows from './views/Workflows'
import Generate from './views/Generate'
import Reviews from './views/Reviews'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
