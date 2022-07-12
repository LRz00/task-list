import { useState, useEffect } from 'react';
import './App.css';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';

const API = "http://localhost:5000";


function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async() => {
      setLoading(true)
      const res = await fetch(API + "/todos").then((res) => res.json())
      .then((data) => data).catch((err) => console.log(err));

      setLoading(false);
      setTasks(res);

    }
    loadData();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const task = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method:"POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTasks((prevState) => [...prevState, task])

    console.log(task);
    setTitle("");
    setTime("");
  };

  const handleDelete = async(id) => {

    await fetch(API + "/todos/" + id, {
      method:"DELETE",
    });

    setTasks((prevState) => prevState.filter((task) => task.id !== id));
  };

  const handleEdit = async(task) => {

    task.done = !task.done;

    const data = await fetch(API + "/todos/" + task.id, {
      method:"PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      }
    });

    setTasks((prevState) => 
    prevState.map((t) => (t.id === data.id ? (t = data) : t)));
  };

  if(loading) {
    return <p>Carregando...</p>
  };

  return (
    <div className="App">
      <div className="tasklist-header">
        <h1>React Task List</h1>
      </div>
      <div className="task-form">
        <h2>Insira uma tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>Qual a sua tarefa?</label>
            <input type="text" name='title' placeholder='Titulo da tarefa'
              onChange={(e) => setTitle(e.target.value)}
              value={title} required />
          </div>
          <div className='form-control'>
            <label htmlFor='time'>Duração:</label>
            <input type="text" name='time' placeholder="Tempo estimado(em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time} required />
          </div>
          <input type="submit" value="Criar Tarefa" />
        </form>
      </div>
      <div className='task-list'>
        <h2>Lista de Tarefas</h2>
        {tasks.length === 0 && <p>Não há tarefas.</p>}
        {tasks.map((task) => (
          <div className='task' key={task.id}>
            <h3 className={task.done ? "task-done" : ""}>{task.title}</h3>
            <p>Duração:{task.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(task)}>
                {!task.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill /> }</span>
              <BsTrash onClick={() => handleDelete(task.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
