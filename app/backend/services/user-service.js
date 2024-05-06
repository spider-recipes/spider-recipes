const UserRepo = require('../repositories/user-repository');

async function getAllUsernames() {
  var usernames = await UserRepo.getAllUsernames();
  return usernames;
}

async function getProfileInfo(userId) {
  var profileInfo = await UserRepo.getProfileInfo(userId);
  return profileInfo;
}

module.exports = { getAllUsernames, getProfileInfo };
