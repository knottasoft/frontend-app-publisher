import PropTypes from 'prop-types';
import React from 'react';

import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './CourseButtonToolbar.messages.js';

function CourseButtonToolbar(props) {
  const {
    intl,
    className,
    disabled,
    editable,
    onClear,
    onSave,
    pristine,
    publishedContentChanged,
    submitting,
  } = props;

  if (!editable) {
    return null;
  }

  let saveState = 'default';
  if (submitting) {
    saveState = 'pending';
  } else if (pristine) {
    saveState = 'complete';
  } else if (publishedContentChanged) {
    saveState = 'republish';
  }

  return (
    <ButtonToolbar className={className}>
      {!submitting && !pristine
      && (
        <button
          className="btn btn-outline-primary"
          disabled={disabled}
          onClick={onClear}
          type="button"
        >
          {intl.formatMessage(messages['course.edit.button-toolbar.clear-edits'])}
        </button>
      )}
      <ActionButton
        disabled={disabled}
        labels={{
          default: intl.formatMessage(messages['course.edit.button-toolbar.default']),
          republish: intl.formatMessage(messages['course.edit.button-toolbar.republish']),
          pending: intl.formatMessage(messages['course.edit.button-toolbar.pending']),
          complete: intl.formatMessage(messages['course.edit.button-toolbar.complete']),
        }}
        state={saveState}
        onClick={onSave}
      />
    </ButtonToolbar>
  );
}

CourseButtonToolbar.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  onClear: PropTypes.func,
  onSave: PropTypes.func,
  pristine: PropTypes.bool,
  publishedContentChanged: PropTypes.bool,
  submitting: PropTypes.bool,
};

CourseButtonToolbar.defaultProps = {
  className: '',
  disabled: false,
  editable: false,
  onClear: () => {},
  onSave: () => {},
  pristine: false,
  publishedContentChanged: false,
  submitting: false,
};

export default (injectIntl(CourseButtonToolbar));
