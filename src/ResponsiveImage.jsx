import React from 'react';
import { Image } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';

const ResponsiveImage = ({ item, howManyColumns }) => {
    const imageUrl = flattenToAppURL(`${item.url}/@@images/${item.image_field}`);
    let srcset = `
        ${imageUrl}/mini 200w,
        ${imageUrl}/preview 400w,
        ${imageUrl}/teaser 600w,
        ${imageUrl}/large 800w,
        ${imageUrl}/larger 1000w,
        ${imageUrl}/great 1200w,
        ${imageUrl}/huge 1600w
    `;

    let sizes = '(min-width: 768px) and (max-width: 991px) 1000px, (min-width: 992px) and (max-width: 1199px) 1200px';

    if (howManyColumns === 2) {
        sizes = '(min-width: 768px) and (max-width: 991px) 355px, (min-width: 992px) and (max-width: 1199px) 460px, (min-width: 1200px) 557px';
    }
    if (howManyColumns === 3) {
        sizes = '(min-width: 768px) and (max-width: 991px) 232px, (min-width: 992px) and (max-width: 1199px) 302px, (min-width: 1200px) 367px';
    }
    if (howManyColumns === 4) {
        sizes = '(min-width: 768px) and (max-width: 991px) 171px, (min-width: 992px) and (max-width: 1199px) 223px, (min-width: 1200px) 272px';
    }

    return (
        <Image
            className='listImage'
            srcset={srcset}
            sizes={sizes}
            alt={item.title}
            size='small'
            src={imageUrl + '/preview'}
        />
    );
};

export default ResponsiveImage;
