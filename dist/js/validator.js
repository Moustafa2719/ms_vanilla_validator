var Validate = function (form) {
    this.form = form;
    this.controls = [];
    this.groups = [];

    let fields = form.elements;

    this.classes = {
        show: 'd-block',
        hide: 'd-none',
        hasError: 'has-error',
        validFeedback: 'valid-feedback',
        inValidFeedback: 'invalid-feedback',
        wasValidated: 'was-validated'
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
            fields[i].type !== "radio" &&
            fields[i].nodeName !== "BUTTON"
        ) {
            let input = fields[i];

            let control = {
                validity: false,
                errorType: '',
                name: input.name,
                errorElement: input.name + "-error",
                type: input.type,
                inGroup: 0,
                value: null
            };

            if (input.pattern) control.pattern = new RegExp(input.pattern);
            if (input.required) control.required = input.required;
            if (input.minLength > -1) control.minlength = input.minLength;
            if (input.maxLength > -1) control.maxlength = input.maxLength;
            if (input.min > -1) control.min = input.min;
            if (input.max > -1) control.max = input.max;
            if (input.hasAttribute('matchingId')) control.matchingId = input.getAttribute('matchingId');
            if (input.hasAttribute('group')) control.inGroup = +input.getAttribute('group');

            if (control.inGroup > 0) this.groups.push(control)
            if (control.inGroup === 0) this.controls.push(control);

            if (control.type !== 'select-one') input.addEventListener('keyup', this.hideError.bind(this, control), true);
            if (control.type === 'select-one') input.addEventListener('change', this.hideError.bind(this, control), true);
        }
    }

    this.addEvents();
};

Validate.prototype.addEvents = function () {
    this.form.addEventListener('submit', this.validateBeforeSubmit.bind(this), true);
}

Validate.prototype.validateBeforeSubmit = function (event) {
    event.preventDefault();

    let groupsValidity = this.validateGroup(this.groups);
    let FieldsValidity = this.validateFields(this.controls);

    this.submit(groupsValidity && FieldsValidity);
}

Validate.prototype.validateGroup = function (groups) {
    if (!groups.length) return true;

    let chunks = {};
    let canPass = false;

    groups.forEach(group => {
        if (!chunks[group.inGroup]) chunks[group.inGroup] = [];
        chunks[group.inGroup].push(group)
    });

    for (let key in chunks) {
        let hasValue = false;
        let name;

        for (let i = 0; i < chunks[key].length; i++) {
            let element = this.form.elements[chunks[key][i].name];
            chunks[key][i].value = element.value;
            hasValue = element.value.trim(" ").length > 0 || element.value > 0;
            name = "group_" + chunks[key][i].inGroup;

            if (element.value) this.validateFields([chunks[key][i]]);
            if (hasValue) break;
        }

        this.handleGroupErrorsRender(name, hasValue);
        canPass = hasValue;
    }

    return canPass;
}

Validate.prototype.validateFields = function (fields) {
    let validity = true;

    for (var i = 0; i < fields.length; i++) {
        fields[i].validity = true;
        let element = this.form.elements[fields[i].name];
        fields[i].value = element.value;

        if (fields[i].type == "checkbox") {
            if (fields[i].validity == true && fields[i].required == true && element.checked == false) {
                fields[i] = this.updateValidity(fields[i], false, this.validationTypes.required);
            }
        }

        if (fields[i].validity == true && fields[i].required == true && this.checkRequiredValue(element.value)) {
            fields[i] = this.updateValidity(fields[i], false, this.validationTypes.required);
        }

        if (fields[i].validity == true && fields[i].minlength && this.checkMinLengthValue(element.value, fields[i].minlength)) {
            fields[i] = this.updateValidity(fields[i], false, this.validationTypes.minlength);
        }

        if (fields[i].validity == true && fields[i].maxlength && this.checkMaxLengthValue(element.value, fields[i].maxlength)) {
            fields[i] = this.updateValidity(fields[i], false, this.validationTypes.maxlength);
        }

        if (fields[i].validity == true && fields[i].min && this.checkMinValue(element.value, fields[i].min)) {
            fields[i] = this.updateValidity(fields[i], false, this.validationTypes.min);
        }

        if (fields[i].validity == true && fields[i].max && this.checkMaxValue(element.value, fields[i].max)) {
            fields[i] = this.updateValidity(fields[i], false, this.validationTypes.max);
        }

        if (fields[i].validity == true && fields[i].pattern) {
            if (!this.checkPatternValue(fields[i].pattern, element.value)) {
                fields[i] = this.updateValidity(fields[i], false, this.validationTypes.pattern);
            }
        }

        if (fields[i].validity == true && fields[i].matchingId) {
            if (document.getElementById(fields[i].matchingId).value !== element.value) {
                fields[i] = this.updateValidity(fields[i], false, this.validationTypes.matching);
            }
        }

        validity = this.handleFieldErrorsRender(fields[i], element, validity);
    }

    if (!validity) {
        this.form.classList.add(this.classes.wasValidated);
        this.form.classList.add(this.classes.hasError);
    } else {
        this.form.classList.remove(this.classes.hasError);
    }

    // this.controls = fields;

    return validity;
};

