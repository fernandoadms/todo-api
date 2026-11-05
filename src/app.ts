import express, { 
  type Express, 
  type Request, 
  type Response,
  type NextFunction
} from 'express';

const app: Express = express();

type Task = {
  id: number;
  title: string;
  done: boolean;
};

let count = 0;
const tasks: Task[] = [];
const POSITIVE_INTEGER_REGEX = /^[1-9]\d*$/;

const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

function validateTaskId(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const isValidId = typeof id === 'string' && POSITIVE_INTEGER_REGEX.test(id);

  if (!isValidId) {
    return res.status(400).send({ error: 'Invalid task ID' });
  }

  next();
}

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

app.get('/tasks/:id', validateTaskId, (req: Request, res: Response) => {
  const { id } = req.params;
  
  const task = tasks.find(t => t.id === Number(id));

  if (!task) {
    return res.status(404).send({ error: 'Task not found' });
  }
  
  res.status(200).send(task);
});

app.patch('/tasks/:id', validateTaskId, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, done } = req.body ?? {};
  
  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).send({ error: 'Done must be a boolean' });
  }

  if(title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).send({ error: 'Title must be a non-empty string' });
  }
  
  if (title === undefined && done === undefined) {
    return res.status(400).send({ error: 'At least one field (title or done) is required' });
  }
  
  const task = tasks.find(t => t.id === Number(id));
  
  if (!task) {
    return res.status(404).send({ error: 'Task not found' });
  }
  
  if (title !== undefined) {
    task.title = title.trim();
  }

  if (done !== undefined) {
    task.done = done;
  }

  res.status(200).send(task);
});

app.delete('/tasks/:id', validateTaskId, (req: Request, res: Response) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(t => t.id === Number(id));

  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});