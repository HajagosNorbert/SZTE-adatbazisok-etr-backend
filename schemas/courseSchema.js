const yup = require('yup')

const newCourseSchema = yup.object().shape({
  max_letszam: yup.number().integer().positive().max(9000).optional(),
  nev: yup.string().trim().min(1).required(),
  oktato: yup.number().positive().nullable().optional(),
  terem: yup.number().integer().required(),
  epulet: yup.string().trim().uppercase().min(1).max(63).required()
});


module.exports = {
  newinstructorOrStudentSchema: newCourseSchema
}