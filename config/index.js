const config = {
  projectName: 'flash',
  date: '2026-03-23',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 2 / 2,
    828: 1.81 / 2,
    375: 2 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-react'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compapp: [],
  mini: {
    compile: {
      exclude: [],
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
      cssModules: {
        enable: false,
        config: {},
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {},
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    const devConfig = {};
    return merge({}, config, devConfig);
  }
  const prodConfig = {};
  return merge({}, config, prodConfig);
};
