'use strict';

//var React = require('react');
//var _ = require('underscore');
//var $ = require('jquery');
//var BindToMixin = require('./BindToMixin');
//var PrettyJson = require('./PrettyJson').PrettyJson;
//var PersonComponent = require('./PersonComponent');
//var TextBoxInput = require('./TextBoxInput');
//var FormSchema = require("business-rules-engine/commonjs/FormSchema");
var Binder = Binder.default;
var Hobby = React.createClass({
  displayName: 'Hobby',

  handleClick: function handleClick(e) {
    e.preventDefault();
    return this.props.onDelete(this.props.model.value);
  },
  handleChange: function handleChange(e) {
    //e.preventDefault();
    this.frequency().value = e.target.value;
  },
  frequency: function frequency() {
    return Binder.bindTo(this.props.model, 'Frequency');
  },
  frequencyName: function frequencyName() {
    return 'frequency' + this.props.index;
  },
  hobbyName: function hobbyName() {
    return this.props.index + 1 + '. hobby name';
  },
  validationState: function validationState(error) {
    return error.HasErrors ? 'error' : '';
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(ReactBootstrap.Input, {
        type: 'text',
        label: this.hobbyName(),
        valueLink: Binder.bindTo(this.props.model, 'HobbyName'),
        buttonAfter: React.createElement(
          ReactBootstrap.Button,
          { onClick: this.handleClick },
          'Delete'
        ),
        bsStyle: this.validationState(this.props.error.HobbyName),
        help: this.props.error.HobbyName.ErrorMessage
      }),
      React.createElement(
        'div',
        { 'class': 'form-group' },
        React.createElement(
          'label',
          { 'class': 'col-sm-4 control-label' },
          'Frequency:'
        ),
        React.createElement(
          'div',
          { 'class': 'col-sm-8' },
          React.createElement(
            RadioGroup,
            {
              name: this.frequencyName(),
              value: this.frequency().value,
              onChange: this.handleChange
            },
            React.createElement(
              'div',
              null,
              React.createElement(ReactBootstrap.Input, {
                label: 'Daily',
                groupClassName: 'radio inline',
                wrapperClassName: 'radio inline',
                type: 'radio',
                value: 'Daily'
              }),
              React.createElement(ReactBootstrap.Input, {
                label: 'Weekly',
                groupClassName: 'radio inline',
                type: 'radio',
                value: 'Weekly'
              }),
              React.createElement(ReactBootstrap.Input, {
                label: 'Monthly',
                groupClassName: 'radio inline',
                type: 'radio',
                value: 'Monthly'
              })
            )
          )
        )
      ),
      React.createElement(CheckBoxInput, {
        type: 'checkbox',
        label: 'Is this a paid hobby?',
        model: Binder.bindTo(this.props.model, 'Paid')
      }),
      React.createElement(CheckBoxInput, {
        type: 'checkbox',
        label: 'Would you recommend this hobby to a friend?',
        model: Binder.bindTo(this.props.model, 'Recommendation')
      })
    );
  }
});

var HobbyForm = React.createClass({
  displayName: 'HobbyForm',

  getInitialState: function getInitialState() {
    return {
      data: {},
      rules: new FormSchema.JsonSchemaRuleFactory(BusinessRules).CreateRule('Main')
    };
  },
  addHobby: function addHobby(e) {
    if (this.state.data.Hobbies === undefined) this.state.data.Hobbies = [];
    this.state.data.Hobbies.push({});
    this.setState({ data: this.state.data });
  },
  result: function result() {
    if (this.state.rules === undefined) return { Errors: {} };
    return Utils.CompositeDotObject.Transform(this.state.rules.Validate(this.state.data)).Main;
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        ReactBootstrap.Panel,
        { header: 'Hobby form', bsStyle: 'primary' },
        React.createElement(
          'div',
          null,
          React.createElement(PersonComponent, {
            personModel: Binder.bindToState(this, 'data', 'Person'),
            error: this.result().Person
          }),
          React.createElement(
            ReactBootstrap.Button,
            { onClick: this.addHobby },
            'Add hobby'
          ),
          '\xA0',
          React.createElement(
            'span',
            { className: 'error' },
            this.result().Hobbies.PropRule.ErrorMessage
          ),
          React.createElement('br', null),
          React.createElement(HobbyList, {
            model: Binder.bindArrayToState(this, 'data', 'Hobbies'),
            errors: this.result().Hobbies.Children
          })
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(PrettyJson, { json: this.state.data })
      )
    );
  }
});

var HobbyList = React.createClass({
  displayName: 'HobbyList',

  handleDelete: function handleDelete(hobby) {
    return this.props.model.remove(hobby);
  },
  render: function render() {
    if (this.props.model.items === undefined) return React.createElement(
      'span',
      null,
      'There are no hobbies.'
    );

    var hobbyNodes = this.props.model.items.map(function (hobby, index) {
      return React.createElement(Hobby, {
        model: hobby,
        key: index,
        index: index,
        onDelete: this.handleDelete,
        error: this.props.errors[index]
      });
    }, this);
    return React.createElement(
      'div',
      { className: 'commentList' },
      hobbyNodes
    );
  }
});

