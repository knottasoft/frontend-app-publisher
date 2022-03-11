import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActionButton from '../ActionButton';
import AreasOfExpertise from './AreasOfExpertise';
import SocialLinks from './SocialLinks';
import ImageUpload from '../ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RichEditor from '../RichEditor';
import FieldLabel from '../FieldLabel';
import ButtonToolbar from '../ButtonToolbar';
import { basicValidate } from '../../utils/validation';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './StafferForm.messages.js';

const BaseStafferForm = ({
  intl,
  handleSubmit,
  pristine,
  isSaving,
  isCreateForm,
  sourceInfo: { referrer },
  cancelStafferInfo,
  organizationName,
}) => {
  const formControlDisabled = pristine || isSaving;

  return (
    <div className="create-staffer-form">
      <form onSubmit={handleSubmit}>
        <Field
          name="profile_image.medium.url"
          component={ImageUpload}
          label={(
            <FieldLabel
              id="image.label"
              text={intl.formatMessage(messages['staffer.form.image.label'])}
              helpText={(
                <div>
                  <p>Требования к изображению:</p>
                  <ul>
                    <li>Размеры изображения должны быть 110×110.</li>
                    <li>Размер изображения должен быть менее 256 КБ.</li>
                  </ul>
                </div>
              )}
              extraText={intl.formatMessage(messages['staffer.form.image.extra'])}
            />
          )}
          id="profile_image"
          maxImageSizeKilo={256}
          requiredWidth={110}
          requiredHeight={110}
          className="staffer-image"
          required={isCreateForm}
        />
        <Field
          name="given_name"
          component={RenderInputTextField}
          type="text"
          label={
              <FieldLabel
                  text={intl.formatMessage(messages['staffer.form.given_name'])}
              />
          }
          required
        />
        <Field
          name="family_name"
          component={RenderInputTextField}
          type="text"
          label={
              <FieldLabel
                  text={intl.formatMessage(messages['staffer.form.family_name'])}
              />
          }
          required
        />
        <Field
          name="position.title"
          component={RenderInputTextField}
          type="text"
          label={(
            <FieldLabel
              id="title.label"
              text={intl.formatMessage(messages['staffer.form.position.title'])}
              helpText={(
                <div>
                  <p>Должность инструктора в вашей организации.</p>
                  <p><b>Примеры:</b></p>
                  <ul>
                    <li>Профессор</li>
                    <li>Разработчик контента</li>
                    <li>Директор</li>
                  </ul>
                </div>
              )}
            />
          )}
          required
        />
        <Field
          name="position.organization_override"
          component={RenderInputTextField}
          type="text"
          label={
              <FieldLabel
                  text={intl.formatMessage(messages['staffer.form.position.organization_override'])}
              />
          }
          extraInput={{ value: organizationName }}
          required
        />
        <Field
          name="bio"
          component={RichEditor}
          label={
              <FieldLabel
                  text={intl.formatMessage(messages['staffer.form.bio'])}
              />
          }
          maxChars={250}
          validate={basicValidate}
          id="bio"
        />
        <Field
          name="major_works"
          component={RichEditor}
          label={
              <FieldLabel
                  text={intl.formatMessage(messages['staffer.form.works'])}
                  optional
              />
          }
          maxChars={250}
          id="works"
        />
        <FieldLabel
            text={intl.formatMessage(messages['staffer.form.social-links'])}
            className="mb-2"
            optional
        />
        <FieldArray
          name="urls_detailed"
          component={SocialLinks}
        />
        <FieldLabel
            text={intl.formatMessage(messages['staffer.form.expertise'])}
            className="mb-2"
            optional
        />
        <FieldArray
          name="areas_of_expertise"
          component={AreasOfExpertise}
        />
        <ButtonToolbar>
          <Link
            className="btn btn-outline-primary form-cancel-btn"
            to={referrer || '/'}
            disabled={formControlDisabled}
            onClick={cancelStafferInfo}
          >
              {intl.formatMessage(messages['staffer.form.button.cancel'])}
          </Link>
          <ActionButton
            disabled={formControlDisabled}
            labels={isCreateForm ? {
                default: intl.formatMessage(messages['staffer.form.create.button.create']),
                pending: intl.formatMessage(messages['staffer.form.create.button.pending']),
            } : {
                default: intl.formatMessage(messages['staffer.form.edit.button.create']),
                pending: intl.formatMessage(messages['staffer.form.edit.button.pending']),
            }}
            state={isSaving ? 'pending' : 'default'}
          />
        </ButtonToolbar>
      </form>
    </div>
  );
};

BaseStafferForm.propTypes = {
  intl: intlShape.isRequired,
  cancelStafferInfo: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  isCreateForm: PropTypes.bool,
  organizationName: PropTypes.string,
  pristine: PropTypes.bool.isRequired,
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }).isRequired,
};

BaseStafferForm.defaultProps = {
  cancelStafferInfo: () => {},
  isSaving: false,
  isCreateForm: false,
  organizationName: '',
};

export default reduxForm({
  form: 'staffer-form',
})(injectIntl(BaseStafferForm));

export { basicValidate, BaseStafferForm };
