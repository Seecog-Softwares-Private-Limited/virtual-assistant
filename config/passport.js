const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { findByEmail, findById, create } = require('../repositories/users');
const { findUserByIdentity, linkIdentity } = require('../repositories/userIdentities');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

function emailFallback(provider, providerUserId) {
  // In case provider doesn't return email (common in Facebook if not granted)
  return `${provider}_${providerUserId}@noemail.local`;
}


// -------------------- GOOGLE --------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const provider = 'google';
        const providerUserId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName || 'User';

        // 1) If identity already linked -> login
        let user = await findUserByIdentity(provider, providerUserId);
        if (user) return done(null, user);

        // 2) If email matches existing user -> link identity
        if (email) user = await findByEmail(email);

        // 3) If not exists -> create new user (SSO user, password null)
        if (!user) {
          user = await create({
            name,
            email: email || emailFallback(provider, providerUserId),
            phone: null,
            password: null
          });
        }

        // 4) Link identity
        await linkIdentity({ userId: user.id, provider, providerUserId, email });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// -------------------- FACEBOOK --------------------
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.APP_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails'] // emails may not come always
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const provider = 'facebook';
        const providerUserId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName || 'User';

        let user = await findUserByIdentity(provider, providerUserId);
        if (user) return done(null, user);

        if (email) user = await findByEmail(email);

        if (!user) {
          user = await create({
            name,
            email: email || emailFallback(provider, providerUserId),
            phone: null,
            password: null
          });
        }

        await linkIdentity({ userId: user.id, provider, providerUserId, email });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
