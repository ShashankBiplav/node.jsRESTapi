const expect = require('chai').expect;

const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/is-auth.js');

describe('auth middleware', function()  {
    it('should throw an error if no authorization header is present', function() {
        const req =  {
            get: function(){
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw('Not Authorized');
    });
    
    it('should throw an error if the authorization header is only one string', function() {
        const req = {
            get: function(headerName){
                return 'bearer';
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw();
    });

    it('should throw an error if the token cannot be verified', function(){
        const req = {
            get: function(headerName){
                return 'bearer xyzabc';
            }
        };
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw();
    });

    it('should yield a userId after decoding the token', function(){
        const req = {
            get: function(headerName){
                return 'bearer xyzabc';
            }
        };
        jwt.verify = function(){
            return {userId: 'abc'};
        };
        authMiddleware(req, {}, ()=>{});
        expect(req).to.have.property('userId');
    });
});