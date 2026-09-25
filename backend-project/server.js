const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
const cors = require('cors');
app.use(cors())
const { Pool } = require('pg');

const pool = new Pool({
  user: 'adithya',        // your Mac username, based on what we saw connecting
  host: 'localhost',
  database: 'taskdb',
  password: '',            // try empty first
  port: 5432,
});

app.get("/",(req,res)=>{
    res.json({message:"Server is running successfully"})
})
    
  
  app.get('/tasks', async(req, res) => {
    try {
      const result = await pool.query('SELECT * FROM tasks');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({error:"Failed to fetch tasks."})
    }
  });
  
  app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    res.json(task);
  });

  app.delete('/tasks/:id', async(req, res) => {
    try {
      const result = await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING *`,[req.params.id])
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(201).json(result.rows[0])
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong while deleting task.' });
    }
  });
  
  app.post('/tasks', async(req, res) => {
    try {
      const {title} = req.body;
      const result = await pool.query(`INSERT INTO tasks(title) VALUES($1) RETURNING *`,[title])
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({error:'Failed to add task'});
    }
    
  });

  app.put('/tasks/:id', async(req, res) => {
    try {
      const {title} = req.body;
      const result = await pool.query(`UPDATE tasks SET title = $1 WHERE id = $2 RETURNING *`,[title,req.params.id])
      res.status(201).json(result.rows[0])
    } catch (error) {
      res.status(500).json({error:'Failed to update task'});
    }
  });

app.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})