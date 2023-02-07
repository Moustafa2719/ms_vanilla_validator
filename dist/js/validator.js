﻿var Validate = function (form) {
    this.form = form;
    this.controls = [];

    let fields = form.elements;

    this.classes = {
        show: 'd-block',
        hide: 'd-none',
        hasError: 'has-error',
        validFeedback: 'valid-feedback',
        inValidFeedback: 'invalid-feedback',
        wasValidated : 'was-validated'
    };

    this.validationTypes = {
        required: '_required',
        min: '_min',
        max: '_max',
        minlength: '_minlength',
        maxlength: '_maxlength',
        pattern: '_pattern',
        matching: '_matching'
    };

    this.init(fields);
};

Validate.prototype.init = function (fields) {
    for (let i = 0; i < fields.length; i++) {
        if (
            fields[i].type !== "hidden" &&
            fields[i].nodeName !== "BUTTON"
        ) {
            let input = fields[i];

            let control = {
                validity: false,
                errorType: '',
                name: input.name,
                errorElement: input.name + "-error",
                type: input.type
            };

            if (input.pattern) control.pattern = new RegExp(input.pattern);
            if (input.required) control.required = input.required;
            if (input.minLength > -1) control.minlength = input.minLength;
            if (input.maxLength > -1) control.maxlength = input.maxLength;
            if (input.min > -1) control.min = input.min;
            if (input.max > -1) control.max = input.max;
            if (input.hasAttribute('matchingId')) control.matchingId = input.getAttribute('matchingId');

            this.controls.push(control);
            input.addEventListener('keyup', this.hideError.bind(this, this.controls[i]), true);
        }
    }

    this.addEvents();
};

Validate.prototype.addEvents = function () {
    this.form.addEventListener('submit', this.validate.bind(this), true);
}

Validate.prototype.hideError = function (control) {
    if (control) {
        document.getElementById(control.errorElement).classList.remove(this.classes.show)
        document.getElementById(control.errorElement).classList.add(this.classes.hide);
        document.getElementById(control.errorElement + control.errorType).classList.remove(this.classes.show);
        document.getElementById(control.errorElement + control.errorType).classList.add(this.classes.hide);

        event.target.parentElement.classList.remove(this.classes.hasError);
    }
};

Validate.prototype.validate = function (event) {
    event.preventDefault();

    let validity = true;

    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].validity = true;
        let element = this.form.elements[this.controls[i].name];

        if (this.controls[i].validity == true && this.controls[i].required == true && element.value.trim(" ").length === 0) {
            this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.required);
        }

        if (this.controls[i].validity == true && this.controls[i].minlength && element.value.length < this.controls[i].minlength) {
            this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.minlength);
        }

        if (this.controls[i].validity == true && this.controls[i].maxlength && element.value.length > this.controls[i].maxlength) {
            this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.maxlength);
        }

        if (this.controls[i].validity == true && this.controls[i].min && element.value < this.controls[i].min) {
            this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.min);
        }

        if (this.controls[i].validity == true && this.controls[i].max && element.value > this.controls[i].max) {
            this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.max);
        }

        if (this.controls[i].validity == true && this.controls[i].pattern) {
            if (!this.controls[i].pattern.test(element.value)) {
                this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.pattern);
            }
        }

        if (this.controls[i].validity == true && this.controls[i].matchingId) {
            if (document.getElementById(this.controls[i].matchingId).value !== element.value) {
                this.controls[i] = this.updateValidity(this.controls[i], false, this.validationTypes.matching);
            }
        }

        validity = this.handleErrorsRender(this.controls[i], element, validity);
    }

    if (!validity) {
        this.form.classList.add(this.classes.wasValidated);
        this.form.classList.add(this.classes.hasError);
    } else {
        this.form.classList.remove(this.classes.hasError);
    }

    this.submit(validity);
};

Validate.prototype.handleErrorsRender = function (control, element, validity) {
    if (!control.validity) {
        document.getElementById(control.errorElement).classList.remove(this.classes.validFeedback);
        document.getElementById(control.errorElement).classList.add(this.classes.inValidFeedback);
        document.getElementById(control.errorElement).classList.add(this.classes.show);
        document.getElementById(control.errorElement).classList.remove(this.classes.hide);

        document.getElementById(element.id).classList.add(this.classes.hasError);
        document.getElementById(element.id).parentElement.classList.add(this.classes.hasError);

        document.getElementById(control.errorElement + control.errorType).classList.remove(this.classes.hide);
        document.getElementById(control.errorElement + control.errorType).classList.add(this.classes.show);

        validity = control.validity;
    } else {
        document.getElementById(control.errorElement).classList.remove(this.classes.inValidFeedback);
        document.getElementById(control.errorElement).classList.remove(this.classes.show);
        document.getElementById(control.errorElement).classList.add(this.classes.validFeedback);
        document.getElementById(control.errorElement).classList.add(this.classes.hide);

        document.getElementById(element.id).classList.remove(this.classes.hasError);
    }

    return validity;
};

Validate.prototype.updateValidity = function (control, isValid, errorType = '') {
    control.validity = isValid;
    control.errorType = errorType;

    return control;
};

Validate.prototype.submit = function (validity) {
    if (validity) this.form.submit();
};