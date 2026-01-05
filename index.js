require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

// Initialize Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY 
);

app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE (Requirement 3) ---
const requireAuth = async (req, res, next) => {
  // 1. Get token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // 2. Verify token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }

  // 3. Attach user to request and proceed
  req.user = user;
  next();
};

// --- ENDPOINTS ---

// 1. GET /users/profiles - Restricted to logged-in users (Requirement 2 & 3)
app.get('/users/profiles', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, first_name, last_name, email,
      user_profiles (date_of_birth, bio)
    `);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. GET /posts - Retrieve all posts with authors
app.get('/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id, content, created_at,
      users (first_name, last_name)
    `);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. POST /posts - Create a new post (Restricted to logged-in users)
app.post('/posts', requireAuth, async (req, res) => {
  const { content } = req.body;
  // Use req.user.id from the verified token for security
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: req.user.id, content }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// 4. DELETE /posts/:id - Additional Requirement 3
app.delete('/posts/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id); // Ensure user can only delete their own posts

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Post deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});