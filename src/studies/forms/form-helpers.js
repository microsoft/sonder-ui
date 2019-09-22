/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

// Easily instantiate a form
// assumptions:
// fields have .form-input class
// errors have a .error class
// submit button has a .submit class
// form-level notification region has .form-alert class
// all other form content has .form-content class
var UsabilityForm = function(el) {
  this.form = el;
  this.fields = Array.prototype.slice.call(document.querySelectorAll('.form-input'));
  this.submitButton = document.querySelector('.submit');
  this.fieldValidations = this.fields.map((field) => false);
  this.formNotificationEl = el.querySelector('.form-alert');
}

// attach listeners
UsabilityForm.prototype.init = function() {
  var _this = this;
  this.fields.forEach(function (field) {
    field.addEventListener('blur', function(event) {
      var index = _this.fields.indexOf(event.target);
      var isValid = this.validateField(event.target);
      _this.fieldValidations[index] = isValid;
      _this.checkForm();
    });
  });

  this.form.addEventListener('submit', function(event) {
    event.preventDefault();
    _this.form.querySelector('.form-content').innerHTML = '';
    _this.formNotificationEl.innerHTML = 'Success!';
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

  if (isFormValid) {
    this.submitButton.removeAttribute('disabled');
  }
  else {
    this.submitButton.setAttribute('disabled', true);
  }

  return isFormValid;
}

// validateField function: accepts HTMLInputElement | HTMLSelectElement, returns boolean valid/not valid
// assumes all fields are at least required
// check for a data-expected string; if present, perform regexp check against that
// check for a data-errormessage string; if present and failed data-expected, display custom error message
UsabilityForm.prototype.validateField = function(field) {
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
  else if (regexString && !value.match(new RegExp(regexString))) {
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