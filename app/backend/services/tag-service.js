const TagRepo = require('../repositories/tag-repository');

async function getAllTags() {
  var tags = await TagRepo.getAllTags();
  return tags;
}

module.exports = { getAllTags };
