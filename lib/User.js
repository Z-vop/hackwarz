/**
 * The User object holds all information about a user, and may optionally have a Mission.
 */

var MissionFinder = require('./MissionFinder');
var mf = new MissionFinder();


var User = function(user_object) {
    this.info = {
        name: null,
        password: null,
        level: 0,
        coins: 0.0,
    };
    this.mission = null;

    if(user_object) {
        this.info = user_object;
    };

    /** Immediately sets the current mission for the user
     *  @param {String} MissionID -- must be a valid mission name or null
     */

    User.prototype.setMission = function (missionID) {
        if(isNull(missionID)) {
            this.mission = null;
            return;
        }
        if(typeof missionID === 'string' || missionID instanceof String) {
            if(mf.getDescription(missionID)) {
                this.mission = missionID;
                console.log("User is now on mission: " + missionID);
                return;
            }
            this.mission = null;
            return;
        }
        throw new Error("Non-string parameter passed to setMission function.");
    };
};

module.exports = User;