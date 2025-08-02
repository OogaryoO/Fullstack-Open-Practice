require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const app = express()

// write mongoose specific code into its own module
const Person = require('./models/person')
const person = require('./models/person')




app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('dist'))
// app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)  
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = request.params.id
  // const person = persons.find(person => person.id === id)
  
  // if(person){
  //   response.json(person)
  // }
  // else{
  //   response.status(404).end()
  // }

  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }
      else{
        response.status(404).end()
      } 
    })
    .catch(error => {
      next(error)
      // console.log(error)
      // response.status(400).send({error: 'malformatted id'})
    })
    
  
})

app.get('/info', (request, response) => {
  let taiwanTime = new Date()
  
  Person.countDocuments({})
        .then( count => {
          response
            .send(`<p> Phonebook has info for ${count} people </p>
                 <p>${taiwanTime.toString()} </p>
            `)
          }
        )
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  // console.log("delete goes here")
  // const id = request.params.id
  // persons = persons.filter(person => person.id !== id)

  // response.status(204).end()

  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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
  // find method went into some problems. 7/27 16:57
  // if(Person.find(obj => obj.name === body.name)){
  //   response.status(400).end('name must be unique')
  // }
  
  // let id = Math.floor(Math.random() * 2^31)
  const person = new Person({
    // id: generateId(),
    name: body.name,
    number: body.number
  })
  
  // persons = persons.concat(person)

  console.log(body)
  
  //used to check headers of a request
  // console.log(request.headers)
  // response.json(person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  // notice we use the button above TAB on the keyboard
  console.log(`Server running on port ${PORT}`)  
})

// note that the express's major version is 5, which may cause some code not working...