import React from 'react';
import '../../src/component/overlay-element.mjs';
export function withDevOverlay(Component, options) {
  if (!Component) {
    console.error('withDevOverlay 接收的 Component 为 undefined');
    return () => <div>Component missing</div>;
  }
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }

  const OverlayWrapper = (props) => (
    <overlay-element
      debug-id={options.debugId}
      file={options.file}
      line={options.line}
      column={options.column}
    >
      <Component {...props} />
    </overlay-element>
  );

  OverlayWrapper.displayName = `Overlay(${Component?.displayName || Component?.name})`;
  return OverlayWrapper;
}