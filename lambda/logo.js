const rp = require('request-promise-native')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;

 function getLogoUrl(compamyName) {
  const options = {
    method: 'GET',
    uri: 'https://en.wikipedia.org/w/api.php?action=query&format=json&errorformat=bc&errorlang=uselang&list=search&utf8=1&srsearch=' + compamyName,
  };
  return rp(options)
    .then((body) => {
      const results = JSON.parse(body).query.search
      if(results.length === 0) return '';
      companyResult = results.filter(i => {
        return i.snippet.toLowerCase().includes('company')
      })
      if(companyResult.length === 0) {
        return createWikiURL(results[0].title)
      }
      return createWikiURL(companyResult[0].title)

    })
}
function createWikiURL(page) {
  page = page.replace(' ', '%20')
  return `https://en.wikipedia.org/wiki/${page}`
}

function getImageUrl(uri) {
  const options = {
    method: 'GET',
    uri
  };
  return rp(options)
    .then((body) => {
      const { document } = (new JSDOM(body)).window;
      return document.querySelector(".infobox.vcard a img").getAttribute('src')
    })
}


function main(companyName) {
  return getLogoUrl(companyName).then(getImageUrl)
}
module.exports = {
  getLogoUrl,
  getImageUrl,
  main
}
