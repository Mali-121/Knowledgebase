module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            ie: '10',     // Specify the minimum version of IE
            safari: '8',  // Specify the minimum version of Safari
          },
          useBuiltIns: 'usage', // Automatically import polyfills based on usage
          corejs: 3,            // Specify version of core-js for polyfills
        },
      ],
    ],
  };
  