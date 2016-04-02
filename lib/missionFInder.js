/** The MissionFinder finds a Mission for a User */

var missions = require("./missions.js");

var MissionFinder = function() {

    var missionsDB = missions;

    /** Is the user on a mission? */
    // TODO: This method more properly belongs to a User or Mission object
    //MissionFinder.prototype.missionActive = function () {
    //    return (this.user.mission_number >= 0 && this.user.mission_number < this.missions.length);
    //};

    /** If the user is not on a mission, returns the next valid mission */
    //MissionFinder.prototype.findNextMission = function () {
    //    // Leave mission alone if user is already on a mission
    //    if (this.missionActive()) {
    //        return this.user.mission_number;
    //    }
    //    // Check all missions for trigger conditions
    //    for (var i = 0; i < this.missions.length; i++) {
    //        if (this.missions[i].trigger.call(this.user)) { // If we hit a trigger condition
    //            if (!this.missions[i].test.call(this.user)) { // The test hasn't already been satisfied
    //                this.setMission(i);
    //                return i;
    //            }
    //        }
    //    }
    //    return -1;
    //};


    /** Returns the next prompt for the users current mission */
    // TODO: This method more properly belongs to a Mission object
    // TODO: The next prompt state properly belongs to the Mission object
    //MissionFinder.prototype.getNextPrompt = function () {
    //    if (this.missionActive()) {   // in a mission
    //        if (this.user.mission_prompt < this.user.mission.prompts.length) {
    //            var prompt = this.user.mission.prompts[this.user.mission_prompt];
    //            this.user.mission_prompt++;
    //            return prompt;
    //        }
    //    }
    //    return "";
    //};

    /** Check to see if mission test is satisfied and return completion mission if so. */
    // TODO: This method more properly belongs to a User object which has a Mission object
    //MissionFinder.prototype.checkMissionStatus = function () {
    //    if (this.missionActive()) {   // in a mission
    //        if (this.user.mission.test.call(this.user)) {
    //            console.log("test condition passed");
    //            var message = this.user.mission.completion.call(this.user);
    //            this.setMission(-1);
    //            return message;
    //        }
    //    }
    //    return "";
    //};


    /** Set the missions database (usually for testing) */
    MissionFinder.prototype.setMissionsDB = function(missions_list) {
        if( missions_list instanceof Array ) {
            missionsDB = missions_list;
            return;
        }
        console.log("ERROR: Non-Array object passed to setMissionsDB");
    };


    /** Return the description of the current mission */
    MissionFinder.prototype.getDescription = function (missionID) {
        for (var i = 0; i < missionsDB.length; i++) {
            if(missionsDB[i].missionID == missionID) {
                return missionsDB[i].description;
            }
        }
        return null;
    };
};

module.exports = function() {
    var instance = new MissionFinder();
    return instance;
};



