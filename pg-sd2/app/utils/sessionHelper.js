/**
 * Set user data into the session after successful login or registration.
 *
 * @param {Object} req - The Express request object
 * @param {Object} user - The user object retrieved from the database
 */
function setUserSession(req, user) {
    req.session.user = {
      id: user.user_id,
      username: user.username,
      email: user.email
    };
  }
  
  module.exports = { setUserSession };
  