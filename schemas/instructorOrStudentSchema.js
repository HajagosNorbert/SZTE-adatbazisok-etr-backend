const yup = require('yup')

const newinstructorOrStudentSchema = yup.object().shape({
  tanitast_kezdte: yup.date().optional(),
  szemeszterek: yup.number().integer().positive().max(100).optional(),
  vezeteknev: yup.string().trim().min(1).required(),
  keresztnev: yup.string().trim().min(1).required()
});


module.exports = {
  newinstructorOrStudentSchema
}