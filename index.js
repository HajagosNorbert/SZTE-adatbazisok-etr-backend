require('dotenv').config();
const express = require('express')

const usersRoute = require('./routes/user')
const instructorRoute = require('./routes/instructor')


const app = express();
app.use(express.json());
app.use('/user', usersRoute)
app.use('/instructor', instructorRoute)

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})




// ============ROUTES===========
// app.get('/user/', (req, res) => {
//   res.send("Hi guys!")
//   db.execute();
// })

// app.get('/user/:kod', (req, res) => {
//   const { kod } = req.params;
//   const { nemletezikugysem } = req.body;
//   return res.send('Sending user #' + kod)
// })

// app.post('/instructor/', (req, res) => {
//   const instructor = req.body.user;
//   console.log(req.body)

//   return res.send('Successfuly inserted user')
// })

//======fire it UP! ========================

