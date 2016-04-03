/**
 * The Mission object maintains state for a User-Mission instance.
 */


var Mission = function(obj) {

    this.missionID = "Default";
    this.description = "Sample Mission Description";
    this.trigger = function() { return false; };
    this.test = function() { return false; };
    this.completion = function() { return "Completion message"; };
    this.prompts = [];

    if(obj) {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    }

    var next_prompt = 0;

    /** Returns the next prompt for this mission instance, or empty string */
    Mission.prototype.getNextPrompt = function () {

        if (next_prompt < this.prompts.length) {
            var prompt = this.prompts[next_prompt];
            next_prompt++;
            return prompt;
        }
        return "";
    };

    /** Checks to see if mission conditions have been met, returns message or empty string */
    Mission.prototype.checkStatus = function(user) {
        if(this.test.call(user)) {
            return this.completion()
        }
        return "";
    };
};

module.exports = Mission;