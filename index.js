const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body',(request)=>JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
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

app.get('/api/persons', (request,response)=>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.find(p=>p.id===id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.get('/info', (request, response)=>{
    const now = new Date()

    response.send(`
    <p>Phonebook has ${persons.length} people</p>
    <p> ${now.toDateString()} ${now.toTimeString()}</p>
    `)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    persons = persons.filter(person=>person.id!==id)
    response.status(204).end()
})

app.post('/api/persons',(request, response)=>{
    const newId = Math.floor(Math.random()*100)
    const body = request.body
    const isTaken = persons.some(person => person.name===body.name)

    if(!body.number || !body.name){
        return response.status(400).json({
            error: 'content missing'
        })
    }else if (isTaken){
        return response.status(400).json({
            error:'name must be unique'
        })
    }
    const person = {
        id:newId,
        name:body.name,
        number:body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})


