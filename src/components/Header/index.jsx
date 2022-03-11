import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import qs from 'query-string';
import { Link } from 'react-router-dom';
import { redirectToLogout } from '@edx/frontend-platform/auth';
import { AppContext } from '@edx/frontend-platform/react';
import { Dropdown, DropdownButton, Hyperlink } from '@edx/paragon';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './Header.messages.js';

const Header = ({ darkModeOn, location, toggleDarkMode, intl }) => {
  const { authenticatedUser } = useContext(AppContext);

  if (darkModeOn) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Allow users to toggle dark mode on if they put in a querystring like ?bananas=1
  const querystringParams = qs.parse(location.search);
  const allowDarkModeToggle = querystringParams.bananas;

  return (
    <header className="site-header mb-3 py-3 border-bottom-blue">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-auto justify-content-start">
            <Hyperlink destination={process.env.STUDIO_BASE_URL}>
              <img src={process.env.LOGO_URL} alt="Лого ЦОПП" height="30" width="60" />
            </Hyperlink>
          </div>
          <div className="col">
            <Link to="/">{intl.formatMessage(messages['header.courses.link'])}</Link>
          </div>
          {allowDarkModeToggle
            && (
            <div className="col-auto justify-content-end">
              <button type="button" className="btn btn-primary" onClick={toggleDarkMode}>
                Переключиться на {darkModeOn ? 'светлый режим' : 'тёмный режим'}
              </button>
            </div>
            )}
          <div className="col-auto justify-content-end">
            <DropdownButton
              alignRight
              title={authenticatedUser.username}
              variant="light"
            >
              <Dropdown.Item
                onClick={() => redirectToLogout(process.env.STUDIO_BASE_URL)}
              >
                {intl.formatMessage(messages['header.dropdown.signout'])}
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  intl: intlShape.isRequired,
  darkModeOn: PropTypes.bool,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  toggleDarkMode: PropTypes.func,
};

Header.defaultProps = {
  darkModeOn: false,
  location: {},
  toggleDarkMode: () => {},
};

export default (injectIntl(Header));
