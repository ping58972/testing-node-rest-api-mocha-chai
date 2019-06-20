const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

const MONGODB_URI = 'mongodb+srv://ping:pink58972@cluster0-5aiyx.mongodb.net/test-rest-api-messages?retryWrites=true';

describe('Auth Controller', function() {
    before(function(done){
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(result => {
            const user = new User({
                email: 'text@test.com',
                password: '58972',
                name: 'ping',
                posts: [],
                _id: '5d09c5b43385c33580ed7553'
            });
            return user.save();
        }).then(()=> {done()});
    });

    beforeEach(function(){});

    afterEach(function(){});

    it('should throw an error if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'pink58972@gmail.com',
                password: '58972'
            }
        };

        AuthController.login(req, {}, ()=>{}).then(result => {
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function(done) {
   
            const req = {userId:'5d09c5b43385c33580ed7553'}
            const res = {
                statusCode: 500,
                userStatus: null,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.userStatus = data.status;
                }
            };
            AuthController.getStatus(req, res, ()=>{}).then(()=>{
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new Ping!');
                done();
            });
       
    });
    after(function(done){
        User.deleteMany({}).then(()=>{
            mongoose.disconnect();
        }).then(()=> {
            done();
        });
    });
});