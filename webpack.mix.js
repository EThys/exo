// const workboxPlugin = require('workbox-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const mix = require('laravel-mix');
// const replace = require( 'replace-in-file' );
// const path = require( 'path' );
// const publicDir = 'public/wb-assets';

// the path(s) that should be cleaned
// let pathsToClean = [
//    'public/wb-assets/*'
//  ]
// the clean options to use
// let cleanOptions = {
//    verbose: true,
//    dry: false,
//    watch: true,
//  }

// if (mix.inProduction()) {
// mix.webpackConfig({
//    plugins: [
//       new CleanWebpackPlugin(pathsToClean, cleanOptions),
//       new workboxPlugin.InjectManifest({
//          swSrc: 'resources/js/sw.js', // more control over the caching
//          swDest: 'sw.js', // the service-worker file name
//          importsDirectory: 'wb-assets', // have a dedicated folder for sw files
//          globDirectory: '.',
//          // globIgnores: ['public/fonts/vendor/@fortawesome/fontawesome-free/*.*'],
//          globPatterns: ['public/js/custom/*.js'],
//          templatedUrls: {
//             '/': 'resources/views/spa.blade.php'
//          },
//          modifyUrlPrefix: {
//             'public': ''
//          }
//       })
//    ],
//    // output: {
//    //    // filename: '[name].js',
//    //    // chunkFilename: 'js/[name].app.js', 
//    //    publicPath: ''
//    // }
// });
// }

mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   // .copy('node_modules/idb/build/idb.js', 'public/vendor/js/idb.js')
   .extract()
   .version()
   .disableNotifications();
   // .then(() => replace.sync({
   //    // FIXME:   Workaround for laravel-mix placing '//*.js' at the begining of JS filesystem
   //    files: path.normalize( `${publicDir}/precache-manifest.*.js` ),
   //    from:  /\/\//gu,
   //    to:    '/',
   // }));

