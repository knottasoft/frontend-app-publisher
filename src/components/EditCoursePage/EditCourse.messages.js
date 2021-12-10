import { defineMessages } from 'react-intl';

const messages = defineMessages({
    'review.status.alert.review_by_legal': {
        id: 'review.status.alert.review_by_legal',
        defaultMessage: 'Legal Review Complete. Course Run is now awaiting PC Review.',
        description: 'Legal Review Complete',
    },
    'review.status.alert.review_by_internal': {
        id: 'review.status.alert.review_by_internal',
        defaultMessage: 'PC Review Complete.',
        description: 'PC Review Complete.',
    },
    'review.status.alert.course_update': {
        id: 'review.status.alert.course_update',
        defaultMessage: 'Course Run Updated.',
        description: 'Course Run Updated.',
    },
    'review.status.alert.default': {
        id: 'review.status.alert.default',
        defaultMessage: 'Course has been submitted for review. The course will be locked for the next two business days. You will receive an email when the review is complete.',
        description: 'Course has been submitted for review.',
    },
    'course.edit.alert.title': {
        id: 'course.edit.alert.title',
        defaultMessage: 'Course Edit Form failed to load: ',
        description: 'Course Edit Form failed to load.',
    },
    'course.edit.alert.message': {
        id: 'course.edit.alert.message',
        defaultMessage: 'Course information unavailable. Please try reloading the page and if the error persists, please contact support.',
        description: 'Course information unavailable.',
    },
    'course.edit.confirmation.title': {
        id: 'course.edit.confirmation.title',
        defaultMessage: 'Submit for Review?',
        description: 'Submit for Review Modal',
    },
    'course.edit.confirmation.body': {
        id: 'course.edit.confirmation.body',
        defaultMessage: 'You will not be able to make edits while the course is in review, which can take up to 2 business days. Confirm your edits are complete.',
        description: 'Submit for Review Modal',
    },
    'course.edit.confirmation.button': {
        id: 'course.edit.confirmation.button',
        defaultMessage: 'Submit',
        description: 'Submit for Review Modal',
    },
    'course.edit.alert.create': {
        id: 'course.edit.alert.create',
        defaultMessage: 'Course run has been created in studio. See link below.',
        description: 'Course run has been created in studio',
    },
    'course.edit.alert.edit_permissions': {
        id: 'course.edit.alert.edit_permissions',
        defaultMessage: 'You have permission to view this course, but not edit. If you would like to edit the course, please contact a course editor.',
        description: 'Course run edit permissions',
    },
    'course.edit.helmet': {
        id: 'course.edit.helmet',
        defaultMessage: 'Course - {title}',
        description: 'Course run edit permissions',
    },
    'course.edit.button.add_course_run': {
        id: 'course.edit.button.add_course_run',
        defaultMessage: 'Add Course Run',
        description: 'Add Course Run',
    },
    'course.edit.collapsible.preview.link': {
        id: 'course.edit.collapsible.preview.link',
        defaultMessage: 'View Preview Page',
        description: 'View Preview Page',
    },
    'course.edit.collapsible.preview.span': {
        id: 'course.edit.collapsible.preview.span',
        defaultMessage: 'Any changes will go live when the website next builds',
        description: 'View Preview Page',
    },
    'course.edit.collapsible.live_view.div': {
        id: 'course.edit.collapsible.live_view.div',
        defaultMessage: 'Already published -&nbsp;',
        description: 'View Live Page',
    },
    'course.edit.collapsible.live_view.link': {
        id: 'course.edit.collapsible.live_view.link',
        defaultMessage: 'View Live Page',
        description: 'View Live Page',
    },
    'course.edit.collapsible.preview.default': {
        id: 'course.edit.collapsible.preview.default',
        defaultMessage: 'No Preview Link Available',
        description: 'No Preview Link Available',
    },
    'course.edit.collapsible.title': {
        id: 'course.edit.collapsible.title',
        defaultMessage: 'Course: {title}',
        description: 'No Preview Link Available',
    },
    'course.edit.form.optional': {
        id: 'course.edit.form.optional',
        defaultMessage: 'Optional',
        description: 'if input field is optional',
    },
    'course.edit.form.text_info': {
        id: 'course.edit.form.text_info',
        defaultMessage: 'All fields are required for publication unless otherwise specified.',
        description: 'Form info',
    },
    'course.edit.form.title': {
        id: 'course.edit.form.title',
        defaultMessage: 'Title',
        description: 'Course form title',
    },
    'course.edit.form.slug': {
        id: 'course.edit.form.slug',
        defaultMessage: 'URL slug',
        description: 'Course form slug',
    },
    'course.edit.form.number': {
        id: 'course.edit.form.number',
        defaultMessage: 'Number',
        description: 'Course form slug',
    },
    'course.edit.form.enrollment.text': {
        id: 'course.edit.form.enrollment.text',
        defaultMessage: 'Course enrollment track',
        description: 'Course form enrollment track text',
    },
    'course.edit.form.enrollment.extra': {
        id: 'course.edit.form.enrollment.extra',
        defaultMessage: 'Cannot edit after submission',
        description: 'Course form enrollment track extra text',
    },
    'course.edit.form.collaborators': {
        id: 'course.edit.form.collaborators',
        defaultMessage: 'Collaborators',
        description: 'Course form collaborators',
    },
    'course.edit.form.collaborators.item': {
        id: 'course.edit.form.collaborators.item',
        defaultMessage: 'collaborator',
        description: 'Item for Collaborators List Field',
    },
    'course.edit.form.collaborators.add': {
        id: 'course.edit.form.collaborators.add',
        defaultMessage: 'Add New Collaborators',
        description: 'Add New Collaborators',
    },
    'course.edit.form.image.text': {
        id: 'course.edit.form.image.text',
        defaultMessage: 'Image',
        description: 'Add image for course',
    },
    'course.edit.form.image.extra': {
        id: 'course.edit.form.image.extra',
        defaultMessage: 'Image must be 1134x675 pixels in size.',
        description: 'Image extra text',
    },
    'course.edit.form.short_description.text': {
        id: 'course.edit.form.short_description.text',
        defaultMessage: 'Short description',
        description: 'Short description for Course',
    },
    'course.edit.form.long_description.text': {
        id: 'course.edit.form.long_description.text',
        defaultMessage: 'Длинное описание',
        description: 'Long description for Course',
    },
    'course.edit.form.outcome.label': {
        id: 'course.edit.form.outcome.label',
        defaultMessage: 'What you will learn',
        description: 'Outcome for Course',
    },
    'course.edit.form.syllabus.label': {
        id: 'course.edit.form.syllabus.label',
        defaultMessage: 'Syllabus',
        description: 'Syllabus for Course',
    },
    'course.edit.form.prereq.label': {
        id: 'course.edit.form.prereq.label',
        defaultMessage: 'Prerequisites',
        description: 'Prerequisites for Course',
    },
    'course.edit.form.testimonials.label': {
        id: 'course.edit.form.testimonials.label',
        defaultMessage: 'Learner testimonials',
        description: 'Learner testimonials for Course',
    },
    'course.edit.form.faq.label': {
        id: 'course.edit.form.faq.label',
        defaultMessage: 'Frequently asked questions',
        description: 'Frequently asked questions for Course',
    },
    'course.edit.form.additional-info.label': {
        id: 'course.edit.form.additional-info.label',
        defaultMessage: 'Additional information',
        description: 'Any additional information to be provided to learners.',
    },
    'course.edit.form.video.label': {
        id: 'course.edit.form.video.label',
        defaultMessage: 'About video link',
        description: 'The About video should excite and entice potential students to take your course',
    },
    'course.edit.form.level.label': {
        id: 'course.edit.form.level.label',
        defaultMessage: 'Course level',
        description: 'Course level',
    },
    'course.edit.form.subject1.label': {
        id: 'course.edit.form.subject1.label',
        defaultMessage: 'Primary subject',
        description: 'The subject of the course.',
    },
    'course.edit.form.subject-secondary.label': {
        id: 'course.edit.form.subject-secondary.label',
        defaultMessage: 'Secondary subject',
        description: 'The secondary subject of the course.',
    },
    'course.edit.form.subject-tertiary.label': {
        id: 'course.edit.form.subject-tertiary.label',
        defaultMessage: 'Tertiary subject',
        description: 'The tertiary subject of the course.',
    },
    'course.edit.form.skills.label': {
        id: 'course.edit.form.skills.label',
        defaultMessage: 'Skills',
        description: 'The skills of the course.',
    },
    'course-run.edit.title': {
        id: 'course-run.edit.title',
        defaultMessage: 'Course runs',
        description: 'Course runs',
    },
});
export default messages;
