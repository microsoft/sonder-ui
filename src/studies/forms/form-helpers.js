/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// validateField function: accepts HTMLInputElement | HTMLSelectElement, returns boolean valid/not valid
// assumes all fields are at least required
// check for a data-expected string; if present, perform regexp check against that
// check for a data-errormessage string; if present and failed data-expected, display custom error message
function validateField(field) {
  const value = field.value.trim();
  const regexString = field.getAttribute('data-expected');
  const errorEl = field.parentNode.querySelector('.error');

  let valid = true;
  let errormessage = '';

  // validate field
  if (value === '') {
    errormessage = 'This field is required';
    valid = false;
  }
  else if (regexString && !value.match(new RegExp(regexString)).length === 1) {
    errormessage = field.getAttribute('data-errormessage') || 'Please enter a valid value';
    valid = false;
  }

  // update DOM
  if (valid) {
    field.setAttribute('aria-invalid', 'false');
    field.classList.remove('invalid');

    if (errorEl) {
      errorEl.innerHTML = '';
    }
  }
  else {
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('invalid');

    if (errorEl) {
      errorEl.innerHTML = errormessage;
    }
  }

  return valid;
}