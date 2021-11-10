const { Router } = require('express');
const db = require('../db');
const schemaValidation = require('../middlewares/schemaValidation');
const { newInstructorSchema } = require('../schemas/instructorSchema');

const router = Router();

router.post('/', schemaValidation(newInstructorSchema), async (req, res) => {
  const instructor = req.body;
  const columnNames = Object.keys(instructor).join(', ');
  console.log({ columnNames })

  // try {
  //   await db.execute(`INSERT INTO felhasznalo (keresztnev, vezeteknev) VALUES (${keresztnev}, ${vezeteknev})`)
  // } catch (e) {

  // }
  return res.send('Successfuly inserted instructor')
})

module.exports = router;