const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.field_of_study = !isEmpty(data.field_of_study) ? data.field_of_study : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School is required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree is required';
  }

  if (Validator.isEmpty(data.field_of_study)) {
    errors.field_of_study = 'Field of Study is required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'Date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}