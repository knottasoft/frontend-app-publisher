import { defineMessages } from 'react-intl';

const messages = defineMessages({
    'editor.recommendation': {
        id: 'editor.recommendation',
        defaultMessage: 'Recommended character limit (including spaces) is {maxChars}. {remainingChars} characters remaining.',
        description: 'Recommendation character limit for editor',
    },
});
export default messages;
