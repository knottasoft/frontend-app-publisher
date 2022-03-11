import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { Hyperlink } from '@edx/paragon';

import CourseRunButtonToolbar from './CourseRunButtonToolbar';
import { courseSubmitRun } from '../../data/actions/courseSubmitInfo';
import FieldLabel from '../FieldLabel';
import {
  courseRunIsArchived, localTimeZone, formatDate, isSafari, getDateWithDashes,
  getDateWithSlashes, isNonExemptChanged, isPristine, hasMastersTrack, jsonDeepEqual,
} from '../../utils';
import Pill from '../Pill';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import DateTimeField from '../DateTimeField';
import store from '../../data/store';
import TranscriptLanguage from './TranscriptLanguage';
import Collapsible from '../Collapsible';

import {
  ARCHIVED, DATE_FORMAT, IN_REVIEW_STATUS, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL,
  PUBLISHED, DATE_INPUT_PATTERN, FORMAT_DATE_MATCHER, NORMALIZE_DATE_MATCHER, REVIEWED,
} from '../../data/constants';
import {
  dateEditHelp, runTypeHelp, pacingEditHelp, publishDateHelp,
} from '../../helpText';
import RichEditor from '../RichEditor';
import ListField from '../ListField';
import { Staffer } from '../Staffer';
import renderStaffSuggestion from '../Staffer/renderStaffSuggestion';
import fetchStaffSuggestions from '../Staffer/fetchStaffSuggestions';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './CollapsibleCourseRun.messages.js';
import DocType from '../DocType/DocType';

const determineStatus = run => (courseRunIsArchived(run) ? ARCHIVED : run.status);

const formatCourseRunTitle = (courseRun, intl) => {
  if (courseRun) {
    const labelItems = [];
    let publishDate = '';
    if (courseRun.start) {
      labelItems.push(intl.formatDate(formatDate(courseRun.start)));
    }
    if (courseRun.pacing_type) {
      labelItems.push(courseRun.pacing_type.split('_').map(pacingType => pacingType.charAt(0).toUpperCase() + pacingType.slice(1)).join(' '));
    }
    if (courseRun.status !== PUBLISHED && courseRun.go_live_date) {
      const formattedDate = intl.formatDate(formatDate(courseRun.go_live_date));
      publishDate = intl.formatMessage(messages['course-run.edit.collapsible.title.publish-date'], {formattedDate: formattedDate});
    }
    return (
      <div className="course-run-label">
        <span>{intl.formatMessage(messages['course-run.edit.collapsible.title.course-run-label'], {labelItems: labelItems.join(' - ')})}</span>
        {/*
          TODO: After we have a way of determining if the course run has been edited, that should
          be added into the list of statuses being passed into the Pill component.
        */}
        <Pill statuses={[determineStatus(courseRun)]} />
        <div className="course-run-label">
          <span>{`${publishDate}`}</span>
        </div>
        <div className="course-run-studio-url">
          <>
            {intl.formatMessage(messages['course-run.edit.collapsible.title.course-run-link'])}
            <Hyperlink
              destination={`${process.env.STUDIO_BASE_URL}/course/${courseRun.key}`}
              target="_blank"
            >
              {courseRun.key}
            </Hyperlink>
          </>
        </div>
      </div>
    );
  }
  return (
    <div>
      <span>{intl.formatMessage(messages['course-run.edit.collapsible.title.new-course-run'])}</span>
    </div>
  );
};

