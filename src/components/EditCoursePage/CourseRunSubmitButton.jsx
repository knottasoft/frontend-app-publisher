import PropTypes from 'prop-types';
import React from 'react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import ActionButton from '../ActionButton';

import {
  REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, REVIEWED, UNPUBLISHED,
} from '../../data/constants';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './CourseRunSubmitButton.messages.js';

class CourseRunSubmitButton extends React.Component {
  constructor(props) {
    super(props);
    this.submitLabel = this.submitLabel.bind(this);
  }

  submitLabel() {
    const {
      intl,
      hasNonExemptChanges,
      status,
    } = this.props;
    const { administrator } = getAuthenticatedUser();

    if (administrator) {
      switch (status) {
        case REVIEW_BY_LEGAL:
          return intl.formatMessage(messages['course-run.edit.submit-button.review-by-legal']);
        case REVIEW_BY_INTERNAL:
          return intl.formatMessage(messages['course-run.edit.submit-button.review-by-internal']);
        default:
          break;
      }
    }
    if (status === REVIEWED) {
      if (hasNonExemptChanges) {
        return intl.formatMessage(messages['course-run.edit.submit-button.review.re-submit']);
      }
      return intl.formatMessage(messages['course-run.edit.submit-button.review.update']);
    }
    return intl.formatMessage(messages['course-run.edit.submit-button.review.submit']);
  }

  render() {
    const {
      intl,
      disabled,
      onSubmit,
      submitting,
    } = this.props;

    return (
      <ActionButton
        disabled={disabled}
        onClick={onSubmit}
        labels={{
          default: this.submitLabel(),
          pending: intl.formatMessage(messages['course-run.edit.submit-button.submitting']),
        }}
        state={submitting ? 'pending' : 'default'}
      />
    );
  }
}

CourseRunSubmitButton.propTypes = {
  intl: intlShape.isRequired,
  disabled: PropTypes.bool,
  hasNonExemptChanges: PropTypes.bool,
  onSubmit: PropTypes.func,
  status: PropTypes.string,
  submitting: PropTypes.bool,
};

CourseRunSubmitButton.defaultProps = {
  disabled: false,
  hasNonExemptChanges: false,
  onSubmit: () => {},
  status: UNPUBLISHED,
  submitting: false,
};

export default (injectIntl(CourseRunSubmitButton));
