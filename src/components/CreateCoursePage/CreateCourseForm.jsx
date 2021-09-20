import moment from 'moment';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';
import PriceList from '../PriceList';

import {
  DATE_INPUT_PATTERN,
} from '../../data/constants';
import {
  endDateHelp, runTypeHelp, pacingHelp, startDateHelp, titleHelp, typeHelp, keyHelp,
} from '../../helpText';
import DateTimeField from '../DateTimeField';
import {
  isSafari, localTimeZone, getDateWithDashes, getOptionsData, parseCourseTypeOptions, parseOptions,
} from '../../utils';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import createCourseMessages from './CreateCourse.messages.js';

class BaseCreateCourseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canSetRunKey: false };
  }

  componentDidUpdate(prevProps) {
    const {
      change,
      courseOptions,
      currentFormValues: {
        type: currentType,
        org: currentOrg,
      },
      organizations,
    } = this.props;
    const {
      currentFormValues: {
        type: prevType,
        org: previousOrg,
      },
    } = prevProps;
    if (currentType !== prevType) {
      const courseOptionsData = getOptionsData(courseOptions);
      const parsedTypeOptions = courseOptionsData
        && parseCourseTypeOptions(courseOptionsData.type.type_options);
      const { courseRunTypeOptions } = parsedTypeOptions;
      change('run_type', courseRunTypeOptions[currentType][1].value);
    }
    if (currentOrg !== previousOrg) {
      const selectedOrganization = organizations.find(org => org.key === currentOrg);
      if (selectedOrganization) {
        this.setRunKeyState(selectedOrganization);
      }
    }
  }

  setRunKeyState(selectedOrganization) {
    this.setState({ canSetRunKey: !selectedOrganization.auto_generate_course_run_keys });
  }

  processOrganizations(organizations) {
    let orgSelectList = [{ label: this.props.intl.formatMessage(createCourseMessages['create.course.organization.select']), value: '' }];

    if (organizations) {
      const newOrgs = organizations.map(org => (
        { label: org.name, value: org.key, autoGenerateKey: org.auto_generate_course_run_keys }
      ));
      orgSelectList = orgSelectList.concat(newOrgs);
    }

    return orgSelectList;
  }

  render() {
    const {
      intl,
      currentFormValues,
      handleSubmit,
      organizations,
      pristine,
      isCreating,
      courseOptions,
      courseRunOptions,
    } = this.props;
    const { canSetRunKey } = this.state;
    const courseOptionsData = getOptionsData(courseOptions);
    const parsedTypeOptions = courseOptionsData
      && parseCourseTypeOptions(courseOptionsData.type.type_options);
    const { courseTypeOptions } = parsedTypeOptions;
    const { courseRunTypeOptions } = parsedTypeOptions;
    const { priceLabels } = parsedTypeOptions;
    const courseRunOptionsData = getOptionsData(courseRunOptions);
    const { pacing_type: { choices } } = courseRunOptionsData;
    const pacingTypeOptions = courseRunOptionsData && parseOptions(choices);

    return (
      <div className="create-course-form">
        <h2>{intl.formatMessage(createCourseMessages['create.course.form.header'])}</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <Field
            name="org"
            component={RenderSelectField}
            options={this.processOrganizations(organizations)}
            label={<FieldLabel text={intl.formatMessage(createCourseMessages['create.course.organization'])} required />}
            required
          />
          <Field
            name="title"
            component={RenderInputTextField}
            type="text"
            label={(
              <FieldLabel
                id="title-label"
                text={intl.formatMessage(createCourseMessages['create.course.title'])}
                required
                helpText={titleHelp}
              />
            )}
            required
          />
          <Field
            name="number"
            component={RenderInputTextField}
            type="text"
            label={(
              <FieldLabel
                id="number-label"
                text={intl.formatMessage(createCourseMessages['create.course.number'])}
                required
                extraText={intl.formatMessage(createCourseMessages['create.course.number.extra'])}
                helpText={(
                  <div>
                    <p>
                      Maximum 10 characters. Characters can be letters, numbers, periods,
                      underscores, or hyphens.
                    </p>
                    <p>
                      If a course consists of several modules, the course number can have an
                      ending such as .1x or .2x.
                    </p>
                    <p>
                      <a
                        href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/title_number_guidelines.html#course-number-guidelines"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more.
                      </a>
                    </p>
                    <p><b>Examples:</b></p>
                    <ol>
                      <li>CS002x</li>
                      <li>BIO1.1x, BIO1.2x</li>
                    </ol>
                  </div>
                )}
              />
            )}
            required
          />
          <Field
            name="type"
            component={RenderSelectField}
            options={courseTypeOptions}
            label={(
              <FieldLabel
                id="course-type-label"
                text={intl.formatMessage(createCourseMessages['create.course.enrollment_track'])}
                required
                helpText={typeHelp}
              />
            )}
            required
          />
          <PriceList
            priceLabels={currentFormValues.type ? priceLabels[currentFormValues.type] : {}}
            required
          />
          <h2>{intl.formatMessage(createCourseMessages['create.course.first_run.header'])}</h2>
          <hr />
          {canSetRunKey
            && (
            <Field
              name="courseRunKey"
              component={RenderInputTextField}
              type="text"
              pattern="[a-zA-Z0-9-]+"
              label={(
                <FieldLabel
                  id="courseRunKey-label"
                  text="Run Key"
                  helpText={keyHelp}
                  optional
                />
              )}
            />
            )}
          {/* TODO this should be refactored when paragon supports safari */}
          {/* text inputs for safari */}
          {isSafari
            ? (
              <div>
                <Field
                  name="start"
                  type="text"
                  component={DateTimeField}
                  dateLabel={intl.formatMessage(createCourseMessages['create.course.first_run.start.date'])}
                  timeLabel={intl.formatMessage(createCourseMessages['create.course.first_run.start.time'], { timeZone: localTimeZone }) }
                  helpText={startDateHelp}
                  required
                  maxLength="10"
                  pattern={DATE_INPUT_PATTERN}
                  placeholder="yyyy/mm/dd"
                />
                <Field
                  name="end"
                  type="text"
                  component={DateTimeField}
                  dateLabel={intl.formatMessage(createCourseMessages['create.course.first_run.end.date'])}
                  timeLabel={intl.formatMessage(createCourseMessages['create.course.first_run.end.time'], { timeZone: localTimeZone }) }
                  helpText={endDateHelp}
                  required
                  maxLength="10"
                  pattern={DATE_INPUT_PATTERN}
                  placeholder="yyyy/mm/dd"
                />
              </div>
            )
            // date inputs for all browsers besides safari
            : (
              <div>
                <Field
                  name="start"
                  type="date"
                  component={DateTimeField}
                  dateLabel={intl.formatMessage(createCourseMessages['create.course.first_run.start.date'])}
                  timeLabel={intl.formatMessage(createCourseMessages['create.course.first_run.start.time'], { timeZone: localTimeZone }) }
                  helpText={startDateHelp}
                  required
                  minDate={getDateWithDashes(moment())}
                />
                <Field
                  name="end"
                  type="date"
                  component={DateTimeField}
                  dateLabel={intl.formatMessage(createCourseMessages['create.course.first_run.end.date'])}
                  timeLabel={intl.formatMessage(createCourseMessages['create.course.first_run.end.time'], { timeZone: localTimeZone }) }
                  helpText={endDateHelp}
                  required
                  minDate={getDateWithDashes(moment(currentFormValues.start).add(1, 'd') || moment())}
                />
              </div>
            )}
          <Field
            name="run_type"
            component={RenderSelectField}
            options={currentFormValues.type ? courseRunTypeOptions[currentFormValues.type] : [{
              label: intl.formatMessage(createCourseMessages['create.course.first_run.enrollment_track.label']),
              value: '' }
            ]}
            label={(
              <FieldLabel
                id="course-run-type-label"
                text={intl.formatMessage(createCourseMessages['create.course.first_run.enrollment_track'])}
                required
                helpText={runTypeHelp}
              />
            )}
            required
          />
          <Field
            name="pacing_type"
            type="text"
            component={RenderSelectField}
            options={pacingTypeOptions}
            label={(
              <FieldLabel
                id="pacing_type.label"
                text={intl.formatMessage(createCourseMessages['create.course.first_run.pacing'])}
                helpText={pacingHelp}
              />
            )}
          />
          <ButtonToolbar>
            <Link to="/">
              <button
                type="button"
                className="btn btn-outline-primary"
                disabled={isCreating}
              >
                {intl.formatMessage(createCourseMessages['create.course.cancel_button'])}
              </button>
            </Link>
            <ActionButton
              disabled={pristine}
              labels={{
                default: intl.formatMessage(createCourseMessages['create.course.create_button']),
                pending: intl.formatMessage(createCourseMessages['create.course.creating']),
              }}
              state={isCreating ? 'pending' : 'default'}
            />
          </ButtonToolbar>
        </form>
      </div>
    );
  }
}

BaseCreateCourseForm.defaultProps = {
  change: () => null,
  isCreating: false,
  pristine: true,
  currentFormValues: {},
};

BaseCreateCourseForm.propTypes = {
  intl: intlShape.isRequired,
  change: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    org: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
    type: PropTypes.string,
    prices: PropTypes.shape(),
    start: PropTypes.string,
    end: PropTypes.string,
  }).isRequired,
  currentFormValues: PropTypes.shape({
    org: PropTypes.string,
    type: PropTypes.string,
    start: PropTypes.string,
  }),
  organizations: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  })).isRequired,
  pristine: PropTypes.bool,
  isCreating: PropTypes.bool,
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
};

export default reduxForm({
  form: 'create-course-form',
})(injectIntl(BaseCreateCourseForm));
export { BaseCreateCourseForm };
