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

  useEffect(()=>{
    fetch('http://localhost:3001/tasks').then(res=>res.json()).then(data=>{
      setTasks(data);
      setLoding(false)
    })
    .catch(err=>console.error('Error fetching tasks:', err))
  },[]);
  if(loading) return <p>Loading...</p>;
  return (
   <div>
    <h1>My Tasks</h1>
    <ul>
      {tasks.map(task=>(
        <li key={task.id}>{task.title} - {task.done? 'Done' : 'Pending'}</li>
      ))}
    </ul>
   </div>
  )
}

export default App
