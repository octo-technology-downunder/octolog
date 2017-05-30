require('babel-register')

var config = require('../../config')

module.exports = {
  src_folders: ['client/test/e2e/specs'],
  output_folder: 'client/test/e2e/reports',
  custom_assertions_path: ['client/test/e2e/custom-assertions'],

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    phantomjs: {
      desiredCapabilities : {
        browserName: 'phantomjs',
        javascriptEnabled : true,
        acceptSslCerts : true,
        'phantomjs.binary.path': 'node_modules/phantomjs-prebuilt/bin/phantomjs',
        'phantomjs.cli.args' : ['--ignore-ssl-errors=true'],
        'phantomjs.page.settings.userAgent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/52.0.2743.116 Chrome/52.0.2743.116 Safari/537.36'
      }
    }
  }
}
