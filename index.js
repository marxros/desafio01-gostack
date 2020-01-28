const express = require('express');

const app = express();

app.use(express.json());

const projects = [];

// MIDDLEWARE PARA CONTAGEM DE REQUISIÇÕES
let cont = 0

app.use((req, res, next) => {
  cont++;
  console.log("Número de requisições:" + cont); 

  return next();
});

// MIDDLEWARE PARA VERIFICAR SE O PROJETO EXISTE
function checkProjetcExist(req, res, next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if(!project) {
    return res.status(400).json({ error: 'Project does not exists' });    
  }

  return next();
}

// LISTAR TODOS OS PROJETOS
app.get('/projects', (req, res) => {
  res.json(projects);
});

// LISTAR APENAS UM PROJETO
app.get('/projects/:id', checkProjetcExist, (req, res) => {
  const id = req.params.id;

  const project = projects.find(p => p.id == id);

  return res.json(project);
});

// ADICIONAR PROJETO
app.post('/projects', (req, res) => {
  console.log(req.body);
  const { id, title } = req.body;

  const project = {
    id,
    title,
    task: []
  }

  projects.push(project);
  
  return res.json(projects);
});

// EDITAR PROJETO
app.put('/projects/:id', checkProjetcExist, (req, res) => {
  const id = req.params.id;
  const title = req.body.title;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// ADICIONAR TAREFA NO PROJETO
app.post('/projects/:id/task', checkProjetcExist, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  project.task.push(title);

  return res.json(project);
});

// DELETAR PROJETO
app.delete('/projects/:id', checkProjetcExist, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

app.listen(3333, () => {
  console.log('Server is running on port 3333');
});