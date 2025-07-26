const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const app = express()




let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('dist'))
// app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  let taiwanTime = new Date()
  
  response.send(`<p> Phonebook has info for ${persons.length} people </p>
                 <p>${taiwanTime.toString()} </p>
    `)
})

app.delete('/api/persons/:id', (request, response) => {
  console.log("delete goes here")
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = 
  persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}


app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if(!body.name){
    response.status(400).end('missing name attribute')
  }
  if(!body.number){
    response.status(400).end('missing number attribute')
  }
  if(persons.find(obj => obj.name === body.name)){
    response.status(400).end('name must be unique')
  }
  
  // let id = Math.floor(Math.random() * 2^31)
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)

  console.log(body)
  
  //used to check headers of a request
  // console.log(request.headers)
  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  // notice we use the button above TAB on the keyboard
  console.log(`Server running on port ${PORT}`)  
})

// note that the express's major version is 5, which may cause some code not working...