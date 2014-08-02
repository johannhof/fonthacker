jest.dontMock('../dom');

var dom = require('../dom');

describe('select', function() {

  it('changes the background of elements on select', function() {
    // Set up our document body
    document.body.innerHTML =
      '<div>' +
      '  <span id="username" />' +
      '  <button id="button" />' +
      '</div>';

    dom.init();

    dom.select(function () { });

    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'mouseover', true, true, window, null, 0, 0, 0, 0, '', false, false, false, false, 0);

    var el = document.getElementById("username");
    el.dispatchEvent(event);

    expect(el.style.backgroundColor).toBe("lisghtblue");

  });

});
