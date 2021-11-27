const yup = require('yup')

const newInstructorSchema = yup.object().shape({
  tanitast_kezdte: yup.date().optional(),
  vezeteknev: yup.string().trim().required(),
  keresztnev: yup.string().trim().required()
});


module.exports = {
  newInstructorSchema
}