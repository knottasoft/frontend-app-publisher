import { defineMessages } from 'react-intl';

const messages = defineMessages({
    'course-run.edit.collapsible.title.publish-date': {
        id: 'course-run.edit.collapsible.title.publish-date',
        defaultMessage: 'Publish date is {formattedDate}',
        description: 'Course Run Publish date',
    },
    'course-run.edit.collapsible.title.course-run-label': {
        id: 'course-run.edit.collapsible.title.course-run-label',
        defaultMessage: 'Course run starting on {labelItems}',
        description: 'Course Run starting info',
    },
    'course-run.edit.collapsible.title.course-run-link': {
        id: 'course-run.edit.collapsible.title.course-run-link',
        defaultMessage: 'Studio URL ',
        description: 'Course Run Studio URL',
    },
    'course-run.edit.collapsible.title.new-course-run': {
        id: 'course-run.edit.collapsible.title.new-course-run',
        defaultMessage: 'Your new course run',
        description: 'New course run',
    },
    'course-run.edit.collapsible.title.embargo.yes': {
        id: 'course-run.edit.collapsible.title.embargo.yes',
        defaultMessage: 'Yes',
        description: 'Edit course run',
    },
    'course-run.edit.collapsible.title.embargo.no': {
        id: 'course-run.edit.collapsible.title.embargo.no',
        defaultMessage: 'No',
        description: 'Edit course run',
    },
    'course-run.edit.collapsible.title.embargo.default': {
        id: 'course-run.edit.collapsible.title.embargo.default',
        defaultMessage: '--',
        description: 'Edit course run',
    },
    'course-run.edit.form.title.text-info': {
        id: 'course-run.edit.form.title.text-info',
        defaultMessage: 'All fields are required for publication unless otherwise specified.',
        description: 'Text info for Course Run form',
    },
    'course-run.edit.form.go_live_date.label': {
        id: 'course-run.edit.form.go_live_date.label',
        defaultMessage: 'Publish date',
        description: 'Publish Course Run date',
    },
    'course-run.edit.form.start-date.label': {
        id: 'course-run.edit.form.start-date.label',
        defaultMessage: 'Start date',
        description: 'Course Run start date',
    },
    'course-run.edit.form.start-time.label': {
        id: 'course-run.edit.form.start-time.label',
        defaultMessage: 'Start time ({localTimeZone})',
        description: 'Course Run start time',
    },
    'course-run.edit.form.end-date.label': {
        id: 'course-run.edit.form.end-date.label',
        defaultMessage: 'End date',
        description: 'Course Run end date',
    },
    'course-run.edit.form.end-time.label': {
        id: 'course-run.edit.form.end-time.label',
        defaultMessage: 'End time ({localTimeZone})',
        description: 'Course Run end time',
    },
    'course-run.edit.form.enrollment-track.options': {
        id: 'course-run.edit.form.enrollment-track.options',
        defaultMessage: 'Select Course enrollment track first',
        description: 'Course Run enrollment track options',
    },
    'course-run.edit.form.run_type.label': {
        id: 'course-run.edit.form.run_type.label',
        defaultMessage: 'Course run enrollment track',
        description: 'Course Run enrollment track label',
    },
    'course-run.edit.form.run_type.extra': {
        id: 'course-run.edit.form.run_type.extra',
        defaultMessage: 'Cannot edit after submission',
        description: 'Course Run enrollment track label',
    },
    'course-run.edit.form.pacing_type.label': {
        id: 'course-run.edit.form.pacing_type.label',
        defaultMessage: 'Course pacing',
        description: 'Course Run pacing',
    },
    'course-run.edit.form.staff.label': {
        id: 'course-run.edit.form.staff.label',
        defaultMessage: 'Staff',
        description: 'Course Run staff',
    },
    'course-run.edit.form.staff.item': {
        id: 'course-run.edit.form.staff.item',
        defaultMessage: 'staff',
        description: 'Course Run staff',
    },
    'course-run.edit.form.staff.new-item': {
        id: 'course-run.edit.form.staff.new-item',
        defaultMessage: 'Add New Instructor',
        description: 'Course Run staff',
    },
    'course-run.edit.form.min_effort.label': {
        id: 'course-run.edit.form.min_effort.label',
        defaultMessage: 'Minimum effort',
        description: 'Course Run Minimum effort',
    },
    'course-run.edit.form.max_effort.label': {
        id: 'course-run.edit.form.max_effort.label',
        defaultMessage: 'Maximum effort',
        description: 'Course Run Maximum effort',
    },
    'course-run.edit.form.weeks_to_complete.label': {
        id: 'course-run.edit.form.weeks_to_complete.label',
        defaultMessage: 'Length',
        description: 'Weeks to complete for Course Run',
    },
    'course-run.edit.form.content_language.label': {
        id: 'course-run.edit.form.content_language.label',
        defaultMessage: 'Content language',
        description: 'Content language for Course Run',
    },
    'course-run.edit.form.transcript_languages.label': {
        id: 'course-run.edit.form.transcript_languages.label',
        defaultMessage: 'Transcript languages',
        description: 'Transcript languages for Course Run',
    },
    'course-run.edit.form.expected_program_type.label': {
        id: 'course-run.edit.form.expected_program_type.label',
        defaultMessage: 'Expected Program Type',
        description: 'Expected Program Type for Course Run',
    },
    'course-run.edit.form.expected_program_name.label': {
        id: 'course-run.edit.form.expected_program_name.label',
        defaultMessage: 'Expected Program Name',
        description: 'Expected Program Name for Course Run',
    },
    'course-run.edit.form.external_key.label': {
        id: 'course-run.edit.form.external_key.label',
        defaultMessage: 'Institution Course ID',
        description: 'Institution Course ID for Course Run',
    },
    'course-run.edit.form.ofac-notice-label.label': {
        id: 'course-run.edit.form.ofac-notice-label.label',
        defaultMessage: 'Course Embargo (OFAC) Restriction text added to the FAQ section',
        description: 'Course Embargo (OFAC) Restriction text for Course Run',
    },
    'course-run.edit.form.has_ofac_restrictions.label': {
        id: 'course-run.edit.form.has_ofac_restrictions.label',
        defaultMessage: 'OFAC status',
        description: 'OFAC status for Course Run',
    },
    'course-run.edit.form.ofac_comment.label': {
        id: 'course-run.edit.form.ofac_comment.label',
        defaultMessage: 'Countries or additional notes',
        description: 'Countries or additional notes for OFAC status',
    },
    'course-run.edit.form.docs.label': {
        id: 'course-run.edit.form.docs.label',
        defaultMessage: 'Документы, привязанные к запуску курса',
        description: 'Надпись раздела документов',
    }, 

});

export default messages;
