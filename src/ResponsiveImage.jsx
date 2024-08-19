import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';

const getSrcSet = (imageUrl) => `
        ${imageUrl}/mini 200w,
        ${imageUrl}/preview 600w,
        ${imageUrl}/teaser 800w,
        ${imageUrl}/large 1000w,
        ${imageUrl}/larger 1200w,
        ${imageUrl}/great 1400w,
        ${imageUrl}/huge 1600w
`;

const getSizes = (howManyColumns) => {
  switch (howManyColumns) {
    case 2:
      return '(min-width: 768px) and (max-width: 991px) 355px, (min-width: 992px) and (max-width: 1199px) 460px, (min-width: 1200px) 557px';
    case 3:
      return '(min-width: 768px) and (max-width: 991px) 232px, (min-width: 992px) and (max-width: 1199px) 302px, (min-width: 1200px) 367px';
    case 4:
      return '(min-width: 768px) and (max-width: 991px) 171px, (min-width: 992px) and (max-width: 1199px) 223px, (min-width: 1200px) 272px';
    default:
      return '(min-width: 200px) and (max-width: 400px) 200px,(min-width: 401px) and (max-width: 767px) 600px, (min-width: 768px) and (max-width: 991px) 800px, (min-width: 992px) and (max-width: 1199px) 1000px';
  }
};

const ResponsiveImage = React.memo(({ item, howManyColumns }) => {
  const imageUrl = flattenToAppURL(`${item.url}/@@images/${item.image_field}`);
  const srcset = getSrcSet(imageUrl);
  const sizes = getSizes(howManyColumns);

    return (
        <Image
            className='listImage'
            srcSet={srcset}
            sizes={sizes}
            alt={item.title || 'Image'}
            width='100%'
            src={imageUrl + '/preview'}
            loading='eager'
        />
    );
});

ResponsiveImage.propTypes = {
  item: PropTypes.shape({
    url: PropTypes.string.isRequired,
    image_field: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  howManyColumns: PropTypes.number,
};

export default ResponsiveImage;
