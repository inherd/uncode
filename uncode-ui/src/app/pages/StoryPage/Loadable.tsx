/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const StoryPage = lazyLoad(
  () => import('./index'),
  module => module.StoryPage,
);
