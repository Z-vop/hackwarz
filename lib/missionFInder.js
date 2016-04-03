/** The MissionFinder finds a Mission for a User, it uses the Singleton pattern */

var missions = require("./missions.js");
var Mission = require('./Mission');


var MissionFinder = (function() {

    // instance stores a reference to the Singleton
    var instance;

    function init() {
        // Private methods and variables
        var missionsDB = missions;

        return {
            // Public methods and variables

            /** Set the missions database (usually for testing) */
            setMissionsDB: function (missions_list) {
                if (missions_list instanceof Array) {
                    missionsDB = missions_list;
                    return;
                }
                console.log("ERROR: Non-Array object passed to setMissionsDB");
            },

            /** Return a Mission object given a missionID */
            getMission: function(missionID) {
                for (var i = 0; i < missionsDB.length; i++) {
                    if (missionsDB[i].missionID == missionID) {
                        return new Mission(missionsDB[i]);
                    }
                }
                return null;
            },

            /** Return the description of a mission given the missionID */
            getDescription: function (missionID) {
                for (var i = 0; i < missionsDB.length; i++) {
                    if (missionsDB[i].missionID == missionID) {
                        return missionsDB[i].description;
                    }
                }
                return null;
            },

            /** Returns the first valid Mission object for the given User */
            findNextMission: function(user) {
                // Check all missions for trigger conditions
                for (var i = 0; i < missionsDB.length; i++) {
                    if (missionsDB[i].trigger.call(user)) { // If we hit a trigger condition
                        if (!missionsDB[i].test.call(user)) { // The test hasn't already been satisfied
                            return new Mission(missionsDB[i]);
                        }
                    }
                }
                return null;
            }

        }
    }

    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }
    };
})();

module.exports = MissionFinder;









