/**
 * The Mission object maintains state for a User-Mission instance.
 */


var Mission = function(obj) {

    this._id = 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    this.missionID = "Default";
    this.description = "Sample Mission Description";
    this.trigger = function() { return false; };
    this.test = function() { return false; };
    this.completion = function() { return "Completion message"; };
    this.next_prompt = 0;
    this.prompts = [];

    if(typeof obj == 'object') {
        for(var i in obj) {
            if(obj[i]) { this[i] = obj[i]; }
        }
    } else {
        throw new Error('Non-object type passed to Mission constructor.');
    }

    /** Returns the next prompt for this mission instance, or empty string */
    Mission.prototype.getNextPrompt = function () {
        if (this.next_prompt < this.prompts.length) {
            var prompt = this.prompts[this.next_prompt];
            this.next_prompt++;
            return prompt;
        }
        return "";
    };

};

module.exports = Mission;