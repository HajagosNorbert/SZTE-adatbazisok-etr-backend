const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newCourseSchema, updateCourseSchema, updateCourseStudents } = require('../schemas/courseSchema');

const router = Router();

async function oktatoNotExists(id) {
  const [ret] = await db.query(`SELECT * FROM felhasznalo INNER JOIN oktato on felhasznalo.kod = oktato.oktato_kod WHERE felhasznalo.kod = ? LIMIT 1`, [id])
  return ret.length === 0
}

async function buildingNotExists(id) {
  const [ret] = await db.query(`SELECT * FROM epulet WHERE epulet.kod = ? LIMIT 1`, [id])
  return ret.length === 0
}

async function classroomNotExists(id) {
  const [ret] = await db.query(`SELECT * FROM terem INNER JOIN epulet on terem.epulet_kod = epulet.kod WHERE terem.kod = ? LIMIT 1`, [id])
  return ret.length === 0
}

async function classroomWithBuildingNotExists(classroomId, buildingId) {
  const [ret] = await db.query(`SELECT * FROM terem INNER JOIN epulet on terem.epulet_kod = epulet.kod WHERE terem.kod = ? AND epulet.kod = ? LIMIT 1`, [classroomId, buildingId])
  return ret.length === 0
}

router.post('/', schemaValidation(newCourseSchema), async (req, res) => {
  const newCourse = req.body;

  try {
    if (newCourse.oktato_kod && await oktatoNotExists(newCourse.oktato_kod))
      return res.status(404).send({ errors: ['Oktató nem található'] })
    if (await buildingNotExists(newCourse.epulet_kod))
      return res.status(404).send({ errors: ['Épület nem található'] })
    if (await classroomNotExists(newCourse.terem_kod))
      return res.status(404).send({ errors: ['Terem nem található'] })

    const [ret] = await db.query(`INSERT INTO kurzus SET ?`, newCourse)

    return res.sendStatus(200)
  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.patch('/:kod', schemaValidation(updateCourseSchema), async (req, res) => {
  const { kod } = req.params;
  const courseFields = req.body;

  if (courseFields.oktato_kod && await oktatoNotExists(courseFields.oktato_kod))
    return res.status(404).send({ errors: ['Oktató nem található'] })
  if (courseFields.terem_kod && await classroomNotExists(courseFields.terem_kod))
    return res.status(404).send({ errors: ['Terem nem található'] })
  if (courseFields.epulet_kod && await buildingNotExists(courseFields.epulet_kod))
    return res.status(404).send({ errors: ['Épület nem található'] })
  if (courseFields.epulet_kod && courseFields.terem_kod && await classroomWithBuildingNotExists(courseFields.terem_kod, courseFields.epulet_kod))
    return res.status(404).send({ errors: ['Nincs ilyen terem az épületben'] })


  try {
    const [ret] = await db.query(`UPDATE kurzus SET ? WHERE kod = ?`, [courseFields, kod])
    const { insertId } = ret;
    return res.json({ insertId })

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/', async (req, res) => {
  try {
    const [ret] = await db.query(`
    SELECT kod, nev, max_letszam, oktato_kod, terem_kod, epulet_kod, COUNT(hallgato_kod) as letszam
    FROM kurzus 
    LEFT JOIN feliratkozas ON feliratkozas.kurzus_kod = kurzus.kod
    GROUP BY kurzus.kod
    `)

    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/:kod/students', async (req, res) => {
  const { kod } = req.params

  try {
    const [ret] = await db.query(`
    SELECT vezeteknev, keresztnev, hallgato_kod
    FROM kurzus 
    LEFT JOIN feliratkozas ON feliratkozas.kurzus_kod = kurzus.kod
    INNER JOIN felhasznalo ON felhasznalo.kod = feliratkozas.hallgato_kod
    WHERE kurzus.kod =?
    `, [kod])

    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.patch('/:kod/students', schemaValidation(updateCourseStudents), async (req, res) => {
  const { kod } = req.params;
  const studentsInCourse = req.body;
  const insertionData = studentsInCourse.map(studId => [kod, studId])

  try {
    await db.query(`DELETE FROM feliratkozas WHERE feliratkozas.kurzus_kod = ?`, [kod]);
    if (Array.isArray(insertionData) && insertionData.length !== 0) {
      const [ret] = await db.query(`INSERT INTO feliratkozas (kurzus_kod, hallgato_kod) VALUES ?`, [insertionData])
    }

    return res.sendStatus(200)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/mostexperienced', async (req, res) => {
  try {
    const [ret] = await db.query(`
    SELECT kod, nev, max_letszam, oktato_kod, terem_kod, epulet_kod, COUNT(hallgato_kod) as letszam
    FROM kurzus 
    LEFT JOIN feliratkozas ON feliratkozas.kurzus_kod = kurzus.kod
    WHERE oktato_kod = (
      SELECT oktato.oktato_kod FROM oktato
      INNER JOIN kurzus ON kurzus.oktato_kod = oktato.oktato_kod
      ORDER BY oktato.tanitast_kezdte
      LIMIT 1
      )
    GROUP BY kurzus.kod
    `)
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})


router.delete('/:kod', async (req, res) => {

  const { kod } = req.params;

  try {
    await db.query(`DELETE FROM kurzus WHERE kod = ?`, [kod]);
    return res.sendStatus(200)
  } catch (e) {
    if (e.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).send({ errors: ['Kurzus nem üres! Törléshez távolítsd el a hallgatókat'] })
    }
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})
module.exports = router;