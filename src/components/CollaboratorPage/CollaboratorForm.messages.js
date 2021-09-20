import { defineMessages } from 'react-intl';

const messages = defineMessages({
    'collaborator.alert.status.error.title': {
        id: 'collaborator.alert.status.error.title',
        defaultMessage: 'Could not load page: ',
        description: 'Title for alert message into create collaborator page',
    },
    'collaborator.alert.status.error.message': {
        id: 'collaborator.alert.status.error.message',
        defaultMessage: 'Direct access to collaborators not supported',
        description: 'Message for alert message into create collaborator page',
    },
    'collaborator.title.create': {
        id: 'collaborator.title.create',
        defaultMessage: 'Create New Collaborator',
        description: 'Title for collaborator page',
    },
    'collaborator.title.edit': {
        id: 'collaborator.title.edit',
        defaultMessage: 'Edit Collaborator',
        description: 'Title for collaborator page',
    },
    'collaborator.alert.status.sent-from-edit-course-info.message': {
        id: 'collaborator.alert.status.sent-from-edit-course-info.message',
        defaultMessage: 'The data you entered on the course edit screen is saved. You will return to that page when you have finished updating collaborator information.',
        description: 'Message for alert message into create colaborator page',
    },
    'collaborator.form.image.label': {
        id: 'collaborator.form.image.label',
        defaultMessage: 'Image',
        description: 'Image for collaborator',
    },
    'collaborator.form.image.extra': {
        id: 'collaborator.form.image.extra',
        defaultMessage: 'Image must be 200x100 pixels in size.',
        description: 'Image extra text for collaborator',
    },
    'collaborator.form.name.label': {
        id: 'collaborator.form.name.label',
        defaultMessage: 'Name',
        description: 'Name for collaborator',
    },
    'collaborator.form.button.cancel': {
        id: 'collaborator.form.button.cancel',
        defaultMessage: 'Cancel',
        description: 'Cancel button for Collaborator page',
    },
    'collaborator.form.create.button.create': {
        id: 'collaborator.form.create.button.create',
        defaultMessage: 'Create',
        description: 'Create button for Collaborator page',
    },
    'collaborator.form.create.button.pending': {
        id: 'collaborator.form.create.button.pending',
        defaultMessage: 'Creating',
        description: 'Creating status for Collaborator page',
    },
    'collaborator.form.edit.button.create': {
        id: 'collaborator.form.edit.button.create',
        defaultMessage: 'Save',
        description: 'Create button for Collaborator page',
    },
    'collaborator.form.edit.button.pending': {
        id: 'collaborator.form.edit.button.pending',
        defaultMessage: 'Saving',
        description: 'Creating status for Collaborator page',
    },
});

export default messages;
