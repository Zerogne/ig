import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase';
import profileImg from '../assets/profile.png';
import loginImg from '../assets/Login.png';
import { Link } from 'react-router-dom';
import CreatePostModal from './CreatePostModal'; // Import the modal component

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [user, setUser] = useState(null); // State for user
  const [isModalOpen, setModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, [auth]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown state
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null); // Clear the user state after logout
      setDropdownOpen(false); // Close the dropdown menu
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  return (
    <div className="navbar">
      <h1>TellU</h1>
      <div className="actions">
        <button className='cr'
          onClick={() => {
            if (user) {
              setModalOpen(true); // Open the modal if the user is logged in
            } else {
              navigate('/login'); // Redirect to the login page if not logged in
            }
          }}
        >
          Create Post
        </button>
        {isModalOpen && <CreatePostModal onClose={handleCloseModal} />}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <img
            src={user ? profileImg : loginImg}
            alt="profile"
            onClick={user ? toggleDropdown : () => navigate('/login')}
            style={{ cursor: 'pointer', width: '40px', marginLeft: '10px' }}
          />
          {isDropdownOpen && user && (
            <div
              className="dropdown-menu"
              style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: '10px' }}>
                <li style={{ padding: '5px 10px', cursor: 'pointer' }}>
                  <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                    Profile
                  </Link>
                </li>
                <li
                  style={{ padding: '5px 10px', cursor: 'pointer', color: 'red' }}
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
