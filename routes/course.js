const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newCourseSchema } = require('../schemas/courseSchema');

const router = Router();

function determineUserTypeCode(hallgato_kod, oktato_kod) {
  if (hallgato_kod && oktato_kod)
    return 3
  if (hallgato_kod)
    return 1
  return 2
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
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.post('/', schemaValidation(newCourseSchema), async (req, res) => {

  const newCourse = req.body;

  try {
    const [ret] = await db.query(`SELECT * FROM felhasznalo INNER JOIN oktato on felhasznalo.kod = oktato.oktato_kod WHERE felhasznalo.kod = ? LIMIT 1`, [newCourse.oktato])
    if (!ret[0]) {
      return res.status(404).send({ errors: ['Oktató nem található'] })
    }
    return res.json(ret)
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }

  try {
    const [ret] = await db.query(`INSERT INTO kurzus SET ?`, newCourse)
    const { insertId } = ret;
    const studentFieldsWithId = { hallgato_kod: insertId, ...studentFields }
    const instructorFieldsWithId = { oktato_kod: insertId, ...instructorFields }

    await db.query(`INSERT INTO hallgato SET ?`, studentFieldsWithId)
    await db.query(`INSERT INTO oktato SET ?`, instructorFieldsWithId)
    return res.json({ insertId })

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.patch('/:kod/usertype/:newtypecode', async (req, res) => {
  const { kod } = req.params;
  const newTypeCode = parseInt(req.params.newtypecode)
  try {
    const [ret] = await db.query(`
    SELECT *
    FROM felhasznalo LEFT JOIN hallgato on felhasznalo.kod = hallgato.hallgato_kod 
    LEFT JOIN oktato on felhasznalo.kod = oktato.oktato_kod
    WHERE (hallgato.hallgato_kod IS NOT NULL OR oktato.oktato_kod IS NOT NULL)
    AND felhasznalo.kod = ? `, [kod])

    const user = ret[0]
    const currentUserType = determineUserTypeCode(user.hallgato_kod, user.oktato_kod)
    if (newTypeCode === currentUserType)
      return res.sendStatus(200);


    if (newTypeCode === 3) {
      if (currentUserType === 1) {
        await db.query(`INSERT INTO oktato SET ?`, { oktato_kod: kod })
      } else if (currentUserType === 2) {
        await db.query(`INSERT INTO hallgato SET ?`, { hallgato_kod: kod })
      }
    } else if (newTypeCode === 2) {
      //TODO console.log('leíratkozni kurzusokról, mint hallgato')
      await db.query(`DELETE FROM hallgato WHERE hallgato_kod = ?`, [kod])
      if (currentUserType === 1) {
        await db.query(`INSERT INTO oktato SET ?`, { oktato_kod: kod })
      }
    } else if (newTypeCode === 1) {
      //TODO console.log('leíratkozni kurzusokról, mint oktató')
      await db.query(`DELETE FROM oktato WHERE oktato_kod = ?`, [kod]);
      if (currentUserType === 2) {
        await db.query(`INSERT INTO hallgato SET ?`, { hallgato_kod: kod })
      }
    }
    return res.sendStatus(200);

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
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
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

module.exports = router;