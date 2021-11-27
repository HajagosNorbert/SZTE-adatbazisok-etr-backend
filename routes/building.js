const { Router } = require('express');
const db = require('../db');

const router = Router();
router.get('/', async (req, res) => {
  try {
    const [ret] = await db.query(`SELECT * FROM epulet`)
    return res.json(ret)

  } catch (e) {
    console.error(e);
    return res.status(500).send({ errors: ['Hiba történt az adatbázis műveletkor'] })
  }
})

module.exports = router;