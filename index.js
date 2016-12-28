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


const nightmare = Nightmare({ show: show });

nightmare
  .goto('https://www.southwest.com/flight/retrieveCheckinDoc.html')
  .wait('input#confirmationNumber')
  .wait(300)
  .type('input#confirmationNumber', confirmationNumber)
  .type('input#firstName', firstName)
  .type('input#lastName', lastName)
  .click('input#submitButton')
  .wait(function(done) {
    var checkinButtonEl = 'input#printDocumentsButton',
      errorsEl = 'ul#errors',
      tooEarlyTxt = 'The request to check in and print your Boarding Pass is more than 24 hours prior to your scheduled',
      invalidConf = 'The confirmation number entered is invalid';

    var err = document.querySelector(errorsEl);
    if (err) {
      var txt = err.innerText;
      if (txt.indexOf(tooEarlyTxt) !== -1) {
        done('Too Early', null);
        return;
      } else if (txt.indexOf(invalidConf) !== -1) {
        done('Invalid confirmation number', null);
        return;
      }
    }
    //console.log('err', err && err.innerText);
    //console.log('el', !!document.querySelector(checkinButtonEl));

    done(null, !!document.querySelector(checkinButtonEl));
  })
  .click('input#printDocumentsButton')
  .wait('.itinerary_content')
  .evaluate(function () {
    return '' + document.querySelector('.boarding_group > .boardingInfo').innerText + 
      ' ' + document.querySelector('.boarding_position > .boardingInfo').innerText;

    /*
    <td class="boarding_group"><span class="boardingInfo">A</span></td>
    <td class="boarding_position"><span class="boardingInfo">46</span></td>
    */
  })
  .end()
  .then(function (result) {
    console.log('Boarding Group: ' + result);
  })
  .catch(function (error) {
    console.error('Login failed:', error);
    process.exit(1);
  });