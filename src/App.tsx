import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/ui/Layout'
import HomePage from './components/ui/HomePage'
import WatTest from './components/wat/WatTest'
import SrtTest from './components/srt/SrtTest'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wat" element={<WatTest />} />
          <Route path="/srt" element={<SrtTest />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
