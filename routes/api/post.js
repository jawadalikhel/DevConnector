const express = require('express');
const router = express.Router();

// @route GET api/posts/test
// @desv Tests post route
// @access Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'Post is working'
    })
})

module.exports = router;