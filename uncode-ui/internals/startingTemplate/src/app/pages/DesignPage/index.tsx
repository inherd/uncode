import * as React from 'react';
import { Helmet } from 'react-helmet-async';

export function DesignPage() {
  return (
    <>
      <Helmet>
        <title>Uncode Design</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <span>Uncode Design</span>
    </>
  );
}