class CollapsibleCourseRun extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      returnFromStaffPage: false,
      hasExternalKey: undefined,
    };

    this.openCollapsible = this.openCollapsible.bind(this);
    this.scrollToStaffPosition = this.scrollToStaffPosition.bind(this);
    this.displayOfacRestriction = this.displayOfacRestriction.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.normalizeDate = this.normalizeDate.bind(this);
  }

  componentDidMount() {
    const {
      stafferInfo: { returnToEditCourse },
      sourceInfo: { referringRun },
      courseRun: { key },
    } = this.props;

    if (returnToEditCourse && referringRun === key) {
      this.openCollapsible();
      this.scrollToStaffPosition(returnToEditCourse);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      open,
      returnFromStaffPage,
    } = this.state;
    const {
      courseId,
      currentFormValues: {
        course_runs: courseRuns,
      },
      index,
      runTypeModes,
    } = this.props;
    const {
      returnFromStaffPage: wasReturnedFromStaff,
    } = prevState;

    if (open && returnFromStaffPage) {
      this.scrollToStaffPosition(false);
    }
    if (wasReturnedFromStaff && !returnFromStaffPage) {
      const element = document.getElementById(`${courseId}.staff.label`);
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    // We initialize hasExternalKey to null and then the function will reevaluate it into
    // a boolean which will be our exit state
    if (prevState.hasExternalKey === undefined && courseRuns) {
      const hasExternalKey = hasMastersTrack(courseRuns[index].run_type, runTypeModes);
      this.setState({ hasExternalKey }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  scrollToStaffPosition(focus) {
    this.setState({
      returnFromStaffPage: focus,
    });
  }

  openCollapsible() {
    this.props.onToggle(true);
  }

  displayOfacRestriction(restriction) {
    switch (restriction) {
      case false:
        return  this.props.intl.formatMessage(messages['course-run.edit.collapsible.title.embargo.no']);
      case true:
        return this.props.intl.formatMessage(messages['course-run.edit.collapsible.title.embargo.yes']);
      default:
        return this.props.intl.formatMessage(messages['course-run.edit.collapsible.title.embargo.default']);
    }
  }

  formatDate(date) {
    if (date) {
      if (date.includes('T')
        && date.split('T')[0].match(FORMAT_DATE_MATCHER)) {
        return getDateWithSlashes(date);
      }
      return date;
    }
    return '';
  }

  normalizeDate(date) {
    if (date) {
      if (date.match(NORMALIZE_DATE_MATCHER)) {
        return moment(date).utc().format(DATE_FORMAT);
      }
      return date;
    }
    return '';
  }

  render() {
    const {
      intl,
      courseId,
      courseInReview,
      courseRun,
      courseSubmitting,
      editable,
      isSubmittingForReview,
      languageOptions,
      ofacRestrictionOptions,
      programOptions,
      pacingTypeOptions,
      targetRun,
      owners,
      courseUuid,
      stafferInfo,
      sourceInfo,
      courseSubmitInfo,
      initialValues,
      currentFormValues,
      isOpen,
      onToggle,
      courseRunTypeOptions,
      docTypeInfo,
    } = this.props;
    const { hasExternalKey } = this.state;
    const { administrator } = getAuthenticatedUser();

    const courseRunInReview = IN_REVIEW_STATUS.includes(courseRun.status);
    // Checks if the current course run is the one triggering submission for review
    const courseRunSubmitting = !courseRunInReview && isSubmittingForReview && targetRun
      && (targetRun.key === courseRun.key);

    const disabled = courseInReview || !editable;
    const seatHasSku = courseRun.seats
      && courseRun.seats.reduce((hasSku, seat) => !!seat.sku || hasSku, false);

    const courseDateEditHelp = dateEditHelp(courseRun);
    const coursePacingEditHelp = pacingEditHelp(courseRun);
    const runType = currentFormValues && currentFormValues.type;
    const runTypeOptions = runType && courseRunTypeOptions[runType];
    // Handle mismatches between CourseType and CourseRunType
    if (courseRun.run_type && runTypeOptions
      && runTypeOptions.every(option => option.value !== courseRun.run_type)) {
      runTypeOptions.push({ label: '--', value: courseRun.run_type });
    }

    const pristine = initialValues && isPristine(initialValues, currentFormValues)
      && isPristine(initialValues, currentFormValues, courseRun.key);

    return (
      <Collapsible
        title={formatCourseRunTitle(courseRun, intl)}
        open={isOpen}
        onToggle={onToggle}
      >
        <div className="mb-3">
          <span className="text-info" aria-hidden>{intl.formatMessage(messages['course-run.edit.form.title.text-info'])}</span>
        </div>
        {/* TODO this should be refactored when paragon supports safari */}
        {/* text inputs for safari */}
        {isSafari
          ? (
            <div>
              <Field
                name={`${courseId}.go_live_date`}
                type="text"
                component={RenderInputTextField}
                format={date => this.formatDate(date)}
                normalize={date => this.normalizeDate(date)}
                pattern={DATE_INPUT_PATTERN}
                maxLength="10"
                label={(
                  <FieldLabel
                    id={`${courseId}.go_live_date.label`}
                    text={intl.formatMessage(messages['course-run.edit.form.go_live_date.label'])}
                    helpText={publishDateHelp}
                  />
                )}
                extraInput={{
                  onInvalid: this.openCollapsible,
                }}
                placeholder="yyyy/mm/dd"
                disabled={disabled || courseRun.status === PUBLISHED}
                required={courseRunSubmitting}
              />
              <Field
                name={`${courseId}.start`}
                type="text"
                component={DateTimeField}
                dateLabel={intl.formatMessage(messages['course-run.edit.form.start-date.label'])}
                timeLabel={intl.formatMessage(messages['course-run.edit.form.start-time.label'], {localTimeZone: localTimeZone})}
                helpText={courseDateEditHelp}
                disabled
              />
              <Field
                name={`${courseId}.end`}
                type="text"
                component={DateTimeField}
                dateLabel={intl.formatMessage(messages['course-run.edit.form.end-date.label'])}
                timeLabel={intl.formatMessage(messages['course-run.edit.form.end-time.label'], {localTimeZone: localTimeZone})}
                helpText={courseDateEditHelp}
                disabled
              />
              <Field
                name={`${courseId}.upgrade_deadline_override`}
                type="date"
                component={DateTimeField}
                dateLabel="Дата крайнего срока обновления"
                timeLabel={`Время крайнего срока обновления (${localTimeZone})`}
                helpText={courseDateEditHelp}
                disabled={!administrator || disabled}
              />
            </div>
          )
          // date inputs for all browsers besides safari
          : (
            <div>
              <Field
                name={`${courseId}.go_live_date`}
                type="date"
                component={RenderInputTextField}
                format={value => getDateWithDashes(value)}
                normalize={value => moment(value).utc().format(DATE_FORMAT)}
                label={(
                  <FieldLabel
                    id={`${courseId}.go_live_date.label`}
                    text={intl.formatMessage(messages['course-run.edit.form.go_live_date.label'])}
                    helpText={publishDateHelp}
                  />
                )}
                extraInput={{
                  onInvalid: this.openCollapsible,
                  min: moment(courseRun.go_live_date).isBefore(moment())
                    ? getDateWithDashes(courseRun.go_live_date) : getDateWithDashes(moment()),
                }}
                placeholder="mm/dd/yyyy"
                disabled={disabled || courseRun.status === PUBLISHED}
                required={courseRunSubmitting}
              />
              <Field
                name={`${courseId}.start`}
                type="date"
                component={DateTimeField}
                dateLabel={intl.formatMessage(messages['course-run.edit.form.start-date.label'])}
                timeLabel={intl.formatMessage(messages['course-run.edit.form.start-time.label'], {localTimeZone: localTimeZone})}
                helpText={courseDateEditHelp}
                disabled
              />
              <Field
                name={`${courseId}.end`}
                type="date"
                component={DateTimeField}
                dateLabel={intl.formatMessage(messages['course-run.edit.form.end-date.label'])}
                timeLabel={intl.formatMessage(messages['course-run.edit.form.end-time.label'], {localTimeZone: localTimeZone})}
                helpText={courseDateEditHelp}
                disabled
              />
              <Field
                name={`${courseId}.upgrade_deadline_override`}
                type="date"
                component={DateTimeField}
                dateLabel="Дата крайнего срока обновления"
                timeLabel={`Время крайнего срока обновления (${localTimeZone})`}
                helpText={courseDateEditHelp}
                disabled={!administrator || disabled}
              />
            </div>
          )}
        <hr />
        <Field
          name={`${courseId}.run_type`}
          component={RenderSelectField}
          options={runTypeOptions || [{
            label: intl.formatMessage(messages['course-run.edit.form.enrollment-track.options']),
            value: ''
          }]}
          extraInput={{ onInvalid: this.openCollapsible }}
          label={(
            <FieldLabel
              id={`${courseId}.run_type.label`}
              text={intl.formatMessage(messages['course-run.edit.form.run_type.label'])}
              helpText={runTypeHelp}
              extraText={intl.formatMessage(messages['course-run.edit.form.run_type.extra'])}
            />
          )}
          // If any of the seats have a SKU, then ecom products exist and
          // changing shouldn't be allowed
          disabled={disabled || seatHasSku}
          required
        />
        <Field
          name={`${courseId}.pacing_type`}
          type="text"
          component={RenderSelectField}
          options={pacingTypeOptions}
          label={(
            <FieldLabel
              id={`${courseId}.pacing_type.label`}
              text={intl.formatMessage(messages['course-run.edit.form.pacing_type.label'])}
              helpText={coursePacingEditHelp}
            />
          )}
          disabled
        />
        <FieldLabel
          id={`${courseId}.staff.label`}
          text={intl.formatMessage(messages['course-run.edit.form.staff.label'])}
          className="mb-2"
          helpText={(
            <div>
              <p>Основной преподаватель или преподаватели курса.</p>
              <p>
                Порядок, в котором преподаватели перечислены здесь, соответствует порядку, в котором они будут
                отображаться на страницах курса. Для изменения порядка расположения преподавателей их можно перетаскивать.
              </p>
            </div>
          )}
        />
        <Field
          name={`${courseId}.staff`}
          component={ListField}
          fetchSuggestions={fetchStaffSuggestions(owners)}
          renderSuggestion={renderStaffSuggestion}
          createNewUrl="/instructors/new"
          referrer={`/courses/${courseUuid}`}
          itemType={intl.formatMessage(messages['course-run.edit.form.staff.item'])}
          renderItemComponent={Staffer}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
          courseRunKey={courseRun.key}
          owners={owners}
          sourceInfo={sourceInfo}
          newItemInfo={stafferInfo}
          newItemText={intl.formatMessage(messages['course-run.edit.form.staff.new-item'])}
        />
        <FieldLabel
          id={`${courseId}.docs.label`}
          text={intl.formatMessage(messages['course-run.edit.form.docs.label'])}
          className="mb-2"
          helpText={(
            <div>
              <p>Список документов, которые студент должен предоставить для прохождения курса</p>
              <p>
                В дополнительном блоке можно указать текстовое описание,
                которое выведется студенту при попытке записи на этот курс.
                Текстовое описание будет служить подсказкой для студента.
              </p>
            </div>
          )}
          optional
        />
        <FieldArray
          name={`${courseId}.doc_type`}
          component={DocType}
          docTypeInfo={docTypeInfo}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
        />
        <div className="row">
          <div className="col-6">
            <Field
              name={`${courseId}.min_effort`}
              type="number"
              component={RenderInputTextField}
              label={(
                <FieldLabel
                  id={`${courseId}.min_effort.label`}
                  text={intl.formatMessage(messages['course-run.edit.form.min_effort.label'])}
                  helpText={(
                    <div>
                      <p>
                        Минимальное количество часов в неделю, которые учащийся должен потратить на обучение.
                        на курсе.
                      </p>
                    </div>
                  )}
                />
              )}
              extraInput={{
                onInvalid: this.openCollapsible,
                min: 0,
                max: 168,
              }}
              disabled={disabled}
              required={courseRunSubmitting}
            />
          </div>
          <div className="col-6">
            <Field
              name={`${courseId}.max_effort`}
              type="number"
              component={RenderInputTextField}
              label={(
                <FieldLabel
                  id={`${courseId}.max_effort.label`}
                  text={intl.formatMessage(messages['course-run.edit.form.max_effort.label'])}
                  helpText={(
                    <div>
                      <p>
                        Максимальное количество часов в неделю, которое учащийся должен потратить на обучение
                        на курсе.
                      </p>
                    </div>
                  )}
                />
              )}
              extraInput={{
                onInvalid: this.openCollapsible,
                min: 1,
                max: 168,
              }}
              disabled={disabled}
              required={courseRunSubmitting}
            />
          </div>
        </div>
        <Field
          name={`${courseId}.weeks_to_complete`}
          type="number"
          component={RenderInputTextField}
          label={(
            <FieldLabel
              id={`${courseId}.weeks_to_complete.label`}
              text={intl.formatMessage(messages['course-run.edit.form.weeks_to_complete.label'])}
              helpText={(
                <div>
                  <p>
                    Предполагаемое количество недель, которые учащийся должен провести на курсе,
                    округленное до ближайшего целого числа.
                  </p>
                </div>
              )}
            />
          )}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.content_language`}
          type="text"
          component={RenderSelectField}
          options={languageOptions}
          label={
            <FieldLabel
                text={intl.formatMessage(messages['course-run.edit.form.content_language.label'])}
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
          required={courseRunSubmitting}
        />
        <FieldLabel
            text={intl.formatMessage(messages['course-run.edit.form.transcript_languages.label'])}
            className="mb-2"
        />
        <FieldArray
          name={`${courseId}.transcript_languages`}
          component={TranscriptLanguage}
          languageOptions={languageOptions}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
        />
        <Field
          name={`${courseId}.expected_program_type`}
          type="text"
          component={RenderSelectField}
          options={programOptions}
          label={(
            <FieldLabel
              id={`${courseId}.expected_program_type.label`}
              text={intl.formatMessage(messages['course-run.edit.form.expected_program_type.label'])}
              helpText={(
                <div>
                  <p>
                    Если данный курс будет потенциально частью программы, пожалуйста, укажите здесь
                    ожидаемый тип программы.
                  </p>
                </div>
              )}
              optional
            />
          )}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
        />
        <Field
          name={`${courseId}.expected_program_name`}
          component={RenderInputTextField}
          type="text"
          label={(
            <FieldLabel
              id={`${courseId}.expected_program_name.label`}
              text={intl.formatMessage(messages['course-run.edit.form.expected_program_name.label'])}
              helpText={(
                <div>
                  <p>
                    Если данный курс будет потенциально частью программы, пожалуйста, укажите здесь
                    предполагаемое название программы.
                  </p>
                </div>
              )}
              optional
            />
          )}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
        />
        {hasExternalKey
          && (
          <Field
            name={`${courseId}.external_key`}
            component={RenderInputTextField}
            type="text"
            label={(
              <FieldLabel
                id={`${courseId}.external_key.label`}
                text={intl.formatMessage(messages['course-run.edit.form.external_key.label'])}
                helpText={(
                  <div>
                    <p>
                      Заполните это поле только в том случае, если вы планируете интегрироваться с вашим системы вашего учебного заведения через службу регистратора edX.
                    </p>
                  </div>
                )}
                optional
              />
            )}
            extraInput={{ onInvalid: this.openCollapsible }}
            disabled={disabled}
          />
          )}
        {(!administrator || !IN_REVIEW_STATUS.includes(courseRun.status))
          && (
          <div>
            <FieldLabel
              id="ofac-notice-label"
              text={intl.formatMessage(messages['course-run.edit.form.ofac-notice-label.label'])}
              className="mb-2"
              helpText={(
                <div>
                  <p>
                    Статус эмбарго курса для OFAC управляется изнутри, пожалуйста, обращайтесь в службу поддержки.
                  </p>
                </div>
              )}
            />
            <div className="mb-3">
              {this.displayOfacRestriction(courseRun.has_ofac_restrictions)}
            </div>
          </div>
          )}
        {administrator && IN_REVIEW_STATUS.includes(courseRun.status)
          && (
          <div>
            Status: {courseRun.status === REVIEW_BY_LEGAL ? 'Legal Review' : 'PC Review'}
            <div>
              <Field
                name={`${courseId}.has_ofac_restrictions`}
                disabled={courseRun.status === REVIEW_BY_INTERNAL}
                type="text"
                component={RenderSelectField}
                options={ofacRestrictionOptions}
                label={(
                  <FieldLabel
                    id={`${courseId}.has_ofac_restrictions.label`}
                    text={intl.formatMessage(messages['course-run.edit.form.has_ofac_restrictions.label'])}
                  />
                )}
                extraInput={{ onInvalid: this.openCollapsible }}
                required={jsonDeepEqual(courseSubmitInfo.targetRun, courseRun)}
              />
              <Field
                name={`${courseId}.ofac_comment`}
                disabled={courseRun.status === REVIEW_BY_INTERNAL}
                component={RichEditor}
                label={(
                  <FieldLabel
                    id={`${courseId}.ofac_comment.label`}
                    text={intl.formatMessage(messages['course-run.edit.form.ofac_comment.label'])}
                  />
                )}
                extraInput={{ onInvalid: this.openCollapsible }}
                maxChars={500}
              />
            </div>
          </div>
          )}
        <CourseRunButtonToolbar
          // only disable if *this run* is in review
          disabled={courseSubmitting || (courseRunInReview && !administrator)
            || (courseRun.status === REVIEWED && pristine)}
          editable={editable}
          hasNonExemptChanges={initialValues && initialValues.course_runs
            && currentFormValues.course_runs
            && (isNonExemptChanged(initialValues, currentFormValues, courseRun.key)
                || isNonExemptChanged(initialValues, currentFormValues))}
          // Pass the submitting course run up to validate different fields based on status
          onSubmit={() => store.dispatch(courseSubmitRun(courseRun))}
          pristine={pristine}
          submitting={courseSubmitting
            || (courseSubmitInfo && courseSubmitInfo.isSubmittingRunReview)}
          status={courseRun.status}
        />
      </Collapsible>
    );
  }
}

CollapsibleCourseRun.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
  courseRun: PropTypes.shape({
    go_live_date: PropTypes.string,
    has_ofac_restrictions: PropTypes.bool,
    key: PropTypes.string,
    run_type: PropTypes.string,
    seats: PropTypes.arrayOf(PropTypes.shape({
      sku: PropTypes.string,
    })),
    status: PropTypes.string,
  }).isRequired,
  courseSubmitting: PropTypes.bool,
  courseSubmitInfo: PropTypes.shape({
    isSubmittingRunReview: PropTypes.bool,
    targetRun: PropTypes.shape(),
  }),
  courseUuid: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  courseRunTypeOptions: PropTypes.shape({}),
  runTypeModes: PropTypes.shape({}),
  editable: PropTypes.bool,
  isSubmittingForReview: PropTypes.bool,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  programOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  owners: PropTypes.arrayOf(PropTypes.shape({})),
  pacingTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  sourceInfo: PropTypes.shape({
    referringRun: PropTypes.string,
  }),
  stafferInfo: PropTypes.shape({
    returnToEditCourse: PropTypes.bool,
  }),
  targetRun: PropTypes.shape({
    key: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  ofacRestrictionOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.bool,
  })).isRequired,
  currentFormValues: PropTypes.shape({
    course_runs: PropTypes.arrayOf(PropTypes.shape({})),
    type: PropTypes.string,
  }).isRequired,
  initialValues: PropTypes.shape({
    course_runs: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  docTypeInfo: PropTypes.object,
};

CollapsibleCourseRun.defaultProps = {
  courseInReview: false,
  courseSubmitting: false,
  courseSubmitInfo: {
    isSubmittingRunReview: false,
  },
  courseRunTypeOptions: {},
  runTypeModes: {},
  editable: false,
  isSubmittingForReview: false,
  owners: [],
  sourceInfo: {},
  stafferInfo: {},
  targetRun: null,
  isOpen: false,
};

export default (injectIntl(CollapsibleCourseRun));
