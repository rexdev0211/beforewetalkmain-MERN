const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth");
const { validateStepInput } = require("../../validation/steps");
const Step = require("../../models/Step");
const mongoose = require("mongoose");

/**
 * Get steps by flow id
 */
router.get("/getByFlowId/:flowId", authMiddleware, async (req, res) => {
  const steps = await Step.find({ flow: mongoose.Types.ObjectId(req.params.flowId) }).populate('user');

  return res.json({ steps });
});

/**
 * Get a step by id
 */
router.get("/getByStepId/:stepId", authMiddleware, async (req, res) => {
  const step = await Step.findById(req.params.stepId);
  if (step) {
    return res.json({ step });
  }
  else {
    return res.status(404).json({ message: 'Step not found' });
  }
});

router.get("/usedLinks/:stepType", authMiddleware, async (req, res) => {
  const step = await Step.find({ stepType: req.params.stepType, user: req.user._id });
  if (step) {
    return res.json({ step });
  }
  else {
    return res.status(404).json({ message: 'Step not found' });
  }
});

/**
 * Create a new step
 */
router.post("/create", authMiddleware, async (req, res) => {
  // Step input validation
  req.body.forEach((item, index) => {
    const { errors, isValid } = validateStepInput(item);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  })

  const resultArray = Promise.all(req.body.map(async (step, index) => {
    const user = req.user;
    const result = await Step.create({
      user: user._id,
      flow: mongoose.Types.ObjectId(step.flow),
      stepNumber: step.stepNumber,
      stepType: step.stepType,
      content: step.content,
      description: step.description ? step.description : ''
    });
    return result
  }))


  resultArray.then((resA) => {
    return res.json({ resA });
  });
})


/**
 * Update a step
 */
router.put("/update/:stepId", authMiddleware, async (req, res) => {
  // Step input validation
  const { errors, isValid } = validateStepInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const step = await Step.findById(req.params.stepId);
  if (step) {
    const updatedStep = await Step.findByIdAndUpdate(
      req.params.stepId,
      {
        flow: mongoose.Types.ObjectId(req.body.flow),
        stepNumber: req.body.stepNumber,
        stepType: req.body.stepType,
        content: req.body.content,
        description: req.body.description ? req.body.description : ''
      },
      { new: true }
    );
    return res.json({ step: updatedStep });
  }
  else {
    return res.status(404).json({ message: 'Step not found' });
  }
});

module.exports = router;
