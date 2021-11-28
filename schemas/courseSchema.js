const yup = require('yup')

const newCourseSchema = yup.object().shape({
  nev: yup.string().trim().required(),
  max_letszam: yup.number().integer().positive().max(9000).optional(),
  oktato_kod: yup.number().positive().nullable().optional(),
  terem_kod: yup.number().integer().required(),
  epulet_kod: yup.string().trim().uppercase().max(63).required()
});

const updateCourseSchema = yup.object().shape({
  nev: yup.string().trim().min(1).optional(),
  max_letszam: yup.number().integer().positive().max(9000).optional(),
  oktato_kod: yup.number().positive().nullable().optional(),
  terem_kod: yup.number().integer().optional(),
  epulet_kod: yup.string().trim().min(1).uppercase().max(63).optional()
})

module.exports = {
  newCourseSchema,
  updateCourseSchema
}