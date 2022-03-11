import PropTypes from 'prop-types';
import React from 'react';
import {
  Field, FieldArray, reduxForm, stopSubmit,
} from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { Icon, Hyperlink } from '@edx/paragon';

import CollapsibleCourseRuns from './CollapsibleCourseRuns';
import CourseButtonToolbar from './CourseButtonToolbar';
import CourseSkills from './CourseSkills';
import FieldLabel from '../FieldLabel';
import ImageUpload from '../ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../RichEditor';
import Pill from '../Pill';
import Collapsible from '../Collapsible';
import PriceList from '../PriceList';

import { PUBLISHED, REVIEWED } from '../../data/constants';
import { titleHelp, typeHelp, urlSlugHelp } from '../../helpText';
import { handleCourseEditFail, editCourseValidate } from '../../utils/validation';
import {
  formatCollaboratorOptions,
  getOptionsData, isPristine, parseCourseTypeOptions, parseOptions,
} from '../../utils';
import store from '../../data/store';
import { courseSubmitRun } from '../../data/actions/courseSubmitInfo';
import ListField from '../ListField';
import { Collaborator } from '../Collaborator';
import renderSuggestion from '../Collaborator/renderSuggestion';
import fetchCollabSuggestions from '../Collaborator/fetchCollabSuggestions';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './EditCourse.messages.js';

