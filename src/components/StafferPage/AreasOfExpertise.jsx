import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import RemoveButton from '../RemoveButton';
import FieldLabel from '../FieldLabel';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './AreasOfExpertise.messages.js';

class AreasOfExpertise extends React.Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(index) {
    this.props.fields.remove(index);
  }

  render() {
    const { fields, intl } = this.props;

    return (
      <div className="areas-of-expertise mb-3">
        <ul className="list-group p-0 m-0 container-fluid">
          {fields.map((expertise, index) => (
            <li className="area-of-expertise list-group-item row d-flex align-items-center px-0 mx-0" key={expertise}>
              <div className="col-11">
                <Field
                  name={`${expertise}.value`}
                  component={RenderInputTextField}
                  type="text"
                  label={
                      <FieldLabel
                          text={intl.formatMessage(messages['staffer.expertise.label'])}
                          required
                      />
                  }
                  required
                />
              </div>
              <input
                name={`${expertise}.id`}
                type="hidden"
              />
              <RemoveButton
                className="col-1"
                label={intl.formatMessage(messages['staffer.expertise.button.remove'])}
                onRemove={this.handleRemove}
                targetFieldNumber={index}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-outline-primary js-add-button mt-2"
          onClick={() => fields.push({})}
        >
            {intl.formatMessage(messages['staffer.expertise.button.add'])}
        </button>
      </div>
    );
  }
}

AreasOfExpertise.propTypes = {
  intl: intlShape.isRequired,
  fields: PropTypes.instanceOf(FieldArray).isRequired,
};

export default injectIntl(AreasOfExpertise);
