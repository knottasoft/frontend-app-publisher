import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActionButton from '../ActionButton';
import ImageUpload from '../ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import FieldLabel from '../FieldLabel';
import ButtonToolbar from '../ButtonToolbar';
import { basicValidate } from '../../utils/validation';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './CollaboratorForm.messages.js';

const BaseCollaboratorForm = ({
  intl,
  handleSubmit,
  pristine,
  isSaving,
  isCreateForm,
  sourceInfo: { referrer },
  cancelCollaboratorInfo,
}) => {
  const formControlDisabled = pristine || isSaving;

  return (
    <div className="create-collaborator-form">
      <form onSubmit={handleSubmit}>
        <Field
          name="image"
          component={ImageUpload}
          label={(
            <FieldLabel
              id="image.label"
              text={intl.formatMessage(messages['collaborator.form.image.label'])}
              helpText={(
                <div>
                  <p>Image Requirements:</p>
                  <ul>
                    <li>The image dimensions must be 200px × 100px.</li>
                    <li>The image size must be less than 256KB.</li>
                  </ul>
                </div>
              )}
              extraText={intl.formatMessage(messages['collaborator.form.image.extra'])}
            />
          )}
          id="logo_image"
          maxImageSizeKilo={256}
          requiredWidth={200}
          requiredHeight={100}
          className="collaborator-image"
          required={isCreateForm}
        />
        <Field
          name="name"
          component={RenderInputTextField}
          type="text"
          label={
            <FieldLabel
                text={intl.formatMessage(messages['collaborator.form.name.label'])}
            />
          }
          required
        />
        <ButtonToolbar>
          <Link
            className="btn btn-outline-primary form-cancel-btn"
            to={referrer || '/'}
            disabled={formControlDisabled}
            onClick={cancelCollaboratorInfo}
          >
            {intl.formatMessage(messages['collaborator.form.button.cancel'])}
          </Link>
          <ActionButton
            disabled={formControlDisabled}
            labels={isCreateForm ? {
              default: intl.formatMessage(messages['collaborator.form.create.button.create']),
              pending: intl.formatMessage(messages['collaborator.form.create.button.pending']),
            } : {
              default: intl.formatMessage(messages['collaborator.form.edit.button.create']),
              pending: intl.formatMessage(messages['collaborator.form.edit.button.pending']),
            }}
            state={isSaving ? 'pending' : 'default'}
          />
        </ButtonToolbar>
      </form>
    </div>
  );
};

BaseCollaboratorForm.propTypes = {
  intl: intlShape.isRequired,
  cancelCollaboratorInfo: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  isCreateForm: PropTypes.bool,
  pristine: PropTypes.bool.isRequired,
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
};

BaseCollaboratorForm.defaultProps = {
  cancelCollaboratorInfo: () => {},
  isSaving: false,
  isCreateForm: false,
};

export default reduxForm({
  form: 'collaborator-form',
})(injectIntl(BaseCollaboratorForm));

export { basicValidate, BaseCollaboratorForm };
