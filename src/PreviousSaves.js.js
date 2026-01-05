import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- COMPONENTS ---

const NavBar = () => {
  return (
    <nav className="nav-links">
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
          {/* Requirement: Display API fields or original interests */}
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Requirement: Fetch all users from your new PostgreSQL-connected API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Pointing to your local Node/Express backend
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setUsers(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Additional Requirement: POST /users endpoint connectivity
  const handleAddUser = async () => {
    const newUser = {
      first_name: "New",
      last_name: "User",
      email: `user${Date.now()}@example.com`
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const savedUser = await response.json();
        setUsers((prev) => [...prev, savedUser]);
      }
    } catch (error) {
      console.error("Error posting user:", error);
    }
  };

  return (
    <main>
      <h1 className="main-title">Global Network</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={handleAddUser} className="btn-signup">Add User (+)</button>
      </div>
      {loading ? (
        <p className="loading-text">Loading from database...</p>
      ) : (
        <div className="profiles-container">
          {users.map((user: any) => (
            <ProfileCard 
              key={user.id}
              name={`${user.first_name} ${user.last_name}`}
              email={user.email}
              bio={user.bio || "Database User"}
              major={user.major || "PostgreSQL"}
              gradYear={user.graduation_year || "2026"}
              imageUrl={user.profile_picture_url || "https://placehold.co/400x400?text=User"}
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

  // Restored original three profiles exactly as they were
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
          <button className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
          <NavBar />
          <div className="auth-buttons">
            <button className="btn-signup">Sign up</button>
            <button className="btn-login">Login</button>
          </div>
        </header>

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



margin: 0;
padding: 0;
box-sizing: border-box;
}

html, body {
height: 100%;
}

body {
font-family: 'Georgia', serif;
background-color: #f5f5f5;
color: #333;
}

.App {
display: flex;
flex-direction: column;
min-height: 100vh;
}

main {
flex: 1;
max-width: 1400px;
margin: 60px auto;
padding: 0 40px;
width: 100%;
}

header {
background-color: #e8e8e8;
padding: 20px 40px;
display: flex;
justify-content: space-between;
align-items: center;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-links {
display: flex;
gap: 30px;
align-items: center;
}

.nav-links a {
color: #333;
text-decoration: none;
font-size: 18px;
font-weight: 500;
transition: color 0.2s;
}

.nav-links a:hover {
color: #666;
}

.search-container {
display: flex;
align-items: center;
background-color: #a8a8a8;
border-radius: 25px;
padding: 5px 5px 5px 20px;
min-width: 350px;
}

.search-input {
background: transparent;
border: none;
color: white;
font-style: italic;
font-size: 16px;
width: 100%;
outline: none;
}

.search-input::placeholder {
color: rgba(255, 255, 255, 0.8);
}

.search-btn {
background-color: #333;
border: none;
border-radius: 50%;
width: 36px;
height: 36px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
margin-left: 10px;
flex-shrink: 0;
}

.search-btn svg {
width: 18px;
height: 18px;
}

.auth-buttons {
display: flex;
gap: 15px;
}

.btn-signup {
background-color: #333;
color: white;
border: 2px solid #333;
padding: 10px 24px;
border-radius: 25px;
cursor: pointer;
font-size: 16px;
}

.btn-login {
background-color: transparent;
color: #000;
border: 2px solid #333;
padding: 10px 24px;
border-radius: 25px;
cursor: pointer;
font-size: 16px;
}

.main-title {
text-align: center;
font-size: 42px;
margin-bottom: 60px;
color: #333;
}

.profiles-container {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 40px;
margin-bottom: 80px;
align-items: stretch;
}

.profile-card {
background-color: #4a4a4a;
border-radius: 15px;
overflow: hidden;
display: flex;
flex-direction: column;
box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.card-header {
position: relative;
padding: 20px;
text-align: center;
}

.add-button {
position: absolute;
top: 15px;
right: 15px;
width: 32px;
height: 32px;
border-radius: 50%;
border: none;
background-color: rgba(0,0,0,0.3);
color: white;
font-size: 18px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
transition: background-color 0.3s;
z-index: 1;
}

.add-button.favorite {
background-color: #ff4757;
}

.profile-image-container {
width: 140px;
height: 140px;
margin: 0 auto 15px;
}

.profile-image {
width: 100%;
height: 100%;
border-radius: 50%;
border: 4px solid #555;
object-fit: cover;
}

.profile-name {
color: white;
font-size: 20px;
margin-bottom: 15px;
}

.interests {
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 5px;
}

.interest-tag {
background-color: #888;
color: white;
padding: 4px 12px;
border-radius: 15px;
font-size: 12px;
display: inline-block;
}

.card-body {
background-color: #d4d4d4;
padding: 20px;
color: #000;
flex-grow: 1;
}

.email {
font-size: 13px;
margin-bottom: 12px;
font-weight: bold;
}

.bio {
font-size: 14px;
line-height: 1.5;
}

.no-results {
text-align: center;
color: #666;
grid-column: 1 / -1;
font-size: 18px;
}

footer {
background-color: #3a3a3a;
padding: 40px;
text-align: center;
}

.social-icons {
display: flex;
justify-content: center;
gap: 30px;
}

.social-icon {
width: 50px;
height: 50px;
border-radius: 10px;
display: flex;
align-items: center;
justify-content: center;
}

.instagram { background: linear-gradient(45deg, #f09433, #bc1888); }
.twitter { background-color: #000; }
.youtube { background-color: #ff0000; }

