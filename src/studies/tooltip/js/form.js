/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// Easily instantiate a form
// assumptions:
// fields have .form-input class
// errors are displayed in a sui-tooltip element
// submit button has a .submit class
// parameters:
// el -- form HTMLElement
// onUpdateForm(valid: boolean) -- function to run when form is updated with new value
// onSubmit(valid: boolean) -- function to run when form is submitted
// validateOnBlur: boolean -- whether to validate and show errors on blur
var UsabilityForm = function(el) {
  this.form = el;
  this.fields = Array.prototype.slice.call(document.querySelectorAll('.form-input[required]'));
  this.submitButton = document.querySelector('.submit');
  this.fieldValidations = this.fields.map((field) => false);
  this.formErrorMessage = '';
}

// attach listeners
UsabilityForm.prototype.init = function() {
  var _this = this;

  // validate on blur
  this.fields.forEach(function (field) {
    field.addEventListener('blur', function(event) {
      // check field
      var index = _this.fields.indexOf(event.target);
      var validation = _this.validateField(event.target);
      _this.fieldValidations[index] = validation.valid;
    });
  });

  this.form.addEventListener('submit', function(event) {
    event.preventDefault();
    _this.fields.forEach(function (field, index) {
      // check field
      var validation = _this.validateField(field);
      _this.fieldValidations[index] = validation.valid;
    });

    var isFormValid = _this.checkForm();
    _this.onSubmit && _this.onSubmit(isFormValid);
  });
}

// check if all field validations are currently true
UsabilityForm.prototype.checkForm = function() {
  var isFormValid = true;
  this.fieldValidations.forEach(function(valid) {
    if (!valid) {
      isFormValid = false;
      return;
    }
  });

  return isFormValid;
}

UsabilityForm.prototype.onSubmit = function(formValid) {
  var formAlert = this.form.querySelector('.form-alert');
  if (formValid) {
    this.form.querySelector('.form-content').innerHTML = '';
    formAlert.classList.remove('error');
    formAlert.classList.add('success');
    formAlert.innerHTML = 'Success!';
  }
  else {
    formAlert.classList.add('error');
    formAlert.innerHTML = 'Your username or password was incorrect. Please fix errors to sign in.';
  }
  formAlert.focus();
}

// validateField function: accepts HTMLInputElement | HTMLSelectElement, returns boolean valid/not valid
// assumes all fields are at least required
// check for a data-expected string; if present, perform regexp check against that
// check for a data-errormessage string; if present and failed data-expected, display custom error message
UsabilityForm.prototype.validateField = function(field) {
  const value = field.value.trim();
  const regexString = field.getAttribute('data-expected');
  const errorEl = field.closest('.error-tooltip');

  let valid = true;
  let errormessage = '';

  // validate field
  if (value === '') {
    errormessage = field.getAttribute('data-errormessage') || 'This field is required';
    valid = false;
  }
  else if (regexString && !value.match(new RegExp(regexString))) {
    errormessage = field.getAttribute('data-errormessage') || 'Please enter a valid value';
    valid = false;
  }

  // update DOM
  if (valid) {
    field.setAttribute('aria-invalid', 'false');
    field.classList.remove('invalid');

    if (errorEl) {
      errorEl.setAttribute('content', '');
    }
  }
  else {
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('invalid');

    if (errorEl) {
      errorEl.setAttribute('content', errormessage);
    }
  }

  return {valid, errormessage};
}