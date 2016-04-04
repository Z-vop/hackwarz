/** All the missions for the game
 * @function trigger() must return boolean
 * @function test() must return boolean
 * @function completion must return a string
 */

const missions = [
    {   missionID: "SetPassword",
        description: "You should protect your account with a password.",
        trigger: function() { return this.level == 1; },
        test: function() { return Boolean(this.password); },
        completion: function() { this.coins += 5; this.level++;
            return "SYSTEM: Password set successfully. 5 bitcoins awarded."; },
        prompts: [
            "Jake: Hey, this is Jake. Welcome to the Network.",
            "Jake: You should set a password before you do anything else.",
            "",
            "Jake: Type /help in the chat window to see a list of commands."
        ]
    },
    {   missionID: "UseHelp",
        description: "Explore the built in commands.",
        trigger: function() { return this.coins > 6; },
        test: function() { return this.coins > 8; },
        completion: function() {return "Jake: When you get your terminal interface, I have a job for you...";},
        prompts: [
            "Jake: If you forget what you are supposed to be doing, just type /mission in the chat window.",
            "","", // These just delay the next prompt
            "Jake: Don't forget that you can also type /help to see a list of commands."
        ]
    },
    {   missionID: "SaveCoins",
        description: "Save up at least 20 bitcoins to buy a terminal interface.",
        trigger: function() { return this.coins > 15; },
        test: function() { return this.coins > 20; },
        completion: function() {return "Jake: Nice going! Now you have enough to buy a terminal.";},
        prompts: [
            "Jake: Hey, this is Jake again. Try to save 20 bitcoins so you can buy a terminal interface.",
            "Jake: You need a terminal interface to do any real hacking."
        ]
    }
];

module.exports = missions;