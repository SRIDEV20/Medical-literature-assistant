const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },
    helpful: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
