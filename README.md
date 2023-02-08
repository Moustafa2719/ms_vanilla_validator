## ms Vanilla validator
 

- a simple Javascript plugin developed in Vanilla Js to provide form validation
- it support min, max, minleangh, maxlength, pattern and matching values validation
- this plugin depend on HTML form attrs, it read form and inputs attr to generate the validators in runtime
- it support Chrome, Firefox, Safari and Eadge browsers
- it require Bootstrap  v5.2.3 css only 

### Installation

`$ npm install ms-validator`

OR

`$ yarn add ms-validator`

### Code Blocks

Form Tag require novalidate and name attr

```html
<form class="p-5" method="get" novalidate name="example_form"></form>
```

Inputs require name and validators attr
```html
<input 
  class="form-control inputForm" 
  type="text" 
  name="INPUT_NAME" 
  required="required"
  min="MIN_NUMBER" <!-- in case number input -->
  max="MAX_NUMBER" <!-- in case number input -->
  minlength="MIN_LENGTH" <!-- in case text input or textarea -->
  maxlength="MAX_LENGTH" <!-- in case text input or textarea -->
  pattern="REGEX" 
  <!-- in case text input or textareamatching input pass the matching input id  -->
  matchingId="MATCHING_INPUT_ID"  
/>
```

####Javascript　

```javascript
window.onload = function () {
  // pass form name attr to the Validator Plugin
  new Validate(document.forms.example_form);
};
```

### Matching Validation example

```html
<div class="col-6">
    <div class="form-group">
        <label class="form-text" for="password"> Password </label>

        <input class="form-control inputForm" type="password" name="password" id="password"
            required="required" />

        <div class="valid-feedback error" id="password-error">
            <span id="password-error_required" class="d-none">password_error_req</span>
        </div>
    </div>
</div>
<div class="col-6">
    <div class="form-group">
        <label class="form-text" for="password">
            Confirm Password
        </label>

        <input class="form-control inputForm" type="password" name="confirm_password"
            id="confirm_password" required="required" matchingId="password" />

        <div class="valid-feedback error" id="confirm_password-error">
            <span id="confirm_password-error_required"
                class="d-none">confirm_password_error_req</span>
            <span id="confirm_password-error_matching"
                class="d-none">confirm_password_error_matching</span>
        </div>
    </div>
</div>
```

### Textarea Example
```html
<div class="col-12">
    <div class="form-group">
        <label class="form-text" for="text">
            Text
        </label>

        <textarea 
          class="form-control inputForm"  
          name="text" id="text"   
          required="required" 
          minlength="10"  
          maxlength="20"> 
        </textarea>

        <div class="valid-feedback error" id="text-error">
            <span id="text-error_required" class="d-none">text_error_req</span>
            <span id="text-error_minlength" class="d-none">text_error_minlength</span>
            <span id="text-error_maxlength" class="d-none">text_error_maxlength</span>
        </div>
    </div>
</div>
```
### GITHUb
https://github.com/Moustafa2719/ms_vanilla_validator