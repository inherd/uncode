/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const DesignPage = lazyLoad(
  () => import('./index'),
  module => module.DesignPage,
);
