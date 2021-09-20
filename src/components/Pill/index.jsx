import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  REVIEW_BY_LEGAL,
  REVIEW_BY_INTERNAL,
  PUBLISHED,
  REVIEWED,
  UNPUBLISHED,
  ARCHIVED,
} from '../../data/constants';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './Pill.messages.js';

const Pill = ({ statuses, intl }) => {
  const pills = [];
  statuses.forEach((status) => {
    switch (status) {
      case ARCHIVED:
        pills.push({
          text: intl.formatMessage(messages['pill.status.archived']),
          className: 'badge badge-light',
        });
        break;
      case UNPUBLISHED:
        pills.push({
          text: intl.formatMessage(messages['pill.status.unsubmitted']),
          className: 'badge badge-warning',
        });
        break;
      case REVIEWED:
        pills.push({
          text: intl.formatMessage(messages['pill.status.scheduled']),
          className: 'badge badge-primary',
        });
        break;
      case REVIEW_BY_LEGAL:
      case REVIEW_BY_INTERNAL:
        pills.push({
          text: intl.formatMessage(messages['pill.status.in_review']),
          className: 'badge badge-light',
        });
        pills.push({
          text: <i className="fa fa-lock" />,
        });
        break;
      case PUBLISHED:
        pills.push({
          text: intl.formatMessage(messages['pill.status.published']),
          className: 'badge badge-success',
        });
        break;
      default:
        break;
    }
  });
  return pills.map(pill => (
    <span className={classNames('ml-2', pill.className)} key={pill.text}>
      {pill.text}
    </span>
  ));
};

Pill.propTypes = {
  intl: intlShape.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default (injectIntl(Pill));
