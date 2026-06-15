const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id
    });

    res.status(201).json(job);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.id
    });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getJobs = async (req, res) => {
  try {

    const query = {};

    if (req.query.keyword) {
      query.title = {
        $regex: req.query.keyword,
        $options: "i"
      };
    }

    if (req.query.location) {
      query.location = {
        $regex: req.query.location,
        $options: "i"
      };
    }

    if (req.query.skill) {
      query.skills = {
        $in: [req.query.skill]
      };
    }

    const jobs = await Job.find(query);

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.json(job);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {

    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {

    const job = await Job.findOne({
      _id: req.params.id,
      postedBy: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      message: "Job Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob
};