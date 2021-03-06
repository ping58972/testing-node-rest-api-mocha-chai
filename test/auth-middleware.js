const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function() {
    
    it('should throw an error if no authorization header is present', function() {
        const req = {
            get: function(headerName){
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw('Not authorization.');
    }); 
    
    it('should throw an error if the authorization header is only one string', function() {
        const req = {
            get: function(headerName){
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw();
    });

    it('should yield a userId agter decoding the token', function(){
        const req = {
            get: function(headerName){
                return 'Bearer sff';
            }
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({userId: 'abc'}); 
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw();
    });


} );

