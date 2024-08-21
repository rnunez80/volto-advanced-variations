import React from 'react';
import DefaultImageSVG from './placeholder.png';
import { Image } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import messages from './messages';
import ResponsiveImage from './ResponsiveImage';

const RenderImage = ({ item, isEditMode, howManyColumns, fetchPriority }) => {
  const intl = useIntl();

  const imageContent = item.image_field ? (
    <ResponsiveImage item={item} howManyColumns={howManyColumns} fetchPriority={fetchPriority} />
  ) : (
    <Image
      className='listImage'
      src={DefaultImageSVG}
      alt={intl.formatMessage(messages.thisContentHasNoImage)}
      width='100%'
    />
  );

  return imageContent;
};

export default RenderImage;
