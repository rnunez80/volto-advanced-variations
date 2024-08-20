import React, { Suspense } from 'react';
import { advancedListingSchema } from './AdvancedListingSchema';
import { advancedCarouselSchema } from './AdvancedCarouselSchema';

const LazyAdvancedListingBlockTemplate = React.lazy(() =>
  import('./AdvancedListingBlockTemplate'),
);
const LazyAdvancedCarouselBlockTemplate = React.lazy(() =>
  import('./AdvancedCarouselBlockTemplate'),
);

const LoadingFallback = () => <div>Loading...</div>;

const applyConfig = (config) => {
  config.blocks.blocksConfig.listing.variations = [
    {
      id: 'advanced',
      title: 'Advanced Listing',
      template: (props) => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyAdvancedListingBlockTemplate {...props} />
        </Suspense>
      ),
      schemaEnhancer: advancedListingSchema,
    },
    {
      id: 'advancedCarousel',
      title: 'Advanced Carousel',
      template: (props) => (
        <Suspense fallback={<LoadingFallback />}>
          <LazyAdvancedCarouselBlockTemplate {...props} />
        </Suspense>
      ),
      schemaEnhancer: advancedCarouselSchema,
    },
    ...config.blocks.blocksConfig.listing.variations,
  ];
  return config;
};

export default applyConfig;
