var express = require('express');
var router = express.Router();
var TagService = require('../services/tag-service.js');

router.get('/getTags', async (req, res) => {
  const tags = await TagService.getAllTags();
  res.send({ tags });
});

module.exports = router;