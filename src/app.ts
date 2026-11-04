import express, { 
  type Express, 
  type Request, 
  type Response 
} from 'express';

const app: Express = express();

type Task = {
  id: number;
  title: string;
  done: boolean;
};

let count = 0;
const tasks: Task[] = [];

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'ok' });
});

app.get('/tasks', (req: Request, res: Response) => {
  res.status(200).send(tasks);
});

app.post('/tasks', (req: Request, res: Response) => {
  const { title } = req.body ?? {};

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).send({ error: 'Title is required' });
  }

  count++;

  const task: Task = {
    id: count,
    title: title.trim(),
    done: false
  };

  tasks.push(task);

  res.status(201).send(task);
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    return res.status(404).send({ error: 'Task not found' });
  }
  
  res.status(200).send(task);
});

app.patch('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, done } = req.body ?? {};

  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    return res.status(404).send({ error: 'Task not found' });
  }
  
  if (title && typeof title === 'string' && title.trim() !== '') {
    task.title = title.trim();
  }

  if (done !== undefined && typeof done === 'boolean') {
    task.done = done;
  }

  res.status(200).send(task);
});

app.delete('/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex(t => t.id === Number(id));

  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).send({ message: 'Task deleted' });
});

app.listen(3000);