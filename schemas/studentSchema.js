const yup = require('yup')

const newStudentSchema = yup.object().shape({
  szemeszterek: yup.number().integer().positive().lessThan(100).optional(),
  vezeteknev: yup.string().required(),
  keresztnev: yup.string().required()
});


module.exports = {
  newStudentSchema
}