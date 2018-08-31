const Nightmare = require('nightmare');
var argv = require('optimist')
.usage('Check in to Southwest Flight. \nUsage: $0')
.demand(['c','f', 'l'])
.string(['c','f', 'l'])
.alias('c', 'confirmation')
.alias('f', 'firstName')
.alias('l', 'lastName')
.describe('show', 'Show Electron window')
.argv;

const show = !!argv.show
const confirmationNumber = argv.c;
const firstName = argv.f;
const lastName = argv.l;


const nightmare = Nightmare({
  openDevTools: {
    mode: 'detach'
  },
  show: show
});

nightmare
  .goto('https://www.southwest.com/air/check-in/index.html')
  .wait('input#confirmationNumber')
  .wait(300)
  .type('input#confirmationNumber', confirmationNumber)
  .type('input#passengerFirstName', firstName)
  .type('input#passengerLastName', lastName)
  .click('button#form-mixin--submit-button')
  .wait('button.air-check-in-review-results--check-in-button')
  .click('button.air-check-in-review-results--check-in-button')
  // .wait(function(done) {
  //   console.log('Waiting for checkin button.');
  //   var checkinButtonEl = 'button.air-check-in-review-results--check-in-button',
  //     errorsEl = 'div.page-error h2'; // TODO: this errors is prob wrong

  //   var err = document.querySelector(errorsEl);
  //   if (err) {
  //     done(err.innerText || 'UNKNOWN ERROR');
  //     return;
  //   }

  //   done(null, !!document.querySelector(checkinButtonEl));
  // })
  .wait('.air-check-in-passenger-item--information-boarding-position')
  .evaluate(function () {
    var pos = document.querySelectorAll('.air-check-in-passenger-item--information-boarding-position > span');

    var out = [];
    for (var i = 0; i < pos.length; i++) {
      var txt = pos[i].innerText.trim();
      if (txt) {
        out.push(txt)
      }
    }
    return out.join(', ');
  })
  .end()
  .then(function (result) {
    console.log('Boarding Group: ' + result);
  })
  .catch(function (error) {
    console.error('Login failed:', error);
    process.exit(1);
  });
