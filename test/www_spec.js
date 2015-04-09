var sinon = require('sinon'),
    expect = require('chai').expect,
    expressMock = sinon.mock().returns({
        set: sinon.spy(),
        get: sinon.spy(),
        use: sinon.spy(),
        listen: sinon.spy()
    }),
    requireMock = function() {},
    pathMock = sinon.spy(),
    requestMock = sinon.spy();

expressMock.static = sinon.spy();

var www = require('../src/www')(expressMock, requestMock, requireMock, pathMock);

describe('Web application', function() {
    describe('by default', function() {
        it('should listen on port 5000', function() {
            expect(expressMock.calledOnce).to.equal(true);
        });
    });
});