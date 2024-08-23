import loadable from '@loadable/component';
import { advancedListingSchema } from './AdvancedListingSchema';
import { advancedCarouselSchema } from './AdvancedCarouselSchema';

// Dynamically import components using loadable
const LazyAdvancedListingBlockTemplate = loadable(() =>
  import('./AdvancedListingBlockTemplate'),
);
const LazyAdvancedCarouselBlockTemplate = loadable(() =>
  import('./AdvancedCarouselBlockTemplate'),
);

const applyConfig = (config) => {
  config.blocks.blocksConfig.listing.variations = [
    {
      id: 'advanced',
      title: 'Advanced Listing',
      template: LazyAdvancedListingBlockTemplate,
      schemaEnhancer: advancedListingSchema,
    },
    {
      id: 'advancedCarousel',
      title: 'Advanced Carousel',
      template: LazyAdvancedCarouselBlockTemplate,
      schemaEnhancer: advancedCarouselSchema,
    },
    ...config.blocks.blocksConfig.listing.variations,
  ];
  return config;
};

export default applyConfig;
