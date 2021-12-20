import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import RenderSelectField from '../RenderSelectField';
import RemoveButton from '../RemoveButton';
import FieldLabel from '../FieldLabel';
import StatusAlert from '../StatusAlert';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './DocType.messages.js';

class DocType extends React.Component {
    constructor(props) {
      super(props);
      this.handleRemove = this.handleRemove.bind(this);
    }
  
    handleRemove(index) {
      this.props.fields.remove(index);
    }

    render() {
        const {
                fields,
                disabled,
                docTypeInfo: {
                  docTypes,
                },
                meta: {
                    submitFailed,
                    error,
                },
            } = this.props;
        
        return (
        <div className="transcript-languages mb-3" name={fields.name} tabIndex="-1">
        {submitFailed && error
          && (
          <StatusAlert
            alertType="danger"
            message={error}
          />
          )}
        <ul className="list-group p-0 m-0 container-fluid">
          {fields.map((t, index) => (
            <li className="transcript-language list-group-item row d-flex align-items-center px-0 mx-0" key={t}>
              <div className="col-11">
                <Field
                  name={`${t}`}
                  component={RenderSelectField}
                  options={docTypes}
                  type="text"
                  label={
                    <FieldLabel
                        text={this.props.intl.formatMessage(messages['course-run.edit.doc_type.label'])}
                        required
                    />
                  }
                  extraInput={{ onInvalid: this.openCollapsible }}
                  disabled={disabled}
                  required
                />
              </div>
              <RemoveButton
                className="col-1"
                label={this.props.intl.formatMessage(messages['course-run.edit.doc_type.remove'])}
                onRemove={this.handleRemove}
                targetFieldNumber={index}
                disabled={disabled}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-outline-primary js-add-button mt-2"
          onClick={() => fields.push({})}
          disabled={disabled}
        >
          {this.props.intl.formatMessage(messages['course-run.edit.doc_type.add'])}
        </button>
      </div>
    );
    }
}
DocType.propTypes = {
    intl: intlShape.isRequired,
    fields: PropTypes.instanceOf(FieldArray).isRequired,
    docTypes: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    disabled: PropTypes.bool,
    extraInput: PropTypes.shape({}),
    meta: PropTypes.shape({
      submitFailed: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
  };

DocType.defaultProps = {
    disabled: false,
    extraInput: {},
    docTypes: [],
  };

export default (injectIntl(DocType));