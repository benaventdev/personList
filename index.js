const express = require("express")
const morgan = require("morgan")
const fs = require('fs')
const app = express()
const path = require('path')
const cors = require('cors')

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', { stream: accessLogStream }))
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Loveace",
        number: "39-44-123456"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-123456"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-123456"
    },
]


const token = morgan.token('type', function (req, res) { return req.headers['content-type'] })

app.get("/api/persons", (request, response) => {

    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const uId = request.params.id
    const person = persons.find(person => person.id == uId)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get("/info", (request, response) => {
    const personsId = persons.map(person => person.id)
    const maxId = Math.max(...personsId)
    const date = new Date()
    response.send(`<p>Phonebook has info for ${maxId} people</p> ${date}`)
})

app.delete("/api/persons/:id", (request, response) => {
    const uId = Number(request.params.id)
    persons = persons.filter(person => person.id !== uId)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const person = request.body
    if (!person || !person.name || !person.number) {
        response.status(400).json({
            error: "person.name or person.number is missing"
        })
    }

    const personsId = persons.map(person => person.id)
    const maxId = Math.max(...personsId)
    const newPerson = {
        id: maxId + 1,
        name: person.name,
        number: person.number
    }

    if (persons.map(person => person.name).includes(person.name)) {
        response.status(400).json({
            error: "name must be unique"
        })
    } else {
        persons = [...persons, newPerson]
        response.send(newPerson)
    }
})

const PORT = 80
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})