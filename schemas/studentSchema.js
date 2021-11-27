const yup = require('yup')

const newStudentSchema = yup.object().shape({
  szemeszterek: yup.number().integer().positive().max(100).optional(),
  vezeteknev: yup.string().trim().min(1).required(),
  keresztnev: yup.string().trim().min(1).required()
});


module.exports = {
  newStudentSchema
}