const { Router } = require('express');
const router = Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM felhasznalo');
    return res.json(users)
  } catch (e) {
    console.error(e);
    return res.status(500).send('Hiba történt az adatbázis műveletkor')
  }
})

router.get('/:kod', async (req, res) => {
  const { kod } = req.params;
  try {
    const [user] = await db.query(`SELECT * FROM felhasznalo WHERE kod = ${kod}`);
    if (!user[0]) {
      return res.sendStatus(404)
    }
    return res.json(user)
  } catch (e) {
    console.error(e);
    return res.status(500).send('Hiba történt az adatbázis műveletkor')
  }
})

module.exports = router;