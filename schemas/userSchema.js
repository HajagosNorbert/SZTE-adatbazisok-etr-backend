const yup = require('yup')

const updateUserSchema = yup.object().shape({
  vezeteknev: yup.string().trim().min(1).optional(),
  keresztnev: yup.string().trim().min(1).optional()
});


module.exports = {
  updateUserSchema
}