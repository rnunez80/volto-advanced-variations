import React from 'react';
import DefaultImageSVG from './placeholder.png';
import { Grid, Image } from 'semantic-ui-react';
import { injectIntl, useIntl } from 'react-intl';
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
          size='small'
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
