const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newCourseSchema } = require('../schemas/courseSchema');

const router = Router();

router.post('/', schemaValidation(newCourseSchema), async (req, res) => {

  const newCourse = req.body;

  try {
    const [oktatoRet] = await db.query(`SELECT * FROM felhasznalo INNER JOIN oktato on felhasznalo.kod = oktato.oktato_kod WHERE felhasznalo.kod = ? LIMIT 1`, [newCourse.oktato_kod])
    if (!oktatoRet[0]) {
      return res.status(404).send({ errors: ['Oktató nem található'] })
    }
    const [epuletRet] = await db.query(`SELECT * FROM epulet WHERE epulet.kod = ? LIMIT 1`, [newCourse.epulet_kod])
    if (!epuletRet[0]) {
      return res.status(404).send({ errors: ['Épület nem található'] })
    }
    const [teremRet] = await db.query(`SELECT * FROM terem INNER JOIN epulet on terem.epulet_kod = epulet.kod WHERE terem.kod = ? LIMIT 1`, [newCourse.terem_kod])
    if (!teremRet[0]) {
      return res.status(404).send({ errors: ['Terem nem található'] })
    }

    const [ret] = await db.query(`INSERT INTO kurzus SET ?`, newCourse)

    return res.sendStatus(200)
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }

})


router.get('/', async (req, res) => {
  try {
    const [ret] = await db.query(`SELECT * FROM kurzus`)
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})


module.exports = router;