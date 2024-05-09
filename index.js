const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
app.use(cors())
const port = 5000

/*
if we create routes here notice we are using app.get but we are creating routes in routes folder see diff 
in notes.js in routes folder 

app.get('/login', (req, res) => {
  res.send('Hello login!')
})
app.get('/signup', (req, res) => {
  res.send('Hello signup!')
})
*/

app.use(express.json()); //middleware- used to access and use request.body in auth.js

//available routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));


app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`);
})