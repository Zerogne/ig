// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // Import the SignUp component
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> {/* Add the SignUp route */}
        <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
