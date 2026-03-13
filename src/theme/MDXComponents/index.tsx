import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';

function TableWrapper(props: React.ComponentPropsWithoutRef<'table'>) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table {...props} style={{ width: '100%', minWidth: 'max-content' }} />
    </div>
  );
}

export default {
  ...MDXComponents,
  table: TableWrapper,
};
