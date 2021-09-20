import { defineMessages } from 'react-intl';

const messages = defineMessages({
    'image-upload.large-error': {
        id: 'course-run.edit.image-upload.large-error',
        defaultMessage: 'That image is too large. Please upload an image that is less than {maxImageSizeKilo} kB. Remember that image dimensions must be exactly {requiredWidth}×{requiredHeight} pixels.',
        description: 'Image upload size validation error for Course run',
    },
    'image-upload.size-error': {
        id: 'course-run.edit.image-upload.size-error',
        defaultMessage: 'That image has the wrong dimensions. Please upload an image with exactly {requiredWidth}×{requiredHeight} pixels.',
        description: 'Image upload size validation error for Course run',
    },
});

export default messages;
