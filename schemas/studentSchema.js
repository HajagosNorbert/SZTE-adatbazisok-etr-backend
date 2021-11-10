const yup = require('yup')

const newStudentSchema = yup.object().shape({
  szemeszterek: yup.number().integer().positive().lessThan(100).required(),
  vezeteknev: yup.string().required(),
  keresztnev: yup.string().required()
});