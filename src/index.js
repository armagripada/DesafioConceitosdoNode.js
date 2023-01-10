const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { status } = require('express/lib/response');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers
  const user = users.find(user => user.username === username);
  if (!user) {
    return response.status(404).json({ error: 'Mensagem do erro' });
  }
  request.user = user;
  return next()

}



app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userExists = users.find(user => user.username === username);


  if (userExists) {
    return response.status(400).json({ error: 'dsdsds' });
    

  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []

  }
  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;

  return response.status(200).json(user.todos)



});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body
  const todos =
  {
    id: uuidv4()
    , title
    , done: false
    , deadline: new Date(deadline)
    , created_at: new Date()
  }


  user.todos.push(todos)



  return response.status(201).json(todos)


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title,deadline} = request.body;

  const { id } = request.params
  //const usertodos = user.todos

  const usertodos = user.todos.find(usertodos => usertodos.id === id);
  if (!usertodos) {
    return response.status(404).json({ error: 'Mensagem do erro' })
  }

  usertodos.title = title
  usertodos.deadline = new Date(deadline)

  return response.json(usertodos)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { id } = request.params; 


  const usertodos = user.todos.find(usertodos => usertodos.id === id);
  if (!usertodos) {
    return response.status(404).json({ error: 'Mensagem do erro' })
  }

  usertodos.done = true;


  return response.json(usertodos)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const usertodos = user.todos.findIndex(usertodos => usertodos.id === id);


  if (usertodos === -1) {
    return response.status(404).json({ error: "Not Found" })
  }

  user.todos.splice(usertodos, 1);

  return response.status(204).json();

});

module.exports = app;