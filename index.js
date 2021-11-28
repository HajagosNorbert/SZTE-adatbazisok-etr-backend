require('dotenv').config();

const { setLocale } = require('yup');
setLocale({
  mixed: {
    required: '${path} kötelező'
  },
  number: {
    integer: '${path} egy egész szám',
    positive: '${path} 0-tól nagyobb',
    max: '${path} nem nagyobb mint ${max}',
  },
  string: {
    min: '${path} legalább ${min} karakter',
    max: '${path} maximum ${max} karakter',
  },
  date: {
    default: '${path} érvényes dátum'
  }
})

const express = require('express')
const cors = require('cors')
const db = require('./db')


const userRoute = require('./routes/user')
const instructorRoute = require('./routes/instructor')
const studentRoute = require('./routes/student')
const instructorOrStudentRouter = require('./routes/instructorOrStudent');
const buildingRouter = require('./routes/building');
const classroomRouter = require('./routes/classroom');
const courseRouter = require('./routes/course');



const app = express();
app.use(express.json());
app.use(cors())
app.use('/user', userRoute)
app.use('/instructor', instructorRoute)
app.use('/student', studentRoute)
app.use('/instructorOrStudent', instructorOrStudentRouter)
app.use('/building', buildingRouter)
app.use('/classroom', classroomRouter)
app.use('/course', courseRouter)


const port = process.argv[2] || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})