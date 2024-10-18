const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// PostgreSQL connection setup
const pool = new Pool({
  host: '127.0.0.1',
  user: 'toni',
  password: 'anakmami',
  database: 'window_explorer',
  port: 5432,
});

// Test the connection
pool.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err));

// API to get all folders (root folders if no parent_id)
app.get('/folders', async (req, res) => {
  const parentId = req.query.parent_id || null; // Optional query param for nested folders
  try {
    const result = await pool.query(
      'SELECT * FROM folders WHERE parent_id IS NOT DISTINCT FROM $1',
      [parentId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching folders:', err.message, err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// API to create a new folder
app.post('/folders', async (req, res) => {
  const { name, parent_id = null } = req.body; // Default to root folder if no parent_id
  try {
    const result = await pool.query(
      'INSERT INTO folders (name, parent_id) VALUES ($1, $2) RETURNING *',
      [name, parent_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating folder:', err.message, err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// API to delete a folder (and its subfolders/files)
app.delete('/folders/:id', async (req, res) => {
  const folderId = req.params.id;
  try {
    await pool.query('DELETE FROM folders WHERE id = $1', [folderId]);
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (err) {
    console.error('Error deleting folder:', err.message, err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// API to rename a folder
app.put('/folders/:id', async (req, res) => {
  const folderId = req.params.id;
  const { newName } = req.body;
  try {
    await pool.query('UPDATE folders SET name = $1 WHERE id = $2', [newName, folderId]);
    res.status(200).json({ message: 'Folder renamed successfully' });
  } catch (err) {
    console.error('Error renaming folder:', err.message, err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// API to create a new file
app.post('/files', async (req, res) => {
  const { name, folder_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO files (name, folder_id) VALUES ($1, $2) RETURNING *',
      [name, folder_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating file:', err.message, err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// API to get files within a specific folder
app.get('/folders/:id/files', async (req, res) => {
  const folderId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM files WHERE folder_id = $1', [folderId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching files:', err.message, err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
