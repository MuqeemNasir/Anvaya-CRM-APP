const express = require('express')
const cors = require('cors')
const app = express()
const { initializeDatabase } = require('./db/db.connect')

app.use(express.json())

const corsOptions = {
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

initializeDatabase()

app.use('/api/agents', require('./routes/agent.routes'))
app.use('/api/leads', require('./routes/lead.routes'))
app.use('/api/leads', require('./routes/comment.routes'))
app.use('/api/report', require('./routes/report.routes'))

app.get('/', (req, res) => res.send("Anvaya api's are working"))

if(process.env.NODE_ENV !== 'serverless'){
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

module.exports = app