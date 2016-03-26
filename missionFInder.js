/** The MissionFinder finds a Mission for a User */

var MissionFinder = function(user_object) {
    // TODO: MissionFactory returns a Mission, User object should have a Mission
    this.user = user_object;

    /** Is the user on a mission? */
    // TODO: This method more properly belongs to a User or Mission object
    MissionFinder.prototype.missionActive = function () {
        return (this.user.mission_number >= 0 && this.user.mission_number < this.missions.length);
    };

    /** If the user is not on a mission, returns the next valid mission */
    MissionFinder.prototype.findNextMission = function () {
        // Leave mission alone if user is already on a mission
        if (this.missionActive()) {
            return this.user.mission_number;
        }
        // Check all missions for trigger conditions
        for (var i = 0; i < this.missions.length; i++) {
            if (this.missions[i].trigger.call(this.user)) { // If we hit a trigger condition
                if (!this.missions[i].test.call(this.user)) { // The test hasn't already been satisfied
                    this.setMission(i);
                    return i;
                }
            }
        }
        return -1;
    };

    /** Immediately sets the current mission for the user
     *  @param {number} mission_number -- must be -1 or a valid mission index
     */
    // TODO: This method more properly belongs to a User object
    MissionFinder.prototype.setMission = function (mission_number) {
        if (mission_number >= -1 && mission_number < this.missions.length) {
            this.user.mission_number = mission_number;
            this.user.mission = mission_number == -1 ? null : this.missions[mission_number];
            this.user.mission_prompt = 0;
            console.log("User is now on mission: " + mission_number);
        }
    };

    /** Returns the next prompt for the users current mission */
    // TODO: This method more properly belongs to a Mission object
    // TODO: The next prompt state properly belongs to the Mission object
    MissionFinder.prototype.getNextPrompt = function () {
        if (this.missionActive()) {   // in a mission
            if (this.user.mission_prompt < this.user.mission.prompts.length) {
                var prompt = this.user.mission.prompts[this.user.mission_prompt];
                this.user.mission_prompt++;
                return prompt;
            }
        }
        return "";
    };

    /** Check to see if mission test is satisfied and return completion mission if so. */
    // TODO: This method more properly belongs to a User object which has a Mission object
    MissionFinder.prototype.checkMissionStatus = function () {
        if (this.missionActive()) {   // in a mission
            if (this.user.mission.test.call(this.user)) {
                console.log("test condition passed");
                var message = this.user.mission.completion.call(this.user);
                this.setMission(-1);
                return message;
            }
        }
        return "";
    };

    /** Return the description of the current mission */
    // TODO: This method belongs with a Mission object
    MissionFinder.prototype.getMissionDescription = function () {
        if (this.missionActive()) {   // in a mission
            return this.user.mission.description;
        } else {
            return "You are not in a mission.";
        }
    };
};

module.exports = function(user_object) {
    var instance = new MissionFinder(user_object);
    return instance;
};


/** All the missions for the game
 * @function trigger() must return boolean
 * @function test() must return boolean
 * @function completion must return a string
 */
MissionFinder.prototype.missions = [
    {   description: "You should protect your account with a password.",
        trigger: function() { return this.level == 1; },
        test: function() { return this.password != ''; },
        completion: function() { this.bitcoins += 5; this.level++;
            return "SYSTEM: Password set successfully. 5 bitcoins awarded."; },
        prompts: [
            "Jake: Hey, this is Jake. Welcome to the Network.",
            "Jake: You should set a password before you do anything else.",
            "",
            "Jake: Type /help in the chat window to see a list of commands."
        ]
    },
    {   description: "Explore the built in commands.",
        trigger: function() { return this.bitcoins > 5; },
        test: function() { return this.bitcoins > 7; },
        completion: function() {return "Jake: When you get your terminal interface, I have a job for you...";},
        prompts: [
            "Jake: If you forget what you are supposed to be doing, just type /mission in the chat window.",
            "Jake: Don't forget that you can also type /help to see a list of commands."
        ]
    },
    {   description: "Save up at least 20 bitcoins to buy a terminal interface.",
        trigger: function() { return this.bitcoins > 9; },
        test: function() { return this.bitcoins > 12; },
        completion: function() {return "Jake: Nice going! Now you have enough to buy a terminal.";},
        prompts: [
            "Jake: Hey, this is Jake again. Try to save 20 bitcoins so you can buy a terminal interface.",
            "Jake: You need a terminal interface to do any real hacking."
        ]
    },
    {   description: "Save up at least 10 bitcoins to buy a firewall.",
        trigger: function() { return this.bitcoins > 15; },
        test: function() { return this.bitcoins > 20; },
        completion: function() {return "Jake: Nice going! Now you have enough to buy a terminal.";},
        prompts: [
            "Jake: Hey, this is Jake. Try to save 10 bitcoins so you can buy a firewall.",
            "Jake: You need a firewall to protect against hackers."
        ]
    }
];