var PersonComponent = React.createClass({
  displayName: 'PersonComponent',

  validationState: function validationState(error) {
    return error.HasErrors ? 'error' : '';
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(ReactBootstrap.Input, {
        label: 'First name',
        type: 'text',
        bsStyle: this.validationState(this.props.error.FirstName),
        help: this.props.error.FirstName.ErrorMessage,
        valueLink: Binder.bindTo(this.props.personModel, 'FirstName'),
        hasFeedback: true
      }),
      React.createElement(ReactBootstrap.Input, {
        label: 'Last name',
        type: 'text',
        bsStyle: this.validationState(this.props.error.LastName),
        help: this.props.error.LastName.ErrorMessage,
        valueLink: Binder.bindTo(this.props.personModel, 'LastName'),
        hasFeedback: true
      }),
      React.createElement(ReactBootstrap.Input, {
        label: 'Email',
        type: 'text',
        bsStyle: this.validationState(this.props.error.Contact.Email),
        help: this.props.error.Contact.Email.ErrorMessage,
        valueLink: Binder.bindTo(this.props.personModel, 'Contact.Email'),
        hasFeedback: true
      })
    );
  }
});

var TextBoxInput = React.createClass({
  displayName: 'TextBoxInput',

  render: function render() {
    var valueModel = this.props.model;
    var handleChange = function handleChange(e) {
      valueModel.value = e.target.value;
    };
    return React.createElement('input', { type: 'text', onChange: handleChange, value: valueModel.value });
  }
});

var CheckBoxInput = React.createClass({
  displayName: 'CheckBoxInput',

  render: function render() {
    var valueModel = this.props.model;
    var handleChange = function handleChange(e) {
      valueModel.value = e.target.checked;
    };

    return React.createElement(ReactBootstrap.Input, {
      type: 'checkbox',
      label: this.props.label,
      onChange: handleChange,
      checked: valueModel.value
    });
  }
});

var PrettyJson = React.createClass({
  displayName: 'PrettyJson',

  replacer: function replacer(match, pIndent, pKey, pVal, pEnd) {
    var key = '<span class=json-key>';
    var val = '<span class=json-value>';
    var str = '<span class=json-string>';
    var r = pIndent || '';
    if (pKey) r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
    if (pVal) r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
    return r + (pEnd || '');
  },

  prettyPrint: function prettyPrint(obj) {
    var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;
    return JSON.stringify(obj, null, 3).replace(/&/g, '&amp;').replace(/\\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(jsonLine, this.replacer);
  },
  render: function render() {
    return React.createElement('pre', {
      dangerouslySetInnerHTML: { __html: this.prettyPrint(this.props.json) }
    });
  }
});

var RadioGroup = React.createClass({
  displayName: 'RadioGroup',
  getInitialState: function getInitialState() {
    // check the first block of comment in `setCheckedRadio`
    return { defaultValue: this.props.defaultValue };
  },

  componentDidMount: function componentDidMount() {
    this.setRadioNames();
    this.setCheckedRadio();
  },

  componentDidUpdate: function componentDidUpdate() {
    this.setRadioNames();
    this.setCheckedRadio();
  },

  render: function render() {
    return React.DOM.div({ onChange: this.props.onChange }, this.props.children);
  },

  setRadioNames: function setRadioNames() {
    // stay DRY and don't put the same `name` on all radios manually. Put it on
    // the tag and it'll be done here
    var $radios = this.getRadios();
    for (var i = 0, length = $radios.length; i < length; i++) {
      $radios[i].setAttribute('name', this.props.name);
    }
  },

  getRadios: function getRadios() {
    return this.getDOMNode().querySelectorAll('input[type="radio"]');
  },

  setCheckedRadio: function setCheckedRadio() {
    var $radios = this.getRadios();
    // if `value` is passed from parent, always use that value. This is similar
    // to React's controlled component. If `defaultValue` is used instead,
    // subsequent updates to defaultValue are ignored. Note: when `defaultValue`
    // and `value` are both passed, the latter takes precedence, just like in
    // a controlled component
    var destinationValue = this.props.value != null ? this.props.value : this.state.defaultValue;

    for (var i = 0, length = $radios.length; i < length; i++) {
      var $radio = $radios[i];

      // intentionally use implicit conversion for those who accidentally used,
      // say, `valueToChange` of 1 (integer) to compare it with `value` of "1"
      // (auto conversion to valid html value from React)
      if ($radio.value == destinationValue) {
        $radio.checked = true;
      }
    }
  },

  getCheckedValue: function getCheckedValue() {
    var $radios = this.getRadios();

    for (var i = 0, length = $radios.length; i < length; i++) {
      if ($radios[i].checked) {
        return $radios[i].value;
      }
    }

    return null;
  }
});

var BusinessRules = {
  Person: {
    type: 'object',
    properties: {
      FirstName: {
        type: 'string',
        title: 'First name',
        required: 'true',
        maxLength: '15'
      },
      LastName: {
        type: 'string',
        title: 'Last name',
        required: 'true',
        maxLength: '15'
      },
      Contact: {
        type: 'object',
        properties: {
          Email: {
            type: 'string',
            title: 'Email',
            required: 'true',
            maxLength: 100,
            email: 'true'
          }
        }
      }
    }
  },
  Hobbies: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        HobbyName: {
          type: 'string',
          title: 'HobbyName',
          required: 'true',
          maxLength: 100
        },
        Frequency: {
          type: 'string',
          title: 'Frequency',
          enum: ['Daily', 'Weekly', 'Monthly']
        },
        Paid: {
          type: 'boolean',
          title: 'Paid'
        },
        Recommedation: {
          type: 'boolean',
          title: 'Recommedation'
        }
      }
    },
    maxItems: 4,
    minItems: 2
  }
};

React.render(React.createElement(HobbyForm, null), document.getElementById('content'));