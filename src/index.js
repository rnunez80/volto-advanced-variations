import loadable from '@loadable/component';
import { advancedListingSchema } from './AdvancedListingSchema';
import { advancedCarouselSchema } from './AdvancedCarouselSchema';
import { mosaicListingSchema } from './MosaicListingSchema';

// Dynamically import components using loadable
const LazyAdvancedListingBlockTemplate = loadable(() =>
  import('./AdvancedListingBlockTemplate'),
);
const LazyAdvancedCarouselBlockTemplate = loadable(() =>
  import('./AdvancedCarouselBlockTemplate'),
);
const LazyMosaicListingBlockTemplate = loadable(() =>
  import('./MosaicListingBlockTemplate'),
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
    {
      id: 'mosaicListing',
      title: 'Mosaic Listing',
      template: LazyMosaicListingBlockTemplate,
      schemaEnhancer: mosaicListingSchema,
    },
    ...config.blocks.blocksConfig.listing.variations,
  ];
  return config;
};

export default applyConfig;
