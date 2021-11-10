const validationOptions = {
  abortEarly: false
}

const schemaValidation = (schema) => async (req, res, next) => {
  const { body } = req;
  try {
    await schema.validate(body, validationOptions);
    return next();
  } catch (e) {
    console.error(e);
    return res.status(400).json({ e });
  }
}

module.exports = schemaValidation