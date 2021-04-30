import { lazyLoad } from 'utils/loadable';

export const CodePage = lazyLoad(
  () => import('./index'),
  module => module.CodePage,
);
