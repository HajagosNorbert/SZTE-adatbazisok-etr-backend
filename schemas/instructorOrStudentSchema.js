const yup = require('yup')

const newinstructorOrStudentSchema = yup.object().shape({
  tanitast_kezdte: yup.date().optional(),
  szemeszterek: yup.number().integer().positive().lessThan(100).optional(),
  vezeteknev: yup.string().required(),
  keresztnev: yup.string().required()
});


module.exports = {
  newinstructorOrStudentSchema
}