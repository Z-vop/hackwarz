/** Tests for the MissionFinder */

var chai = require('chai');
var expect = require('chai').expect;
var should = require('chai').should();
var MissionFinder = require('../lib/MissionFinder.js');


var test_missions = [
    {
        missionID: "Mission1",
        description: "Mission 1",
        trigger: function () { return this.level == 1; },
        test: function () { return this.password != ''; },
        completion: function () {
            this.level = 2;
            return "mission 0 completion message";
        },
        prompts: [
            "mission 0 prompt 0",
            "mission 0 prompt 1"
        ]
    },
    {
        missionID: "Mission2",
        description: "Mission 2",
        trigger: function () { return this.level == 2; },
        test: function () { return this.bitcoins > 20; },
        completion: function () { return "mission 1 completion message"; },
        prompts: [
            "mission 1 prompt 0"
        ]
    }
];

describe('Test MissionFinder', function () {


    describe('Test typical MissionFinder usage', function() {
        var mf = new MissionFinder();
        mf.setMissionsDB(test_missions); // using the test mission list

        it('should allow setting the missions db', function() {
            expect(mf.getDescription('Mission1')).to.equal("Mission 1");
        });

    });



    describe('Create new Mission Finder and test methods', function () {
        it('should return the mission description', function() {
            var mf = new MissionFinder();
            expect(mf.getDescription("Nonsense")).to.be.null;
            expect(mf.getDescription('SetPassword')).to.equal("You should protect your account with a password.");
        });


        /*
        var mf1 = new MissionFinder(user1);
        mf1.missions = test_missions; // use the list mission list below
        var mf2 = new MissionFinder(user2);
        mf2.missions = test_missions; // use the list mission list below

        it('should create a new mission factory for each user ', function (done) {
            mf1.user.name.should.equal(user1.name);
            mf2.user.name.should.equal(user2.name);
            done();
        });
        it('should not set mission to an invalid index', function (done) {
            mf1.setMission(-1);
            mf1.setMission(3);
            mf1.missionActive().should.be.false();
            done();
        });
        it('should leave mission alone if user is on a mission', function (done) {
            mf1.setMission(1);
            mf1.findNextMission().should.equal(1);
            mf1.setMission(-1);
            done();
        });
        it('should return no mission prompt when not on a mission', function (done) {
            should(mf1.getNextPrompt()).not.be.undefined();
            mf1.getNextPrompt().should.be.empty();
            done();
        });
        it('should return mission 0 for user 1', function (done) {
            mf1.findNextMission().should.equal(0);
            user1.mission_number.should.equal(0);
            user1.mission_prompt.should.equal(0);
            user1.mission.should.deepEqual(test_missions[0]);
            mf1.missionActive().should.be.true();
            done();
        });
        it('should return no mission for user 2', function (done) {
            mf2.findNextMission().should.equal(-1);
            mf2.getMissionDescription().should.equal("You are not in a mission.");
            done();
        });
        it('should return next mission when user 2 advances', function () {
            user2.level = 2;
            mf2.findNextMission().should.equal(1);
            user2.mission_number.should.equal(1);
        });
        it('should return prompts for user1', function (done) {
            mf1.getNextPrompt().should.equal("mission 0 prompt 0");
            mf1.getNextPrompt().should.equal("mission 0 prompt 1");
            mf1.getNextPrompt().should.be.empty();
            done();
        });
        it('should return completion message', function (done) {
            mf1.checkMissionStatus().should.be.empty();
            user1.password = 'asdf';
            mf1.checkMissionStatus().should.equal("mission 0 completion message");
            mf1.missionActive().should.be.false();
            done();
        });
        */
    });
});



