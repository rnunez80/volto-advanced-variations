import React from 'react';
import PropTypes from 'prop-types';
import DefaultImageSVG from './placeholder.png';
import { Image } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import messages from './messages';
import ResponsiveImage from './ResponsiveImage';
import { Link } from 'react-router-dom';

const RenderImage = ({ item, isEditMode, howManyColumns }) => {
  const intl = useIntl();

  const imageAltText = intl.formatMessage(messages.thisContentHasNoImage);

  return (
    <Link to={item.url} condition={!isEditMode}>
      {item.image_field ? (
        <ResponsiveImage item={item} howManyColumns={howManyColumns} />
      ) : (
        <Image
          className='listImage'
          src={DefaultImageSVG}
          alt={imageAltText}
          size='small'
          width='100%'
        />
      )}
    </Link>
  );
};

RenderImage.propTypes = {
  item: PropTypes.shape({
    url: PropTypes.string.isRequired,
    image_field: PropTypes.string,
  }).isRequired,
  isEditMode: PropTypes.bool,
  howManyColumns: PropTypes.number,
};

export { RenderImage };
export default React.memo(RenderImage);
