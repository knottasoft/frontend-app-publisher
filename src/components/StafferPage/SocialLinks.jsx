import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RemoveButton from '../RemoveButton';
import FieldLabel from '../FieldLabel';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './SocialLinks.messages.js';

class SocialLinks extends React.Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  getSocialOptions() {
    return [
      { label: this.props.intl.formatMessage(messages['staffer.social.option.default']), value: '' },
      { label: this.props.intl.formatMessage(messages['staffer.social.option.facebook']), value: 'facebook' },
      { label: this.props.intl.formatMessage(messages['staffer.social.option.twitter']), value: 'twitter' },
      { label: this.props.intl.formatMessage(messages['staffer.social.option.blog']), value: 'blog' },
      { label: this.props.intl.formatMessage(messages['staffer.social.option.others']), value: 'others' },
    ];
  }

  handleRemove(index) {
    this.props.fields.remove(index);
  }

  render() {
    const { fields, intl } = this.props;

    return (
      <div className="social-links mb-3">
        <ul className="list-group p-0 m-0 container-fluid">
          {fields.map((link, index) => (
            <li className="social-link list-group-item row d-flex align-items-center px-0 mx-0" key={link}>
              <div className="col-4">
                <Field
                  name={`${link}.type`}
                  component={RenderSelectField}
                  options={this.getSocialOptions()}
                  label={
                    <FieldLabel
                        text={intl.formatMessage(messages['staffer.social.type'])}
                        required
                    />
                  }
                  required
                />
              </div>
              <div className="col-3">
                <Field
                  name={`${link}.title`}
                  component={RenderInputTextField}
                  type="text"
                  label={
                    <FieldLabel
                        text={intl.formatMessage(messages['staffer.social.title'])}
                    />
                  }
                />
              </div>
              <div className="col-4">
                <Field
                  name={`${link}.url`}
                  component={RenderInputTextField}
                  type="url"
                  label={
                    <FieldLabel
                        text={intl.formatMessage(messages['staffer.social.url'])}
                        required
                    />
                  }
                  required
                />
              </div>
              <input
                name={`${link}.id`}
                type="hidden"
              />
              <RemoveButton
                className="col-1 m-auto"
                label={intl.formatMessage(messages['staffer.social.button.remove'])}
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
          {intl.formatMessage(messages['staffer.social.button.add'])}
        </button>
      </div>
    );
  }
}

SocialLinks.propTypes = {
  intl: intlShape.isRequired,
  fields: PropTypes.instanceOf(FieldArray).isRequired,
};

export default injectIntl(SocialLinks);
