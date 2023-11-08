import AdvancedListingBlockTemplate from './AdvancedListingBlockTemplate';
import AdvancedCarouselBlockTemplate from './AdvancedCarouselBlockTemplate';
import { advancedSchema } from './advancedSchema';
import { advancedListingSchema } from './AdvancedListingSchema';
import { advancedCarouselSchema } from './AdvancedCarouselSchema';

const applyConfig = (config) => {
  config.blocks.blocksConfig.listing.variations = [
    {
      id: 'advanced',
      title: 'Advanced Listing',
      template: AdvancedListingBlockTemplate,
      schemaEnhancer: advancedListingSchema,
    },
    {
      id: 'advancedCarousel',
      title: 'Advanced Carousel',
      template: AdvancedCarouselBlockTemplate,
      schemaEnhancer: advancedCarouselSchema,
    },
    ...config.blocks.blocksConfig.listing.variations,
  ];
  return config;
};

export default applyConfig;
