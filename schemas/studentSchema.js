const yup = require('yup')

const newStudentSchema = yup.object().shape({
  szemeszterek: yup.number().integer().positive().max(100).optional(),
  vezeteknev: yup.string().trim().required(),
  keresztnev: yup.string().trim().required()
});


module.exports = {
  newStudentSchema
}