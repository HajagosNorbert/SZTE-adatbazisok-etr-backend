const yup = require('yup')

const newCourseSchema = yup.object().shape({
  nev: yup.string().trim().required(),
  max_letszam: yup.number().integer().positive().max(9000).optional(),
  oktato_kod: yup.number().positive().nullable().optional(),
  terem_kod: yup.number().integer().required(),
  epulet_kod: yup.string().trim().uppercase().max(63).required()
});


module.exports = {
  newCourseSchema
}