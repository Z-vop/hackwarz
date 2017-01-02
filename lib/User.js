/**
 * The User object holds all information about a user.
 */


var User = function(user_object) {
    this.name = null;
    this.password = null;
    this.color = '#4286f4';
    this.level = 0;
    this.coins = 0;

    if(user_object) {
        for(var i in user_object) {
            if(user_object[i]) { this[i] = user_object[i]; }
        }
    }

};

module.exports = User;