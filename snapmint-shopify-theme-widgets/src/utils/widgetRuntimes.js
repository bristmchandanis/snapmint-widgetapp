export const mountedWidgets = new WeakMap();

export const pdpRuntime = {
  widget: null,
  manualWidget: null,
  committedData: null,
  pendingSnapshot: null,
  pendingTimer: null,
  eventGeneration: 0,
  suppressBubblingChange: false,
  eventVariant: null,
  usesGenericPlacement: false,
};

export const cartRuntime = {
  widget: null,
  manualWidget: null,
};
