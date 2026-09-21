const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
const cors = require('cors');
app.use(cors())

app.get("/",(req,res)=>{
    res.json({message:"Server is running successfully"})
})
    
let tasks = [
    { id: 1, title: 'Learn Express', done: false },
    { id: 2, title: 'Learn React', done: false }
  ];
  
  app.get('/tasks', (req, res) => {
    res.json(tasks);
  });
  
  app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    res.json(task);
  });

  app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0]; // removes 1 item at that index, returns the removed item(s) as an array
    res.json(deletedTask);
  });
  
  app.post('/tasks', (req, res) => {
    const newTask = {
      id: tasks.length + 1,
      title: req.body.title,
      done: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  app.put('/tasks/:id', (req, res) => {
    console.log('1. PUT route hit, id param:', req.params.id);
    console.log('2. req.body:', req.body);
    
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    console.log('3. taskIndex:', taskIndex);
  
    if (taskIndex === -1) {
      console.log('4. Task not found, sending 404');
      return res.status(404).json({ error: 'Task not found' });
    }
  
    const updatedTask = { ...tasks[taskIndex], ...req.body };
    console.log('5. updatedTask:', updatedTask);
    
    tasks[taskIndex] = updatedTask;
    console.log('6. About to send response');
    
    res.json(updatedTask);
    console.log('7. Response sent');
  });

app.listen(PORT,()=>{
    console.log(`Server listening on http://localhost:${PORT}`);
})