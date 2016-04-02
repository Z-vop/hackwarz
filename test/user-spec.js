/**
 * Created by cameron on 3/27/16.
 */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();

var User = require('../lib/User')
var MissionFinder = require('../lib/MissionFinder');

var user1 = {
    name: "oliver",
    password: "",
    level: 1,
    coins: 0.0,
};

var user2 = {
    name: "cameron",
    password: "asdf",
    level: 1,
    coins: 5.0,
};

var mission1 = {
    mission_number: -1, /* -1 Means no mission */
    mission: null,
    mission_prompt: 0
}


describe("Test User Object", function () {
    describe("Creating User objects", function () {

        var u1 = new User(user1);
        var u2 = new User(user2);

        it("should create unique object for each user", function () {
            expect(u1).to.be.ok;
            expect(u1).to.not.deep.equal(u2);
            expect(u1.info.name).to.equal(user1.name);
            expect(u2.info.name).to.equal(user2.name);
        });

        it("should have no mission set", function () {
            expect(u1.mission).to.be.null;
        });

        it("should create a default User without a parameter", function () {
            var u3 = new User();
            expect(u3.info.name).to.be.null;
            expect(u3.info.password).to.be.null;
            expect(u3.info.level).to.equal(0);
            expect(u3.info.coins).to.equal(0);
        });

        it("should implement all of the properties", function() {
            expect(u1).to.include.all.keys('info', 'mission');
            expect(u1.info).to.include.all.keys('name', 'password', 'level', 'coins');
        });
    });

    describe("Setting and using a Mission", function() {

        var u1 = new User(user1);

        it("should set the user mission if passed a missionID", function() {
            u1.setMission('SetPassword');
            expect(u1.mission).to.equal('SetPassword');
        });
        it("Should not set the mission to an invalid missionID", function() {
            u1.setMission('Nonsense');
            expect(u1.mission).to.be.null;
        });
        it("Should throw an error if we send a non-String parameter", function() {
            expect(function() {
                u1.setMission(0);
            }).to.throw(Error);
        });
        it("Should set the user to 'no mission' if passed a null", function() {
            u1.setMission('SetPassword');
            u1.setMission(null);
            expect(u1.mission).to.be.null;
        })
    });
});

