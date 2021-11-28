const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newInstructorSchema } = require('../schemas/instructorSchema');

const router = Router();

router.post('/', schemaValidation(newInstructorSchema), async (req, res) => {
  const separate = ({ keresztnev, vezeteknev, ...rest }) => ({
    userFields: { keresztnev, vezeteknev },
    instructorFields: rest
  });

  const { userFields, instructorFields } = separate(req.body);

  try {
    const [ret] = await db.query(`INSERT INTO felhasznalo SET ?`, userFields)
    const { insertId } = ret;
    const instructorFieldsWithId = { oktato_kod: insertId, ...instructorFields }

    await db.query(`INSERT INTO oktato SET ?`, instructorFieldsWithId)
    return res.json({ insertId })

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/', async (req, res) => {
  try {
    const [ret] = await db.query(`SELECT * FROM felhasznalo INNER JOIN oktato on felhasznalo.kod = oktato.oktato_kod ORDER BY vezeteknev, keresztnev`)
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/:felhasznalo', async (req, res) => {
  try {
    const [ret] = await db.query(`SELECT * FROM felhasznalo INNER JOIN oktato on felhasznalo.kod = oktato.oktato_kod WHERE felhasznalo.kod = ? LIMIT 1`, [req.params.felhasznalo])
    if (!ret[0]) {
      return res.status(404).send({ errors: ['Felhasználó nem található'] })
    }
    return res.json(ret[0])
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})


module.exports = router;