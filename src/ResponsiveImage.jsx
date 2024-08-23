import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';

const getSrcSet = (imageUrl) => `
    ${imageUrl}/mini 200w,
    ${imageUrl}/preview 400w,
    ${imageUrl}/teaser 600w,
    ${imageUrl}/large 800w,
    ${imageUrl}/larger 1000w,
    ${imageUrl}/great 1200w,
    ${imageUrl}/huge 1600w
`;

const getSizes = (howManyColumns) => {
  switch (howManyColumns) {
    case 1:
      // One-column layout: Image is full width at all breakpoints
      return `
        (max-width: 767px) 400px,
        (min-width: 768px) and (max-width: 991px) 600px,
        (min-width: 992px) and (max-width: 1199px) 800px,
        (min-width: 1200px) and (max-width: 1919px) 1000px,
        (min-width: 1920px) 1200px
      `;
    case 2:
      // Two-column layout: Half-width images for larger breakpoints
      return `
        (max-width: 767px) 400px,
        (min-width: 768px) and (max-width: 991px) 300px,
        (min-width: 992px) and (max-width: 1199px) 400px,
        (min-width: 1200px) and (max-width: 1919px) 500px,
        (min-width: 1920px) 600px
      `;
    case 3:
      // Three-column layout: One-third width images for larger breakpoints
      return `
        (max-width: 767px) 400px,
        (min-width: 768px) and (max-width: 991px) 200px,
        (min-width: 992px) and (max-width: 1199px) 300px,
        (min-width: 1200px) and (max-width: 1919px) 400px,
        (min-width: 1920px) 500px
      `;
    case 4:
      // Four-column layout: Quarter-width images for larger breakpoints
      return `
        (max-width: 767px) 400px,
        (min-width: 768px) and (max-width: 991px) 150px,
        (min-width: 992px) and (max-width: 1199px) 200px,
        (min-width: 1200px) and (max-width: 1919px) 300px,
        (min-width: 1920px) 400px
      `;
    default:
      // Default case: Use a conservative width for default handling
      return `
        (max-width: 767px) 400px,
        (min-width: 768px) and (max-width: 991px) 600px,
        (min-width: 992px) and (max-width: 1199px) 800px,
        (min-width: 1200px) and (max-width: 1919px) 1000px,
        (min-width: 1920px) 1200px
      `;
  }
};

const ResponsiveImage = React.memo(({ item, howManyColumns, fetchPriority }) => {
  const imageUrl = flattenToAppURL(`${item.url}/@@images/${item.image_field}`);
  const srcset = getSrcSet(imageUrl);
  const sizes = getSizes(howManyColumns);

  return (
    <Image
      className='listImage'
      srcSet={srcset}
      sizes={sizes}
      alt={item.title || 'Image'}
      src={imageUrl + '/preview'}
      loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
      fetchpriority={fetchPriority}
      width='200px'  // Adjusted width to 400px
      height='112px' // Adjusted height to maintain 16:9 aspect ratio
      style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }} // Maintain aspect ratio
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
  fetchPriority: PropTypes.string,
};

export default ResponsiveImage;
