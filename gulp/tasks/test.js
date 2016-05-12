'use strict';

import gulp    from 'gulp';
import {jsdom} from 'jsdom';
import {argv}  from 'yargs';
import gjc     from 'gulp-jsx-coverage';
import config  from '../config';

gulp.task('test', () => {

  let files;

  // Allow specification of a single test file
  if ( argv.f || argv.file ) {
    let singleFile = argv.f || argv.file;

    // Allow omission of directory and/or extension
    if ( singleFile.indexOf('tests/') === -1 ) { singleFile = `tests/${singleFile}`; }
    if ( singleFile.indexOf('.test.js') === -1 ) { singleFile += '.test.js'; }

    // Include top-level helper even when running specific tests
    files = ['tests/helper.js', singleFile];
  } else {
    // Default to all test files
    files = [config.testFiles];
  }

  // Ensure that all window/DOM related properties
  // are available to all tests
  global.document = jsdom('<!DOCTYPE html><html><body></body></html>');
  global.window = document.parentWindow;
  global.location = { href: '' };
  global.navigator = {};
  global.navigator.userAgent = 'jsdom';
  global.navigator.appVersion = '';

  // Ensure that 'sinon' and 'chai' library methods will be
  // available to all tests
  global.assert = require('chai').assert;

  return (gjc.createTask({
    src: files,

    istanbul: {
      coverageVariable: '__MY_TEST_COVERAGE__',
      exclude: /node_modules|tests|build|gulp|testHelpers/
    },

    transpile: {
      babel: {
        include: /\.jsx?$/,
        exclude: /node_modules/
      }
    },

    coverage: {
      reporters: ['text-summary', 'html'],
      directory: '__coverage__/'
    },

    mocha: {
      reporter: 'spec'
    },

    babel: {
      sourceMap: 'both'
    },

    cleanup: () => {
      process.exit(0);
    }
  }))();

});
