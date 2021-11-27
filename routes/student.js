const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newStudentSchema } = require('../schemas/studentSchema');

const router = Router();

router.post('/', schemaValidation(newStudentSchema), async (req, res) => {
  const separate = ({ keresztnev, vezeteknev, ...rest }) => ({
    userFields: { keresztnev, vezeteknev },
    studentFields: rest
  });

  const { userFields, studentFields } = separate(req.body);

  try {
    const [ret] = await db.query(`INSERT INTO felhasznalo SET ?`, userFields)
    const { insertId } = ret;
    const studentFieldsWithId = { hallgato_kod: insertId, ...studentFields }

    await db.query(`INSERT INTO hallgato SET ?`, studentFieldsWithId)
    return res.json({ insertId })

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/', async (req, res) => {
  try {
    const ret = await db.query(`SELECT * FROM felhasznalo INNER JOIN hallgato on felhasznalo.kod = hallgato.hallgato_kod`)
    return res.json(ret[0])

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/newsemester', async (req, res) => {
  try {
    const [ret] = await db.query(`UPDATE hallgato SET szemeszterek = szemeszterek + 1 `)
    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/:felhasznalo', async (req, res) => {
  try {
    const [ret] = await db.query(`SELECT * FROM felhasznalo INNER JOIN hallgato on felhasznalo.kod = hallgato.hallgato_kod WHERE felhasznalo.kod = ? LIMIT 1`, [req.params.felhasznalo])
    if (!ret[0]) {
      return res.status(404).send({ errors: ['Felháló nem található'] })
    }
    return res.json(ret)
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})



module.exports = router;