require('dotenv').config();
const express = require('express')
const cors = require('cors')
const db = require('./db')

const userRoute = require('./routes/user')
const instructorRoute = require('./routes/instructor')
const studentRoute = require('./routes/student')


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use('/user', userRoute)
app.use('/instructor', instructorRoute)
app.use('/student', studentRoute)
app.get('/instructorOrStudent', async (req, res) => {
  try {
    const [ret] = await db.query(`
    SELECT *
    FROM felhasznalo LEFT JOIN hallgato on felhasznalo.kod = hallgato.hallgato_kod 
    LEFT JOIN oktato on felhasznalo.kod = oktato.oktato_kod
    WHERE hallgato.hallgato_kod IS NOT NULL OR oktato.oktato_kod IS NOT NULL
    `)
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send('Hiba történt az adatbázis műveletkor')
  }

})

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})