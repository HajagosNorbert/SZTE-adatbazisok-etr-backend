const yup = require('yup')

const updateUserSchema = yup.object().shape({
  vezeteknev: yup.string().trim().optional(),
  keresztnev: yup.string().trim().optional()
});


module.exports = {
  updateUserSchema
}