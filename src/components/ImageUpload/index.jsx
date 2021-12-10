import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import StatusAlert from '../StatusAlert';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './ImageUpload.messages.js';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.input.value,
      sizeValidationError: '',
    };

    this.handleFilePicked = this.handleFilePicked.bind(this);
    this.sizeValidator = this.sizeValidator.bind(this);
  }

  updateValue(value) {
    this.setState({ value });
    this.props.input.onChange(value);
  }

  handleFilePicked(event) {
    const {
      intl,
      maxImageSizeKilo,
      requiredWidth,
      requiredHeight,
    } = this.props;
    const reader = new FileReader();
    const file = event.target.files[0];

    // file size is in bytes so we need to convert for our validation check
    if (file && file.size > maxImageSizeKilo * 1000) {
      this.updateValue('');
      this.setState({
        sizeValidationError: intl.formatMessage(messages['image-upload.large-error'], {
          maxImageSizeKilo: maxImageSizeKilo,
          requiredWidth: requiredWidth,
          requiredHeight: requiredHeight
        }),
      });
      return;
    }

    reader.onload = () => {
      this.updateValue(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  sizeValidator(event) {
    const {
      intl,
      requiredWidth,
      requiredHeight,
      meta: {
        pristine,
      },
    } = this.props;

    if (!pristine && (event.target.naturalWidth !== requiredWidth
        || event.target.naturalHeight !== requiredHeight)) {
      this.updateValue('');
      this.setState({
        sizeValidationError: intl.formatMessage(messages['image-upload.size-error'], {
          requiredWidth: requiredWidth,
          requiredHeight: requiredHeight
        }),
      });
    } else {
      this.setState({ sizeValidationError: '' });
    }
  }

  render() {
    const {
      className,
      disabled,
      id,
      input: {
        name,
      },
      label,
      meta: {
        error,
        submitFailed,
      },
    } = this.props;

    const { sizeValidationError } = this.state;

    return (
      <div className={classNames('form-group', className)}>
        <div name={name} tabIndex={-1}>
          <label htmlFor={id} className="w-100 p-0">{label}</label>  {/* eslint-disable-line jsx-a11y/label-has-for */}
          {sizeValidationError
            && (
            <StatusAlert
              alertType="warning"
              message={sizeValidationError}
            />
            )}
          {submitFailed && error
            && (
            <StatusAlert
              alertType="danger"
              message={error}
            />
            )}
          <img src={this.state.value} alt="" className="uploaded-image" onLoad={this.sizeValidator} />
          <input
            id={id}
            type="file"
            accept="image/jpeg, image/png"
            onChange={this.handleFilePicked}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  maxImageSizeKilo: PropTypes.number.isRequired,
  requiredWidth: PropTypes.number.isRequired,
  requiredHeight: PropTypes.number.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    pristine: PropTypes.bool,
    submitFailed: PropTypes.bool,
  }).isRequired,
};

ImageUpload.defaultProps = {
  className: '',
  disabled: false,
};

export default (injectIntl(ImageUpload));
