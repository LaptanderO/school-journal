import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import StudentsPage from './pages/StudentsPage'
import TeachersPage from './pages/TeachersPage'
import SubjectsPage from './pages/SubjectsPage'
import ClassesPage from './pages/ClassesPage'
import GradesPage from './pages/GradesPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>🏫 Школьный журнал</h1>
          <div className="nav-links">
            <Link to="/">Ученики</Link>
            <Link to="/teachers">Учителя</Link>
            <Link to="/subjects">Предметы</Link>
            <Link to="/classes">Классы</Link>
            <Link to="/grades">Журнал оценок</Link>
          </div>
        </nav>
        
        <main className="content">
          <Routes>
            <Route path="/" element={<StudentsPage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/grades" element={<GradesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App