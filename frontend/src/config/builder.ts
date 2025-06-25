// Builder.io completely removed to fix frame access errors
// This file has been disabled to prevent initialization issues

export const builder = {
  init: () => {
    console.log(
      "Builder.io disabled - using native Elite Sports Intelligence Platform",
    );
  },
  // Mock all builder methods to prevent errors
  get: () => Promise.resolve(null),
  register: () => {},
};
