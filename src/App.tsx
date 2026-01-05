import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- COMPONENTS ---

const NavBar = () => {
  return (
    <nav className="nav-links">
      {/* Use Link instead of <a> to prevent full page reloads */}
      <Link to="/">Home</Link>
      <Link to="/network">Network</Link>
      <a href="#profile">Profile</a>
      <a href="#circle">My Circle</a>
    </nav>
  );
};

const ProfileCard = ({ name, email, bio, interests, imageUrl, major, gradYear }: any) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="profile-card">
      <div className="card-header">
        <button 
          className="add-button"
          onClick={() => setIsFavorite(!isFavorite)}
          style={{ backgroundColor: isFavorite ? '#ff4757' : 'rgba(0,0,0,0.3)' }}
        >
          {isFavorite ? '♥' : '+'}
        </button>
        <div className="profile-image-container">
          <img src={imageUrl} alt={name} className="profile-image" />
        </div>
        <div className="profile-name">{name}</div>
        
        <div className="interests">
          {/* Requirement: Display API fields (Major/Year) or original interests */}
          {interests ? interests.map((interest: string, index: number) => (
            <span key={index} className="interest-tag">{interest}</span>
          )) : (
            <>
              <span className="interest-tag">{major}</span>
              <span className="interest-tag">{gradYear}</span>
            </>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="email">{email}</div>
        <div className="bio">{bio}</div>
      </div>
    </div>
  );
};

// --- PAGES ---

const HomePage = ({ searchTerm, filteredProfiles }: any) => (
  <main>
    <h1 className="main-title">Find Your Match</h1>
    <div className="profiles-container">
      {filteredProfiles.length > 0 ? (
        filteredProfiles.map((profile: any, index: number) => (
          <ProfileCard key={index} {...profile} />
        ))
      ) : (
        <p className="no-results">No profiles found matching "{searchTerm}"</p>
      )}
    </div>
  </main>
);

const NetworkPage = () => {
  // Requirement: Store the array of users in a state variable
  const [apiUsers, setApiUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Requirement: Use useEffect to fetch users only the first time the page loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://disc-assignment-5-users-api-iyct.onrender.com/api/users');
        const data = await response.json();
        setApiUsers(data); // Set state with API response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <main>
      <h1 className="main-title">Global Network</h1>
      {loading ? (
        <p className="loading-text">Waking up the server... please wait (this can take up to 5 mins).</p>
      ) : (
        <div className="profiles-container">
          {/* Requirement: Map over array to display a card for each user */}
          {apiUsers.map((user: any) => (
            <ProfileCard 
              key={user.id}
              name={`${user.firstName} ${user.lastName}`}
              email={user.email}
              bio={user.bio}
              major={user.major}
              gradYear={user.graduationYear}
              imageUrl={user.profilePicture || "https://placehold.co/400x400?text=No+Image"}
            />
          ))}
        </div>
      )}
    </main>
  );
};

// --- MAIN APP ---

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const allProfiles = [
    {
      name: "Breeze",
      email: "connect@chrisbrown.com",
      bio: "I am a multi-platinum R&B singer, dancer, and actor who first rose to global prominence as a teenager.",
      interests: ["Music", "Dance", "Nature"],
      imageUrl: "https://ntvb.tmsimg.com/assets/assets/499496_v9_bc.jpg"
    },
    {
      name: "Miky",
      email: "connect@michrealjackson.com",
      bio: "I am the 'King of Pop,' a global cultural icon who redefined the music industry through my groundbreaking albums like Thriller.",
      interests: ["Music", "Dance", "Video Games"],
      imageUrl: "https://impro.usercontent.one/appid/oneComWsb/domain/jackson-source.com/media/jackson-source.com/onewebmedia/Michael%20Jackson%202008.jpg?etag=%223c5a8c-60cf06bd%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=1554%2B2071&extract=508%2B32%2B840%2B840&quality=85"
    },
    {
      name: "Will smithy",
      email: "connect@willsmith.com",
      bio: "I am an Academy Award-winning actor and Grammy-winning rapper, who transitioned from 'The Fresh Prince of Bel-Air' to Hollywood.",
      interests: ["Acting", "Tennis", "Reading"],
      imageUrl: "https://goldenglobes.com/wp-content/uploads/2023/10/will-smith-c-hfpa-2016.jpg?w=600"
    }
  ];

  const filteredProfiles = allProfiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
          </div>
        
          <NavBar />

          <div className="auth-buttons">
            <button className="btn-signup">Sign up</button>
            <button className="btn-login">Login</button>
          </div>
        </header>

        {/* Requirement: Add 1 new page using react-router-dom */}
        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} filteredProfiles={filteredProfiles} />} />
          <Route path="/network" element={<NetworkPage />} />
        </Routes>

        <footer>
          <div className="social-icons">
            <div className="social-icon instagram"><svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div>
            <div className="social-icon twitter"><svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>
            <div className="social-icon youtube"><svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;