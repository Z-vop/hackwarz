/**
 * Created by cameron on 3/27/16.
 */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();

var User = require('../lib/User');

var user1 = {
    name: "oliver",
    level: 1
};

var user2 = {
    name: "cameron",
    password: "asdf",
    level: 1,
    coins: 5.0,
};


describe("Test User Object", function () {
    describe("Creating User objects", function () {

        var u1 = new User(user1);
        var u2 = new User(user2);

        it("should create unique object for each user", function () {
            expect(u1).to.be.ok;
            expect(u1).to.not.equal(u2);
            expect(u1).to.not.deep.equal(u2);
            expect(u1.name).to.equal(user1.name);
            expect(u2.name).to.equal(user2.name);
        });

        it("should have no mission set", function () {
            expect(u1.mission).to.be.null;
        });

        it("should create a default User without a parameter", function () {
            var u3 = new User();
            expect(u3.name).to.be.null;
            expect(u3.password).to.be.null;
            expect(u3.level).to.equal(0);
            expect(u3.coins).to.equal(0);
        });

        it("should set all the properties passed in", function() {
            var u3 = new User(user2);
            expect(u3.name).to.equal("cameron");
            expect(u3.password).to.equal("asdf");
            expect(u3.level).to.equal(1);
            expect(u3.coins).to.equal(5);
        });

        it("should implement all of the properties", function() {
            expect(u1).to.include.all.keys('name', 'password', 'level', 'coins', 'mission');
        });
    });

    describe('Test mission handling', function() {

        var u1 = new User(user1);

        it("should return empty completion message when no mission", function() {
            u1.checkMissionStatus().should.be.empty;
        });
    });

});

