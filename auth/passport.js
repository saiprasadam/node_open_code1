const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByName) {
    const authenticateUser = async (username, password, done) => {
        console.log("Authenticating: " + username);
        getUserByName(username);
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) => { });
    passport.deserializeUser((id, done) => { });
}

module.exports = initialize;