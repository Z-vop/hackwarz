/** Tests for the MissionFinder */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();
var MissionFinder = require('../lib/MissionFinder.js');
var mf = MissionFinder.getInstance();
var User = require('../lib/User');
var Mission = require('../lib/Mission');


var test_missions = [
    {
        missionID: "Mission1",
        description: "Mission 1",
        trigger: function () { return this.level == 1; },
        test: function () { return (this.password ? true : false); },
        completion: function () {
            this.level = 2;
            return "mission 1 completion message";
        },
        prompts: [
            "mission 1 prompt 1",
            "mission 1 prompt 2"
        ]
    },
    {
        missionID: "Mission2",
        description: "Mission 2",
        trigger: function () { return this.level == 2; },
        test: function () { return this.coins > 20; },
        completion: function () { return "mission 2 completion message"; },
        prompts: [
            "mission 2 prompt 1",
            "mission 2 prompt 2",
            "mission 2 prompt 3"
        ]
    }
];

var user1 = {
    name: "oliver",
    level: 0,
    coins: 5.0,
};

describe('Test MissionFinder', function () {
    mf.setMissionsDB(test_missions); // using the test mission list

    describe('Test object construction', function() {
        it('Two pointers to Singleton should be same instance', function() {
            var mf2 = MissionFinder.getInstance();
            expect(mf).to.equal(mf2);
        });
        it('should allow setting the missions db', function() {
            var m1 = mf.getMission('Mission1');
            expect(m1.description).to.equal("Mission 1");
        });
        it('should return distinct Mission objects', function() {
            var m1 = mf.getMission('Mission1');
            var m2 = mf.getMission('Mission1');
            expect(m1).to.not.equal(m2);
            expect(m1).to.be.an.instanceOf(Mission);
        });
    });

    describe('Test mission finding', function() {
        it('should return null mission description if missionID is invalid', function() {
            expect(mf.getDescription("Nonsense")).to.be.null;
        });
        it('should return no mission (null) if no trigger condition is met', function() {
            var u1 = new User(user1);
            var m1 = mf.findNextMission(u1);
            expect(m1).to.be.null;
        });
        it('should return Mission object if trigger condition is met', function() {
            var u1 = new User(user1);
            u1.level = 1;
            var m1 = mf.findNextMission(u1);
            expect(m1.missionID).to.equal("Mission1");
        });
        it('should return no mission when trigger condition already met', function() {
            var u1 = new User(user1);
            u1.password = 'asdf';
            var m1 = mf.findNextMission(u1);
            expect(m1).to.be.null;
        });
    });

    describe('Test User Advancing and Mission Prompts', function() {
        var u1 = new User(user1);
        u1.level = 2;
        var m1;

        it('should return next mission when user advances', function(done) {
            m1 = mf.findNextMission(u1);
            expect(m1.missionID).to.equal("Mission2");
            u1.mission = m1;
            done();
        });
        it('should return prompts for user1', function (done) {
            u1.mission.getNextPrompt().should.equal("mission 2 prompt 1");
            u1.mission.getNextPrompt().should.equal("mission 2 prompt 2");
            u1.mission.getNextPrompt().should.equal("mission 2 prompt 3");
            u1.mission.getNextPrompt().should.be.empty;
            done();
        });
        it('should return completion message', function(done) {
            u1.mission.checkStatus(u1).should.be.empty;
            u1.coins = 21;
            u1.mission.checkStatus(u1).should.equal("mission 2 completion message");
            u1.mission = null;
            done();
        });
    });

});



