const express = require('express');
const router = express.Router();

const answerController = require('../controllers/answerController');

const { createAnswer, getAssessmentAnswer } = answerController;

router.get('/assessment/:assessmentId/user/:userId', getAssessmentAnswer);
router.post('/', createAnswer);

module.exports = router;
