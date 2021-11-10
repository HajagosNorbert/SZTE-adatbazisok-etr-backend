const { Router } = require('express');
const router = Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const [users] = await db.query('SELECT * FROM felhasznalo');
  res.json(users)
})

router.get('/:kod', async (req, res) => {
  const { kod } = req.params;
  const [user] = await db.query(`SELECT * FROM felhasznalo WHERE kod = ${kod}`);
  if (!user[0]) {
    return res.sendStatus(404)
  }
  return res.json(user)
})

router.post('/instructor/', (req, res) => {
  const instructor = req.body.user;
  console.log(req.body)

  return res.send('Successfuly inserted user')
})

module.exports = router;