import dynamic from 'next/dynamic';
import React from 'react';

const Editor = dynamic(() => import('./_RitchTextEditor'), {
  ssr: false,
});

const RitchTextEditor = () => {
  return <Editor />;
};

export default RitchTextEditor;
