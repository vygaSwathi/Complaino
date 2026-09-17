const { z } = require("zod");

const Issue = require("../models/Issue");


/* ========================================
   VALIDATION SCHEMA FOR CREATING AN ISSUE
======================================== */

const createIssueSchema = z.object({
  title: z.string().trim().min(5).max(150),

  description: z.string().trim().min(10).max(2000),

  category: z.enum([
    "academics",
    "infrastructure",
    "hostel",
    "transport",
    "technology",
    "cleanliness",
    "other",
  ]),
});


/* ========================================
   GENERATE UNIQUE REQUEST CODE
======================================== */

const generateRequestCode = () => {
  const timestamp =
    Date.now().toString(36).toUpperCase();

  const random =
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  return `CC-${timestamp}-${random}`;
};


/* ========================================
   CREATE A NEW ISSUE
   STUDENT ONLY
======================================== */

const createIssue = async (req, res) => {
  try {
    const result =
      createIssueSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue details",
      });
    }

    const {
      title,
      description,
      category,
    } = result.data;

    const issue = await Issue.create({
      requestCode: generateRequestCode(),

      studentId: req.user.id,

      title,

      description,

      category,

      status: "pending_review",

      response: "",
    });

    return res.status(201).json({
      success: true,

      message:
        "Issue submitted successfully",

      issue: {
        requestCode:
          issue.requestCode,

        title:
          issue.title,

        description:
          issue.description,

        category:
          issue.category,

        status:
          issue.status,

        response:
          issue.response,

        createdAt:
          issue.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "Create issue error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* ========================================
   GET ISSUES BELONGING TO LOGGED-IN STUDENT
======================================== */

const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      studentId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "requestCode title description response category status createdAt updatedAt"
      );

    return res.status(200).json({
      success: true,
      issues,
    });

  } catch (error) {
    console.error(
      "Get my issues error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* ========================================
   GET ALL ISSUES
   ADMIN + COUNCIL
======================================== */

const getAllIssues = async (req, res) => {
  try {

    /* ------------------------------------
       ADMIN
       Admin can see student identity
    ------------------------------------ */

    if (req.user.role === "admin") {

      const issues = await Issue.find()
        .sort({ createdAt: -1 })
        .select(
          "requestCode studentId title description response category status createdAt updatedAt"
        )
        .populate(
          "studentId",
          "name email"
        );

      return res.status(200).json({
        success: true,
        issues,
      });
    }


    /* ------------------------------------
       COUNCIL
       Council must NOT receive identity
    ------------------------------------ */

    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .select(
        "requestCode title description response category status createdAt updatedAt"
      );

    return res.status(200).json({
      success: true,
      issues,
    });

  } catch (error) {
    console.error(
      "Get all issues error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* ========================================
   UPDATE ISSUE STATUS + RESPONSE
   COUNCIL / ADMIN ONLY
======================================== */

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;


    /* ------------------------------------
       VALIDATE UPDATE DATA
    ------------------------------------ */

    const updateIssueSchema = z.object({
      status: z.enum([
        "pending_review",
        "open",
        "in_progress",
        "resolved",
        "rejected",
      ]),

      response: z
        .string()
        .trim()
        .max(2000)
        .optional(),
    });


    const result =
      updateIssueSchema.safeParse(req.body);


    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid issue update details",
      });
    }


    /* ------------------------------------
       FIND ISSUE
    ------------------------------------ */

    const issue =
      await Issue.findById(id);


    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }


    /* ------------------------------------
       UPDATE STATUS
    ------------------------------------ */

    issue.status =
      result.data.status;


    /* ------------------------------------
       UPDATE RESPONSE
    ------------------------------------ */

    if (
      result.data.response !==
      undefined
    ) {
      issue.response =
        result.data.response;
    }


    await issue.save();


    /* ------------------------------------
       RETURN UPDATED ISSUE
    ------------------------------------ */

    return res.status(200).json({
      success: true,

      message:
        "Issue updated successfully",

      issue: {
        requestCode:
          issue.requestCode,

        status:
          issue.status,

        response:
          issue.response,

        updatedAt:
          issue.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "Update issue error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


/* ========================================
   EXPORTS
======================================== */

module.exports = {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssueStatus,
};