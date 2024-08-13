import React from 'react';
import DefaultImageSVG from './placeholder.png';
import { Image } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import messages from './messages';
import ResponsiveImage from './ResponsiveImage';
import { Link } from 'react-router-dom';

const renderImage = (item, isEditMode, howManyColumns) => {
  const intl = useIntl();

  if (!item.image_field) {
    return (
      <Link to={item.url} condition={!isEditMode}>
        <Image
          className='listImage'
          src={DefaultImageSVG}
          alt={intl.formatMessage(messages.thisContentHasNoImage)}
          width='100%'
        />
      </Link>
    );
  }

  return (
    <Link to={item.url} condition={!isEditMode}>
      <ResponsiveImage item={item} howManyColumns={howManyColumns} />
    </Link>
  );
};

export default renderImage;
