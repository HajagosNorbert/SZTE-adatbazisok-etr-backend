const yup = require('yup')

const newInstructorSchema = yup.object().shape({
  tanitast_kezdte: yup.date().optional(),
  vezeteknev: yup.string().required(),
  keresztnev: yup.string().required()
});


module.exports = {
  newInstructorSchema
}