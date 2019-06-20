const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
//const Post = require('../models/post');
const FeedController = require('../controllers/feed');

const MONGODB_URI = 'mongodb+srv://ping:pink58972@cluster0-5aiyx.mongodb.net/test-rest-api-messages?retryWrites=true';

describe('Feed Controller', function() {
    before(function(done){
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(result => {
            const user = new User({
                email: 'text@test.com',
                password: '58972',
                name: 'ping',
                posts: [],
                _id: '5d09c5b43385c33580ed7558'
            });
            return user.save();
        }).then(()=> {done()});
    });

    

    it('should add a created post to the posts of the creator', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5d09c5b43385c33580ed7558'
        };
        const res = {status: function(){
            return this;
        }, json: function(){}};
        FeedController.createPost(req, res, ()=>{}).then(saveUser => {
            expect(saveUser).to.have.property('posts');
            expect(saveUser.posts).to.have.length(1);
            done();
        });

        User.findOne.restore();
    });

    
    after(function(done){
        User.deleteMany({}).then(()=>{
            mongoose.disconnect();
        }).then(()=> {
            done();
        });
    });
});