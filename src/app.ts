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


app.listen(3000);