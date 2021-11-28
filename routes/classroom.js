const { Router } = require('express');
const db = require('../db');

const router = Router();
router.get('/', async (req, res) => {
  try {
    const [ret] = await db.query(`SELECT * FROM terem`)
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

router.get('/:epulet_kod', async (req, res) => {
  const { epulet_kod } = req.params
  try {
    const [ret] = await db.query(`SELECT * FROM terem WHERE terem.epulet_kod=?`, [epulet_kod])
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})
module.exports = router;