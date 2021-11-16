require('dotenv').config();
const express = require('express')
const cors = require('cors')
const db = require('./db')

const userRoute = require('./routes/user')
const instructorRoute = require('./routes/instructor')
const studentRoute = require('./routes/student')
const instructorOrStudentRouter = require('./routes/instructorOrStudent')


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use('/user', userRoute)
app.use('/instructor', instructorRoute)
app.use('/student', studentRoute)
app.use('/instructorOrStudent', instructorOrStudentRouter)


const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})