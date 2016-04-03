/**
 * The User object holds all information about a user, and may optionally have a Mission.
 */


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

    /** Checks to see if mission conditions have been met, returns message or empty string */
    User.prototype.checkMissionStatus = function () {
        if (this.mission) {
            if (this.mission.test.call(this)) {
                return this.mission.completion.call(this);
            }
        }
        return "";
    };

};

module.exports = User;