Validate.prototype.hideError = function (control) {
    if (control) {
        document.getElementById(control.errorElement).classList.remove(this.classes.show)
        document.getElementById(control.errorElement).classList.add(this.classes.hide);
        document.getElementById(control.errorElement + control.errorType).classList.remove(this.classes.show);
        document.getElementById(control.errorElement + control.errorType).classList.add(this.classes.hide);

        event.target.parentElement.classList.remove(this.classes.hasError);
    }
};

Validate.prototype.updateValidity = function (control, isValid, errorType = '') {
    control.validity = isValid;
    control.errorType = errorType;

    return control;
};

Validate.prototype.submit = function (validity) {
    if (validity) this.form.submit(validity);
};

Validate.prototype.checkRequiredValue = function (value) {
    return value.trim(" ").length === 0
};

Validate.prototype.checkMinValue = function (value, minRequiredValue) {
    return element.value < minRequiredValue;
};

Validate.prototype.checkMaxValue = function (value, maxRequiredValue) {
    return element.value > maxRequiredValue;
};

Validate.prototype.checkMinLengthValue = function (value, requiredLength) {
    return value.length < requiredLength;
};

Validate.prototype.checkMaxLengthValue = function (value, requiredLength) {
    return value.length > requiredLength;
};

Validate.prototype.checkPatternValue = function (pattern, value) {
    return pattern.test(value);
};

Validate.prototype.handleGroupErrorsRender = function (groupName, validity) {
    document.getElementById(groupName + "-error").classList[validity ? 'remove' : 'add'](this.classes.inValidFeedback);
    document.getElementById(groupName + "-error").classList[!validity ? 'remove' : 'add'](this.classes.validFeedback);
    document.getElementById(groupName + "-error").classList[validity ? 'remove' : 'add'](this.classes.show);
    document.getElementById(groupName + "-error").classList[!validity ? 'remove' : 'add'](this.classes.hide);

    document.getElementById(groupName + "-error_required").classList[validity ? 'remove' : 'add'](this.classes.show);
    document.getElementById(groupName + "-error_required").classList[!validity ? 'remove' : 'add'](this.classes.hide);
}

Validate.prototype.handleFieldErrorsRender = function (control, element, validity) {
    document.getElementById(control.errorElement).classList[!control.validity ? 'remove' : 'add'](this.classes.validFeedback);
    document.getElementById(control.errorElement).classList[control.validity ? 'remove' : 'add'](this.classes.inValidFeedback);
    document.getElementById(control.errorElement).classList[control.validity ? 'remove' : 'add'](this.classes.show);
    document.getElementById(control.errorElement).classList[!control.validity ? 'remove' : 'add'](this.classes.hide);

    document.getElementById(element.id).classList[!control.validity ? 'remove' : 'add'](this.classes.hasError);
    document.getElementById(element.id).parentElement.classList[!control.validity ? 'remove' : 'add'](this.classes.hasError);

    document.getElementById(control.errorElement + control.errorType).classList[!control.validity ? 'remove' : 'add'](this.classes.hide);
    document.getElementById(control.errorElement + control.errorType).classList[control.validity ? 'remove' : 'add'](this.classes.show);

    if (!control.validity) validity = control.validity;
    return validity;
};