export class BaseEditCourseForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      collapsiblesOpen: [],
    };

    this.openCollapsible = this.openCollapsible.bind(this);
    this.setCollapsible = this.setCollapsible.bind(this);
    this.toggleCourseRun = this.toggleCourseRun.bind(this);
    this.collapseAllCourseRuns = this.collapseAllCourseRuns.bind(this);
    this.setCourseRunCollapsibles = this.setCourseRunCollapsibles.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      change,
      courseInfo: {
        courseSaved,
      },
      courseSubmitInfo,
      currentFormValues,
      initialValues,
      initialValues: {
        course_runs: initialCourseRuns,
      },
      updateFormValuesAfterSave,
    } = this.props;

    if (initialCourseRuns.length && !this.state.collapsiblesOpen.length) {
      this.setCourseRunCollapsibles(initialCourseRuns);
    }

    // If we are transitioning off of a "submit for review" state (which means that we just
    // finished turning fields into required so that html5 can flag them during validation) open
    // the collapsible if and only if there are course-level errors.
    const stoppingRunReview = prevProps.courseSubmitInfo.isSubmittingRunReview
                              && !courseSubmitInfo.isSubmittingRunReview;
    const hasCourseErrors = courseSubmitInfo.errors
                            && Object.keys(courseSubmitInfo.errors).length
                            && Object.keys(courseSubmitInfo.errors) !== ['course_runs'];
    if (stoppingRunReview && hasCourseErrors) {
      this.openCollapsible();
    }

    if (courseSaved) {
      updateFormValuesAfterSave(change, currentFormValues, initialValues);
    }
  }

  setCourseRunCollapsibles(initialCourseRuns) {
    const collapsiblesOpen = initialCourseRuns.map(() => false);
    this.setState({ collapsiblesOpen });
  }

  setCollapsible(open) {
    this.setState({
      open,
    });
  }

  getAddCourseRunButton(disabled, uuid) {
    let courseRunButton = (
      <button
        type="button"
        className="btn btn-block rounded mt-3 new-run-button"
        disabled={disabled}
      >
        <Icon className="fa fa-plus" /> {this.props.intl.formatMessage(messages['course.edit.button.add_course_run'])}
      </button>
    );

    /** Disabling a Link is discouraged and disabling a button within a link results
     * in a Disabled button with a link that will still underline on hover.
     * So only add the Link if the button is enabled.
     */
    if (!disabled) {
      courseRunButton = (
        <Link to={`/courses/${uuid}/rerun`}>
          {courseRunButton}
        </Link>
      );
    }

    return courseRunButton;
  }
  // TODO: Необходимо заменить ссылку на страницу предварительного просмотра
  getLinkComponent(courseStatuses, courseInfo) {
    if (courseStatuses.length === 1 && courseStatuses[0] === REVIEWED && courseInfo.data && courseInfo.data.url_slug) {
      return (
        <>
          <Hyperlink
            destination={`https://www.edx.org/preview/course/${courseInfo.data.url_slug}`}
            target="_blank"
          >
            {this.props.intl.formatMessage(messages['course.edit.collapsible.preview.link'])}
          </Hyperlink>
          <span className="d-block">{this.props.intl.formatMessage(messages['course.edit.collapsible.preview.span'])}</span>
        </>
      );
    }
    if (courseStatuses.includes(PUBLISHED) && courseInfo.data && courseInfo.data.marketing_url) {
      return (
        <div>
          {this.props.intl.formatMessage(messages['course.edit.collapsible.live_view.div'])}
          <Hyperlink
            destination={courseInfo.data.marketing_url}
            target="_blank"
          >
            {this.props.intl.formatMessage(messages['course.edit.collapsible.live_view.link'])}
          </Hyperlink>
        </div>
      );
    }
    return this.props.intl.formatMessage(messages['course.edit.collapsible.preview.default']);
  }

  formatCourseTitle(title, courseStatuses, courseInfo) {
    // TODO: After we have a way of determining if the course has been edited, that should be
    // added into the list of statuses being passed into the Pill component.
    return (
      <>
        {this.props.intl.formatMessage(messages['course.edit.collapsible.title'], {title: title})}
        <Pill statuses={courseStatuses} />
        <div className="course-preview-url">
          { this.getLinkComponent(courseStatuses, courseInfo) }
        </div>
      </>
    );
  }

  toggleCourseRun(index, value) {
    this.setState(prevState => {
      const collapsiblesOpen = [...prevState.collapsiblesOpen];
      collapsiblesOpen[index] = value;
      return { collapsiblesOpen };
    });
  }

  collapseAllCourseRuns() {
    this.setState(prevState => ({
      collapsiblesOpen: prevState.collapsiblesOpen.map(() => false),
    }));
  }

  openCollapsible() {
    this.setCollapsible(true);
  }

  render() {
    const {
      handleSubmit,
      number,
      entitlement,
      currentFormValues,
      submitting,
      title,
      pristine,
      uuid,
      courseInReview,
      courseStatuses,
      id,
      isSubmittingForReview,
      editable,
      courseInfo,
      courseInfo: {
        data: {
          skill_names: skillNames,
        },
      },
      reset,
      courseOptions,
      courseRunOptions,
      initialValues,
      collaboratorOptions,
      collaboratorInfo,
      docTypeInfo,
    } = this.props;
    const {
      open,
    } = this.state;
    const { administrator } = getAuthenticatedUser();

    const courseOptionsData = getOptionsData(courseOptions);
    const courseRunOptionsData = getOptionsData(courseRunOptions);
    const levelTypeOptions = courseOptionsData
      && parseOptions(courseOptionsData.level_type.choices);
    const ofacRestrictionOptions = (courseRunOptionsData
      && courseRunOptionsData.has_ofac_restrictions
      && parseOptions(courseRunOptionsData.has_ofac_restrictions.choices));
    const subjectOptions = courseOptionsData
      && parseOptions(courseOptionsData.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptionsData
      && parseOptions(courseRunOptionsData.pacing_type.choices));
    const languageOptions = (courseRunOptionsData
      && parseOptions(courseRunOptionsData.content_language.choices));
    const programOptions = (courseRunOptionsData
      && parseOptions(courseRunOptionsData.expected_program_type.choices));

    const {
      data: {
        results: allResults,
      },
    } = collaboratorOptions;

    const allCollaborators = formatCollaboratorOptions(allResults);

    const parsedTypeOptions = courseOptionsData
      && parseCourseTypeOptions(courseOptionsData.type.type_options);
    const {
      courseTypeOptions,
      courseRunTypeOptions,
      courseTypes,
      priceLabels,
      runTypeModes,
    } = parsedTypeOptions;
    const disabled = courseInReview || !editable;
    const showMarketingFields = !currentFormValues.type || !courseTypes[currentFormValues.type]
      || courseTypes[currentFormValues.type].course_run_types.some(crt => crt.is_marketable);

    const courseIsPristine = isPristine(initialValues, currentFormValues);
    const publishedContentChanged = initialValues.course_runs
      && initialValues.course_runs.some(run => (run.status === PUBLISHED
        && (!courseIsPristine || !isPristine(initialValues, currentFormValues, run.key))));

    languageOptions.unshift({ label: '--', value: '' });
    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });
    programOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form">
        <form id={id} onSubmit={handleSubmit}>
          <FieldLabel text={title} className="mb-2 h2" />
          <Collapsible
            title={this.formatCourseTitle(title, courseStatuses, courseInfo)}
            key="Test Key"
            open={open}
            onToggle={this.setCollapsible}
          >
            <div className="mb-3">
              <span className="text-info" aria-hidden> {this.props.intl.formatMessage(messages['course.edit.form.text_info'])}</span>
            </div>
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={(
                <FieldLabel
                  id="title.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.title'])}
                  helpText={titleHelp}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              required
              disabled={disabled}
            />
            <Field
              name="url_slug"
              component={RenderInputTextField}
              type="text"
              label={(
                <FieldLabel
                  id="slug.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.slug'])}
                  optional
                  helpText={urlSlugHelp}
                />
              )}
              disabled={disabled || !administrator}
              optional
            />
            <div>
              <FieldLabel
                  id="number"
                  text={this.props.intl.formatMessage(messages['course.edit.form.number'])}
                  className="mb-2"
              />
              <div className="mb-3">{number}</div>
            </div>
            <Field
              name="type"
              component={RenderSelectField}
              options={courseTypeOptions}
              label={(
                <FieldLabel
                  id="type.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.enrollment.text'])}
                  helpText={typeHelp}
                  extraText={this.props.intl.formatMessage(messages['course.edit.form.enrollment.extra'])}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              disabled={disabled || !!entitlement.sku}
            />
            <PriceList
              priceLabels={currentFormValues.type ? priceLabels[currentFormValues.type] : {}}
              extraInput={{ onInvalid: this.openCollapsible }}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <FieldLabel
              id="collaborators.label"
              text={this.props.intl.formatMessage(messages['course.edit.form.collaborators'])}
              helpText={(
                <div>
                  <p>
                    Команды курсов несут ответственность за получение всех необходимых разрешений на использование логотипов третьих лиц.
                  </p>
                  <p>
                    Чтобы подробнее рассказать о поддержке, включите дополнительную информацию в раздел "Об этом курсе". Пожалуйста, избегайте включения заявлений о том, что курс предлагается совместно или что третья сторона сотрудничает или партнерствует с ЦОПП СК.
                  </p>
                </div>
              )}
              optional
            />
            <Field
              name="collaborators"
              component={ListField}
              fetchSuggestions={fetchCollabSuggestions(allCollaborators)}
              createNewUrl="/collaborators/new"
              referrer={`/courses/${uuid}`}
              itemType={this.props.intl.formatMessage(messages['course.edit.form.collaborators.item'])}
              renderItemComponent={Collaborator}
              renderSuggestion={renderSuggestion}
              disabled={disabled}
              newItemText={this.props.intl.formatMessage(messages['course.edit.form.collaborators.add'])}
              newItemInfo={collaboratorInfo}
            />
            <Field
              name="imageSrc"
              component={ImageUpload}
              label={(
                <FieldLabel
                  id="image.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.image.text'])}
                  helpText={(
                    <div>
                      <p>
                        Привлекательное, красочное изображение, отражающее суть вашего курса.
                      </p>
                      <ul>
                        <li>Новые изображения курса должны иметь размер 1134×675 пикселей.</li>
                        <li>Изображение должно быть файлом в формате JPEG или PNG.</li>
                        <li>Каждый курс должен иметь уникальное изображение.</li>
                        <li>Изображение не может содержать текст или заголовки.</li>
                        <li>
                          У вас должно быть разрешение на использование изображения. Возможные источники изображений являются Flickr creative commons, Stock Vault, Stock XCHNG и iStock Фото.
                        </li>
                      </ul>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/image_guidelines.html#representative-image-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Подронее.
                        </a>
                      </p>
                    </div>
                  )}
                  extraText={this.props.intl.formatMessage(messages['course.edit.form.image.extra'])}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              maxImageSizeKilo={1000}
              requiredWidth={1134}
              requiredHeight={675}
              id="image"
              className="course-image"
              disabled={disabled}
            />
            {showMarketingFields
            && (
              <>
                <hr />
                <Field
                  name="short_description"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="sdesc.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.short_description.text'])}
                      helpText={(
                        <div>
                          <p>Эффективное краткое описание:</p>
                          <ul>
                            <li>Содержит 25-50 слов.</li>
                            <li>Выполняет функцию теглайна.</li>
                            <li>Предоставляет убедительные причины для прохождения курса.</li>
                            <li>Соблюдает рекомендации по SEO.</li>
                            <li>Ориентирован на глобальную аудиторию.</li>
                          </ul>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#course-short-description-guidelines"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Подробнее.
                            </a>
                          </p>
                          <p><b>Пример:</b></p>
                          <p>
                            Первый МООК для обучения позитивной психологии. Изучите научно обоснованные принципы и практики для счастливой, наполненной смыслом жизни.
                          </p>
                        </div>
                      )}
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={500}
                  id="sdesc"
                  disabled={disabled}
                />
                <Field
                  name="full_description"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="ldesc.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.long_description.text'])}
                      helpText={(
                        <div>
                          <p>Эффективное длинное описание:</p>
                          <ul>
                            <li>Содержит 150-300 слов.</li>
                            <li>Легко читается.</li>
                            <li>Использование маркированных пунктов вместо плотных текстовых абзацев.</li>
                            <li>Следует рекомендациям SEO.</li>
                            <li>Нацеленность на глобальную аудиторию.</li>
                          </ul>
                          <p>
                            Первые четыре строки видны при открытии страницы About. Учащиеся могут выбрать "Посмотреть больше", чтобы просмотреть полное описание.
                          </p>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#course-long-description-guidelines"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Learn more.
                            </a>
                          </p>
                        </div>
                      )}
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="ldesc"
                  disabled={disabled}
                />
                <Field
                  name="outcome"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="outcome.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.outcome.label'])}
                      helpText={(
                        <div>
                          <p>Навыки и знания, которые учащиеся приобретут в этом курсе.</p>
                          <p>Оформите каждый пункт в виде пункта, состоящего из четырех-десяти слов.</p>
                          <p><b>Пример:</b></p>
                          <ul>
                            <li>Основы программирования на R</li>
                            <li>Прикладное понимание линейной и логистической регрессии</li>
                            <li>Применение текстового анализа</li>
                            <li>Линейная и целочисленная оптимизация</li>
                          </ul>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#what-you-will-learn-guidelines"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Подробнее.
                            </a>
                          </p>
                        </div>
                    )}
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="outcome"
                  disabled={disabled}
                />
                <Field
                  name="syllabus_raw"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="syllabus.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.syllabus.label'])}
                      helpText={(
                        <div>
                          <p>
                            Обзор содержания, изучаемого в вашем курсе, организованный по неделям или модулям.
                          </p>
                          <ul>
                            <li>Сосредоточьтесь на темах и содержании.</li>
                            <li>
                              Не включайте подробную информацию о логистике курса, такую как выставление оценок, правила общения и списки литературы.
                            </li>
                            <li>Отформатируйте элементы в виде абзацев или маркированного списка.</li>
                          </ul>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#id3"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Подробнее.
                            </a>
                          </p>
                          <p><b>Пример:</b></p>
                          <ul>
                            <li>
                              <p>Неделя 1: От калькулятора к компьютеру</p>
                              <p>
                                Введение в основные концепции программирования, такие как значения и
                                выражения, а также принятие решений при реализации алгоритмов
                                и разработке программ.
                              </p>
                            </li>
                            <li>
                              <p>Неделя 2: Преобразование состояний</p>
                              <p>
                                Введение в преобразование состояний, включая представление данных
                                и программ, а также условное повторение.
                              </p>
                            </li>
                          </ul>
                        </div>
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={500}
                  id="syllabus"
                  disabled={disabled}
                />
                <Field
                  name="prerequisites_raw"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="prereq.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.prereq.label'])}
                      helpText={(
                        <div>
                          <p>
                            Специфические знания, которыми должны обладать учащиеся для успешного прохождения курса.
                            Если у курса нет предпосылок, введите "None".
                          </p>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#skill-and-knowledge-prerequisites"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Подробнее.
                            </a>
                          </p>
                          <p><b>Примеры:</b></p>
                          <ul>
                            <li>
                              Алгебра в средней школе (старших классах);
                              основные математические понятия
                            </li>
                            <li>Понимание кейнсианской экономики на уровне выпускника вуза</li>
                            <li>Основы алгебры</li>
                          </ul>
                        </div>
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={1000}
                  id="prereq"
                  disabled={disabled}
                />
                <Field
                  name="learner_testimonials"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="testimonials.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.testimonials.label'])}
                      helpText={(
                        <div>
                          <p>
                            Цитата одного из слушателей курса, демонстрирующая ценность прохождения курса.
                          </p>
                          <p>Должно быть не более 25-50 слов.</p>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#learner-testimonial-guidelines"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Learn more.
                            </a>
                          </p>
                          <p><b>Пример:</b></p>
                          <p>
                            "Блестящий курс! Это определенно лучшее введение в электронику в мире! Интересный материал,
                            понятные объяснения, хорошо подготовленные контрольные работы, сложные домашние задания и
                            веселые лабораторные." - Предыдущий студент
                          </p>
                        </div>
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={500}
                  id="learner-testimonials"
                  disabled={disabled}
                />
                <Field
                  name="faq"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="faq.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.faq.label'])}
                      helpText={(
                        <div>
                          <p>Часто задаваемые вопросы и ответы на них.</p>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#faq-guidelines"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Подробнее.
                            </a>
                          </p>
                          <p><b>Пример:</b></p>
                          <strong>Нужно ли мне знать какие-либо языки программирования до начала работы?</strong>
                          <p>
                            Нет, этот курс предназначен для начинающих.
                          </p>
                          <strong>Какую версию Swift я буду изучать?</strong>
                          <p>
                            Swift версии 4.
                          </p>
                        </div>
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="faq"
                  disabled={disabled}
                />
                {/*
                Do not open up access to additional_information. It is not validated like the other
                HTML fields and should not be directly edited by course teams.
              */}
                {administrator
                && (
                <Field
                  name="additional_information"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="additional-info.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.additional-info.label'])}
                      helpText={(
                        <div>
                          <p>Любая дополнительная информация, которая должна быть предоставлена учащимся.</p>
                        </div>
                      )}
                      optional
                    />
                  )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="additional-information"
                  disabled={disabled}
                />
                )}
                {administrator
                && (
                <Field
                  name="videoSrc"
                  component={RenderInputTextField}
                  type="url"
                  label={(
                    <FieldLabel
                      id="video.label"
                      text={this.props.intl.formatMessage(messages['course.edit.form.video.label'])}
                      helpText={(
                        <div>
                          <p>
                            Видеоролик о курсе должен заинтересовать и увлечь потенциальных студентов в прохождении
                            вашего курс. Думайте об этом как о трейлере к фильму или рекламе телепередачи. Видео должно
                            быть убедительным и демонстрировать индивидуальность преподавателя.
                          </p>
                          <p>
                            Идеальная продолжительность - 30-90 секунд (учащиеся обычно смотрят в среднем 30 секунд).
                          </p>
                          <p>
                            TВидеоролик должен быть подготовлен и смонтирован с использованием таких элементов,
                            как графика и стоковые кадры.
                          </p>
                          <p>Видеоролик должен отвечать на эти ключевые вопросы.</p>
                          <ul>
                            <li>Почему учащийся должен зарегистрироваться?</li>
                            <li>Какие темы и концепции рассматриваются?</li>
                            <li>Кто преподает курс?</li>
                            <li>Какое учебное заведение проводит курс?</li>
                          </ul>
                          <p>
                            <a
                              href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/image_guidelines.html#id2"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Подробнее.
                            </a>
                          </p>
                          <p>
                            <span>Посетите</span>
                            <a
                              href="www.youtube.com/user/EdXOnline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Канал edX на YouTube
                            </a>
                            <span>для примера других видеороликов.</span>
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
              </>
            )}
            <hr />
            <Field
              name="level_type"
              component={RenderSelectField}
              label={(
                <FieldLabel
                  id="level.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.level.label'])}
                  // TODO: these descriptions should come from the server -- levels are defined in
                  //       the database and are not suitable for hardcoding like this.
                  helpText={(
                    <div>
                      <dl>
                        <dt>Вводный курс</dt>
                        <dd>
                          Без предварительных условий; учащийся, закончивший частично или полностью среднюю школу,
                          может пройти курс
                        </dd>
                        <dt>Средний</dt>
                        <dd>
                          Основные требования; учащиеся должны закончить среднюю школу или некоторые
                          университетские курсы.
                        </dd>
                        <dt>Продвинутый</dt>
                        <dd>
                          Значительные предварительные требования; курс предназначен для студентов третьего или
                          четвертого курса университета или магистрантов.
                        </dd>
                      </dl>
                    </div>
                  )}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              options={levelTypeOptions}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={(
                <FieldLabel
                  id="subject1.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.subject1.label'])}
                  helpText={(
                    <div>
                      <p>Предмет курса.</p>
                      <p>
                        Вы можете выбрать до двух тем в дополнение к основной теме.
                        На странице "О курсе" отображается только основная тема.
                      </p>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#subject-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Подробнее.
                        </a>
                      </p>
                    </div>
                  )}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              options={subjectOptions}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectSecondary"
              component={RenderSelectField}
              label={
                <FieldLabel
                    text={this.props.intl.formatMessage(messages['course.edit.form.subject-secondary.label'])}
                    optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              options={subjectOptions}
              disabled={disabled}
              optional
            />
            <Field
              name="subjectTertiary"
              component={RenderSelectField}
              label={
                <FieldLabel
                    text={this.props.intl.formatMessage(messages['course.edit.form.subject-tertiary.label'])}
                    optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              options={subjectOptions}
              disabled={disabled}
              optional
            />
            {skillNames?.length > 0
            && (
            <Field
              name="skill_names"
              component={CourseSkills}
              label={(
                <FieldLabel
                  id="skills.label"
                  text={this.props.intl.formatMessage(messages['course.edit.form.skills.label'])}
                  helpText={(
                    <div>
                      <p>
                        edX сотрудничает с Emsi, компанией, предоставляющей данные о рынке труда, чтобы автоматически помечать ваши курсы востребованными навыками из их библиотеки, насчитывающей 30 000 навыков, на основе содержания вашей информационной страницы. Если вы хотите поэкспериментировать с тем, какие навыки будут отображаться, вы можете отредактировать и отправить изменения в описание вашей страницы.
                      </p>
                    </div>
                  )}
                />
              )}
              disabled
              id="skills"
              className="course-skill"
            />
            )}
          </Collapsible>
          <FieldLabel
              text={this.props.intl.formatMessage(messages['course-run.edit.title'])}
              className="mt-4 mb-2 h2"
          />
          <FieldArray
            name="course_runs"
            component={CollapsibleCourseRuns}
            languageOptions={languageOptions}
            ofacRestrictionOptions={ofacRestrictionOptions}
            programOptions={programOptions}
            pacingTypeOptions={pacingTypeOptions}
            formId={id}
            courseUuid={uuid}
            courseSubmitting={submitting}
            collapsiblesOpen={this.state.collapsiblesOpen}
            onToggle={(index, value) => this.toggleCourseRun(index, value)}
            courseRunTypeOptions={courseRunTypeOptions}
            runTypeModes={runTypeModes}
            {...this.props}
            validate={() => {}} // override method from our props, we don't want to pass it down
          />
          {this.getAddCourseRunButton(disabled || !pristine, uuid)}
          <CourseButtonToolbar
            className="mt-3"
            disabled={disabled || submitting}
            editable={editable}
            onClear={() => {
              this.setCollapsible(false);
              reset();
              this.collapseAllCourseRuns();
            }}
            onSave={() => {
              /* Bit of a hack used to clear old validation errors that might be around from
               *  trying to submit for review with errors.
               */
              store.dispatch(stopSubmit(id));
              store.dispatch(courseSubmitRun());
            }}
            pristine={pristine}
            publishedContentChanged={publishedContentChanged}
            submitting={submitting || (courseInfo && courseInfo.isSubmittingEdit)}
          />
        </form>
      </div>
    );
  }
}

BaseEditCourseForm.propTypes = {
  intl: intlShape.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  currentFormValues: PropTypes.shape({
    type: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  entitlement: PropTypes.shape({
    sku: PropTypes.string,
  }),
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  collaboratorOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
  courseStatuses: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  isSubmittingForReview: PropTypes.bool,
  editable: PropTypes.bool,
  courseInfo: PropTypes.shape({
    courseSaved: PropTypes.bool,
    isSubmittingEdit: PropTypes.bool,
    data: PropTypes.shape({
      skill_names: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  courseSubmitInfo: PropTypes.shape({
    errors: PropTypes.shape({}),
    isSubmittingRunReview: PropTypes.bool,
  }),
  initialValues: PropTypes.shape({
    course_runs: PropTypes.arrayOf(PropTypes.shape({})),
    imageSrc: PropTypes.string,
    skill_names: PropTypes.arrayOf(PropTypes.string),
    collaborators: PropTypes.arrayOf(PropTypes.shape(
      {
        uuid: PropTypes.string.isRequired,
      },
    )),
  }),
  change: PropTypes.func,
  updateFormValuesAfterSave: PropTypes.func,
  reset: PropTypes.func.isRequired,
  type: PropTypes.string,
  collaboratorInfo: PropTypes.shape({
    returnToEditCourse: PropTypes.bool,
  }),
  docTypeInfo: PropTypes.object,
};

BaseEditCourseForm.defaultProps = {
  currentFormValues: {},
  entitlement: { sku: null },
  submitting: false,
  pristine: true,
  courseInReview: false,
  courseStatuses: [],
  isSubmittingForReview: false,
  editable: false,
  courseInfo: {},
  courseSubmitInfo: {},
  initialValues: {
    course_runs: [],
    imageSrc: '',
    skill_names: [],
  },
  type: '',
  change: () => null,
  updateFormValuesAfterSave: () => null,
  collaboratorInfo: {},
  collaboratorOptions: {
    data: {
      results: [],
    },
    error: [],
    isFetching: false,
  },
  docTypeInfo: {}
};

const EditCourseForm = compose(
  connect((state, props) => ({
    // Give form a unique id so that values from one course form don't overwrite others
    form: props.id,
  })),
  reduxForm({
    enableReinitialize: true, // Reload staff changes when returning from editing /creating staffers
    keepDirtyOnReinitialize: true, // Don't wipe out changes on reinitialization
    updateUnregisteredFields: true,
    destroyOnUnmount: false, // Keep the form state in redux when editing / creating staffers
    onSubmitFail: handleCourseEditFail, // Send focus to first non-input field with errors
    // Run the sync validation when a run is submitting for review and regular submission process
    shouldError: (params) => {
      const { nextProps, props } = params;
      return (
        props.submitting
        || (nextProps && nextProps.submitting)
        || props.targetRun
        || (nextProps && nextProps.targetRun)
      );
    },
    validate: editCourseValidate,
  }),
)(BaseEditCourseForm);

export default (injectIntl(EditCourseForm));
