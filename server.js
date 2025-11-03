// 1. IMPORTS
const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// 2. INITIALIZATION

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('"posts" table checked/created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  }
}
createTable();

// 3. MIDDLEWARE

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

function isAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/admin');
  }
}

// 4. STATIC PAGE ROUTES

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contacto', (req, res) => {
  res.render('contacto');
});

app.get('/precios', (req, res) => {
  res.render('precios');
});

// 5. DYNAMIC SERVICE ROUTE

const servicesData = {
  'starter': {
    title: 'Plan Starter',
    description: 'Auditoría SEO técnica, Investigacion KeyWords, Optimización AEO, Generación FAQs, Optimización de intención, Implementación Schema, Reporte rendimiento.',
    price: '649€/mes',
    paymentLink: 'https://calendly.com/pablo-ripoll-korvad/30min'
  },
  'profesional': {
    title: 'Plan Profesional',
    description: 'Todo lo del Pack Starter, más: Análisis competitivo profundo, Creación contenido alta autoridad, Automatización Schema Avanzado, Trackeo de posicionamiento, Análisis y estrategia Backlinks, Monitorizacion inicial GEO.',
    price: '1.999€/mes',
    paymentLink: 'https://calendly.com/pablo-ripoll-korvad/30min'
  },
  'enterprise': {
    title: 'Plan Enterprise',
    description: 'Todo lo del Pack Pro, más: Estrategia dominio completo, Estrategia GEO avanzada, Auditoría técnica contínua, Consultoría estrategica para ti, Adaptación al algoritmo, Contenido multimodal por IA.',
    price: 'Desde 3.999€',
    paymentLink: 'https://calendly.com/pablo-ripoll-korvad/30min'
  }
};

app.get('/servicios/:planName', (req, res) => {
  const planName = req.params.planName.toLowerCase();
  const service = servicesData[planName];

  if (service) {
    res.render('servicio', { service: service });
  } else {
    res.status(404).send('Plan no encontrado');
  }
});

// 6. BLOG

app.get('/admin', (req, res) => {
  res.render('admin_login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/admin/panel');
  } else {
    res.render('admin_login', { error: 'Contraseña incorrecta' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

app.get('/admin/panel', isAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.render('admin_panel', { posts: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error fetching posts');
  }
});

app.post('/admin/new-post', isAuth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.send('Title and content are required.');
  }
  try {
    await pool.query('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);
    res.redirect('/admin/panel');
  } catch (err) {
    console.error(err);
    res.send('Error creating post');
  }
});

app.get('/admin/edit/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Post not found');
    }
    res.render('admin_edit', { post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.send('Error fetching post for editing');
  }
});

app.post('/admin/edit/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    await pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3', [title, content, id]);
    res.redirect('/admin/panel');
  } catch (err) {
    console.error(err);
    res.send('Error updating post');
  }
});

app.post('/admin/delete/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.redirect('/admin/panel');
  } catch (err) {
    console.error(err);
    res.send('Error deleting post');
  }
});

// Blog listing page
app.get('/blog', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.render('blog', { posts: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error fetching blog posts');
  }
});

// Single blog post page
app.get('/blog/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.render('post_detail', { post: result.rows[0] });
    } else {
      res.status(404).send('Post no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.send('Error fetching post');
  }
});


// 7. START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});