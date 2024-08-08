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
    case 2:
      return '(min-width: 768px) and (max-width: 991px) 355px, (min-width: 992px) and (max-width: 1199px) 460px, (min-width: 1200px) 557px';
    case 3:
      return '(min-width: 768px) and (max-width: 991px) 232px, (min-width: 992px) and (max-width: 1199px) 302px, (min-width: 1200px) 367px';
    case 4:
      return '(min-width: 768px) and (max-width: 991px) 171px, (min-width: 992px) and (max-width: 1199px) 223px, (min-width: 1200px) 272px';
    default:
      return '(min-width: 768px) and (max-width: 991px) 1000px, 100vw';
  }
};

const renderImage = ({ item, isEditMode, howManyColumns }) => {
  const imageUrl = flattenToAppURL(item.image?.scales?.great?.download || item.image);
  return (
    <Image
      src={imageUrl}
      srcSet={getSrcSet(imageUrl)}
      sizes={getSizes(howManyColumns)}
      alt={item.title}
      style={isEditMode ? { pointerEvents: 'none' } : {}}
    />
  );
};

renderImage.propTypes = {
  item: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool,
  howManyColumns: PropTypes.number,
};

export default renderImage;
