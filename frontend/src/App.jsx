import { useEffect, useState } from 'react'
import './App.css'

function Header({title}){
  return <h1>{title}</h1>
}

function Counter(){
  const [count,setCount] = useState(0);
  return(
    <div>
      <p>Count:${count}</p>
      <button onClick={()=>setCount(count+1)}>Increment</button>
    </div>
  )
}

function Taskinput(){
  const [text,setText] = useState('');
  return(
    <div>
      <input 
        type='text'
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />
      <p>You typed:{text}</p>
    </div>
  )

}

function App() {
  const [tasks,setTasks] = useState([]);
  const [loading,setLoding] = useState(true);
  const [newTitle,setNewTitle] = useState("");

  useEffect(()=>{
    fetch('http://localhost:3001/tasks').then(res=>res.json()).then(data=>{
      setTasks(data);
      setLoding(false)
    })
    .catch(err=>console.error('Error fetching tasks:', err))
  },[]);
  const handleAddTask = () => {
    if(!newTitle.trim()) return;
    fetch('http://localhost:3001/tasks',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({title:newTitle})
    })
    .then(res=>res.json())
    .then(createdTask=>{
      setTasks([...tasks,createdTask]);
      setNewTitle('');
    })
    .catch(err => console.error('Error adding task:', err));
  }
  const handleTaskDelete = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`,{
      method:'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res=>res.json())
    .then(deletedTask=>{
      setTasks(tasks.filter(task=>task.id!==deletedTask.id));
      
    })
    .catch(err => console.error('Error adding task:', err));
  }
  if(loading) return <p>Loading...</p>;
  return (
   <div>
    <h1>My Tasks</h1>
    <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New task title"
      />
      <button onClick={handleAddTask}>Add Task</button>
    <ul>
      {tasks.map(task=>(
        <li key={task.id}>
          {task.title} - {task.done? 'Done' : 'Pending'}
          <button onClick={()=>handleTaskDelete(task.id)}>Delete</button>
          </li>
      ))}
    </ul>
   </div>
  )
}

export default App
