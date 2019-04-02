const ua = process.browser ? navigator.userAgent.toLowerCase() : '';

export const Browser = {
  IS_EDGE: /Edge\/\d./i.test(ua)
};
