import loadable from '@loadable/component';
import {advancedListingSchema} from './AdvancedListingSchema';
import {advancedCarouselSchema} from './AdvancedCarouselSchema';
import {mosaicListingSchema} from './MosaicListingSchema';
import {advancedTableSchema} from './AdvancedTableSchema';
import {advancedListMarkerSchema} from './AdvancedListMarkerSchema';

const LazyAdvancedListingBlockTemplate = loadable(() =>
  import('./AdvancedListingBlockTemplate'),
);
const LazyAdvancedCarouselBlockTemplate = loadable(() =>
  import('./AdvancedCarouselBlockTemplate'),
);
const LazyMosaicListingBlockTemplate = loadable(() =>
  import('./MosaicListingBlockTemplate'),
);
const LazyAdvancedTableBlockTemplate = loadable(() =>
  import('./AdvancedTableBlockTemplate'),
);
const LazyAdvancedListMarkerBlockTemplate = loadable(() =>
  import('./AdvancedListMarkerBlockTemplate'),
);

const applyConfig = (config) => {
  config.blocks.blocksConfig.listing.variations = [
    {
      id: 'advancedCarousel',
      title: 'Advanced Carousel',
      template: LazyAdvancedCarouselBlockTemplate,
      schemaEnhancer: advancedCarouselSchema,
    },
    {
      id: 'advanced',
      title: 'Advanced Listing',
      template: LazyAdvancedListingBlockTemplate,
      schemaEnhancer: advancedListingSchema,
    },
    {
      id: 'advancedTable',
      title: 'Advanced Table',
      template: LazyAdvancedTableBlockTemplate,
      schemaEnhancer: advancedTableSchema,
    },
    {
      id: 'advancedListMarker',
      title: 'Advanced List Marker',
      template: LazyAdvancedListMarkerBlockTemplate,
      schemaEnhancer: advancedListMarkerSchema,
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
