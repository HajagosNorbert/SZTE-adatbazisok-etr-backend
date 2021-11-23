const yup = require('yup')

const newInstructorSchema = yup.object().shape({
  tanitast_kezdte: yup.date().optional(),
  vezeteknev: yup.string().trim().min(1).required(),
  keresztnev: yup.string().trim().min(1).required()
});


module.exports = {
  newInstructorSchema
}