import * as yup from 'yup';

export const employeeSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  birthDate: yup.string().required("Birth Date is required"),
  gender: yup.string().required("Gender is required"),
  maritalStatus: yup.string().required("Marital Status is required"),
  position: yup.string().required("Position is required"),
  dateHired: yup.string().required("Date Hired is required"),
  contacts: yup.array().of(
    yup.object().shape({
      value: yup.string().required("Contact Value is required"),
      isPrimary: yup.boolean(),
    })
  ).test('at-least-one-contact', 'At least one contact is required', function (
    value
  ) {
    return value && value.length > 0;
  }),
  addresses: yup.array().of(
    yup.object().shape({
      address1: yup.string().required("Address 1 is required"),
      address2: yup.string().required("Address 2 is required"),
      isPrimary: yup.boolean(),
    })
  ).test('at-least-one-address', 'At least one address is required', function (
    value
  ) {
    return value && value.length > 0;
  }),
});