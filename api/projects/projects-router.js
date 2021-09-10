const express = require("express");

const {
  logger,
  validateProjectId,
  validateProject,
} = require("./projects-middleware");

const Projects = require("./projects-model");

const router = express.Router();

router.get("/", logger, async (req, res, next) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch (error) {
    next();
  }
});

router.get("/:id", logger, validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.post("/", logger, validateProject, async (req, res, next) => {
  try {
    const newProject = await Projects.insert(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    next();
  }
});

router.put(
  "/:id",
  logger,
  validateProjectId,
  validateProject,
  async (req, res, next) => {
    const { completed } = req.body;
    try {
      if (typeof completed !== "undefined") {
        await Projects.update(req.params.id, req.body);
        res.status(200).json(req.body);
      } else {
        res.status(400).json({
          message: "Project needs a completed status",
        });
      }
    } catch (error) {
      next();
    }
  }
);

router.delete("/:id", logger, validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
    res.status(200).json({
      message: "Project successfully deleted.",
    });
  } catch (error) {
    next();
  }
});

router.get(
  "/:id/actions",
  logger,
  validateProjectId,
  async (req, res, next) => {
    try {
      const actions = await Projects.getProjectActions(req.params.id);
      res.status(200).json(actions);
    } catch (error) {
      next();
    }
  }
);

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    custom: "Something went wrong with the projects router",
    message: error.message,
    stack: error.stack,
  });
});

module.exports = router;
