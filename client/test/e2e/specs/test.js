module.exports = {
  'home to cv navigation': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .assert.title('Octo CVs')
      .waitForElementVisible('.home', 5000)
      .assert.containsText('h2', 'Trigram')
      .setValue('input[class=trigram]', 'tri')
      .setValue('input[class=password]', 'somePassWord')
      .click('button[class="validate"]')
      .waitForElementVisible('div', 5000)
      .assert.urlContains("/cv?trigram=TRI")
      .assert.elementPresent('.person')
      .assert.elementCount('h1', 4)
      .assert.containsText('.education h1', 'EDUCATION')
      .assert.containsText('.skills h1', 'SKILLS')
      .assert.containsText('.experience h1:nth-of-type(1)', 'MISSIONS - FOR OCTO TECHNOLOGY')
      .assert.containsText('.experience h1:nth-of-type(2)', 'EXPERIENCE - PRIOR TO OCTO TECHNOLOGY')
      .end()
  }
}
