import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { createClient } from '@supabase/supabase-js';

// --- INITIALIZE SUPABASE ---
const supabase = createClient(
  'https://uzivmqlttdyolxanevfm.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6aXZtcWx0dGR5b2x4YW5ldmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTc0NzMsImV4cCI6MjA4MzE5MzQ3M30.XLYw_Y8g4W8-B3k61nGDZ5a-OwzbFJmSXpLKnL0Gr98'
);

// --- COMPONENTS ---

const NavBar = () => (
  <nav className="nav-links">
    <Link to="/">Home</Link>
    <Link to="/network">Network</Link>
    <a href="#profile">Profile</a>
    <a href="#circle">My Circle</a>
  </nav>
);

const ProfileCard = ({ name, email, bio, imageUrl, major, gradYear }: any) => {
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
          <span className="interest-tag">{major}</span>
          <span className="interest-tag">{gradYear}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="email">{email}</div>
        <div className="bio">{bio}</div>
      </div>
    </div>
  );
};

// --- AUTH COMPONENT ---
const AuthUI = ({ onLoginSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Check your email for a confirmation link!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else if (data.session) onLoginSuccess(data.session);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f4f4f4', borderRadius: '15px', maxWidth: '400px', margin: '40px auto' }}>
      <h2>{isSignUp ? "Create Account" : "Login to Network"}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" placeholder="Email" value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" placeholder="Password" value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button onClick={handleAuth} className="btn-signup" style={{ padding: '10px' }}>
          {isSignUp ? "Register" : "Sign In"}
        </button>
        <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer', color: '#007bff', fontSize: '14px' }}>
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
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
        <p style={{ textAlign: 'center', width: '100%' }}>No matches found for "{searchTerm}"</p>
      )}
    </div>
  </main>
);

const NetworkPage = ({ session }: any) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/profiles', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await response.json();
        setUsers(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [session]);

  if (!session) return <AuthUI onLoginSuccess={() => window.location.reload()} />;

  return (
    <main>
      <h1 className="main-title">Global Network</h1>
      <div className="profiles-container">
        {loading ? <p>Loading...</p> : users.map((user: any) => (
          <ProfileCard 
            key={user.id}
            name={`${user.first_name} ${user.last_name}`}
            email={user.email}
            bio={user.user_profiles?.bio || "No bio set."}
            major="Member"
            gradYear="N/A"
            imageUrl="https://placehold.co/400x400?text=Member"
          />
        ))}
      </div>
    </main>
  );
};

// --- MAIN APP ---

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const allProfiles = [
    {
      name: "Breeze",
      email: "connect@chrisbrown.com",
      bio: "I am a multi-platinum R&B singer, dancer, and actor.",
      imageUrl: "https://ntvb.tmsimg.com/assets/assets/499496_v9_bc.jpg",
      major: "Music",
      gradYear: "2005"
    },
    {
      name: "Miky",
      email: "connect@michrealjackson.com",
      bio: "I am the 'King of Pop,' a global cultural icon who redefined the music industry.",
      imageUrl: "https://impro.usercontent.one/appid/oneComWsb/domain/jackson-source.com/media/jackson-source.com/onewebmedia/Michael%20Jackson%202008.jpg?etag=%223c5a8c-60cf06bd%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=1554%2B2071&extract=508%2B32%2B840%2B840&quality=85",
      major: "Dance",
      gradYear: "1979"
    },
    {
      name: "Will smithy",
      email: "connect@willsmith.com",
      bio: "I am an Academy Award-winning actor and Grammy-winning rapper.",
      imageUrl: "https://goldenglobes.com/wp-content/uploads/2023/10/will-smith-c-hfpa-2016.jpg?w=600",
      major: "Acting",
      gradYear: "1990"
    }
  ];

  const filteredProfiles = allProfiles.filter(profile => 
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BrowserRouter>
      <div className="App">
      <header>
          <div className="search-container" style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Who are you looking for?" // Updated Placeholder
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {/* Search Icon Button */}
            <button 
              className="search-btn" 
              style={{ 
                marginLeft: '-40px', // Pulls the button into the input bar visually
                background: 'none', 
                border: 'none', 
                cursor: 'pointer' 
              }}
              onClick={() => {
                // This triggers the filter logic already existing in your App component
                console.log("Searching for:", searchTerm);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <NavBar />

          <div className="auth-buttons">
            {session ? (
              <>
                <span style={{ marginRight: '10px' }}>{session.user.email}</span>
                <button className="btn-login" onClick={() => supabase.auth.signOut()}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/network"><button className="btn-login" style={{ marginRight: '10px' }}>Login</button></Link>
                <Link to="/network"><button className="btn-signup">Sign Up</button></Link>
              </>
            )}
          </div>
</header>

        <Routes>
          <Route path="/" element={<HomePage searchTerm={searchTerm} filteredProfiles={filteredProfiles} />} />
          <Route path="/network" element={<NetworkPage session={session} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;