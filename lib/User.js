/**
 * The User object holds all information about a user, and may optionally have a Mission.
 */

var MissionFinder = require('./MissionFinder');
var mf = MissionFinder.getInstance();


var User = function(user_object) {
    this.name = null;
    this.password = null;
    this.level = 0;
    this.coins = 0;
    this.mission = null;

    if(user_object) {
        for(var i in user_object) {
            if(user_object[i]) { this[i] = user_object[i]; }
        }
    }

    /** Immediately sets the current mission for the user
     *  @param {String} MissionID -- must be a valid mission name or null
     */

    User.prototype.setMission = function (missionID) {

        if(typeof missionID === 'string' || missionID instanceof String) {
            if(mf.getDescription(missionID)) {
                this.mission = missionID;
                return;
            }
            this.mission = null;
            return;
        } else if(missionID === null) {
            this.mission = null;
            return;
        }
        throw new Error("Non-string parameter passed to setMission function.");
    };

};

module.exports = User;