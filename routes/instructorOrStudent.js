const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newinstructorOrStudentSchema } = require('../schemas/instructorOrStudentSchema');


const router = Router();

const separate = ({ keresztnev, vezeteknev, ...rest }) => {
  const studentFields = {}
  rest.szemeszterek && (studentFields.szemeszterek = rest.szemeszterek)

  const instructorFields = {}
  rest.tanitast_kezdte && (instructorFields.tanitast_kezdte = rest.tanitast_kezdte)

  return {
    userFields: { keresztnev, vezeteknev },
    studentFields,
    instructorFields
  }
}

router.get('/', async (req, res) => {
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

router.post('/', schemaValidation(newinstructorOrStudentSchema), async (req, res) => {

  const { userFields, studentFields, instructorFields } = separate(req.body);

  try {
    const [ret] = await db.query(`INSERT INTO felhasznalo SET ?`, userFields)
    const { insertId } = ret;
    const studentFieldsWithId = { hallgato_kod: insertId, ...studentFields }
    const instructorFieldsWithId = { oktato_kod: insertId, ...instructorFields }

    await db.query(`INSERT INTO hallgato SET ?`, studentFieldsWithId)
    await db.query(`INSERT INTO oktato SET ?`, instructorFieldsWithId)
    return res.json({ insertId })

  } catch (e) {
    console.error(e);
    return res.status(500).send('Hiba történt az adatbázis műveletkor')
  }
})

router.delete('/:kod', async (req, res) => {

  const { kod } = req.params;

  try {
    await db.query(`DELETE FROM oktato WHERE oktato_kod = ?`, [kod]);
    await db.query(`DELETE FROM hallgato WHERE hallgato_kod = ?`, [kod])
    await db.query(`DELETE FROM felhasznalo WHERE kod = ?`, [kod])
    return res.sendStatus(200)

  } catch (e) {
    console.error(e);
    return res.status(500).send('Hiba történt az adatbázis műveletkor')
  }
})
module.exports = router;