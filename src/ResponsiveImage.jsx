import React from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';

const getSrcSet = (imageUrl) => `${imageUrl}/teaser 600w, ${imageUrl}/large 800w, ${imageUrl}/larger 1000w`;

const getSizes = (howManyColumns) => {
  switch (howManyColumns) {
    case 1:
      return '(min-width: 1200px) 800px, (min-width: 768px) 600px, 400px';
    case 2:
      return '(min-width: 1200px) 600px, (min-width: 768px) 400px, 400px';
    case 3:
      return '(min-width: 1200px) 400px, (min-width: 768px) 300px, 400px';
    case 4:
      return '(min-width: 1200px) 400px, (min-width: 768px) 300px, 300px';
    default:
      return '(min-width: 1200px) 800px, (min-width: 768px) 600px, 400px';
  }
};

const ResponsiveImage = React.memo(({ item, howManyColumns, fetchPriority }) => {
  const imageUrl = flattenToAppURL(`${item.url}/@@images/${item.image_field}`);
  const srcset = getSrcSet(imageUrl);
  const sizes = getSizes(howManyColumns);

  return (
    <img
      className='listImage'
      srcSet={srcset}
      sizes={sizes}
      alt={'Learn More about ' + item.title || 'Image'}
      src={imageUrl + '/teaser'}
      loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
      fetchpriority={fetchPriority}
      decoding="async"
      style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
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
