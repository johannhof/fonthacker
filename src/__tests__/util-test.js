jest.dontMock('../util');

var util = require('../util');

describe('capitalise', function() {

  it('capitalises an all lowercase string', function() {
    var mystring = "how is babby formed";

    expect(util.capitalise(mystring)).toBe("How is babby formed");
  });

  it('leaves an already capitalised string', function() {
    var mystring = "You need to do way instain mother";

    expect(util.capitalise(mystring)).toBe(mystring);
  });

});
