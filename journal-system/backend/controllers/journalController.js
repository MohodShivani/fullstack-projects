const Journal = require("../models/Journal");
const analyzeEmotion = require("../services/llmService")
const { journalSchema, analyzeSchema } = require("../validators/journalValidator")

exports.createJournal = async (req, res) => {
  try {
    const result = journalSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.format()
      });
    }

    const { ambience, text } = req.body

    if (!text) {
      return res.status(400).json({
        message: "Text is required"
      });
    }

    const analysis = await analyzeEmotion(text);

    const journal = await Journal.create({
      userId: req.userId,
      ambience,
      text,
      emotion: analysis.emotion,
      keywords: analysis.keywords,
      summary: analysis.summary
    })

    res.status(201).json({
      message: "Journal created successfully",
      journal
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.getJournal = async (req, res) => {
  try {
    const journals = await Journal.find({
      userId: req.userId
    })

    res.json({
      journals
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

exports.analyzeJournal = async (req, res) => {
  try {
    const result = analyzeSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input"
      })
    }

    const { text } = result.data
    const analysis = await analyzeEmotion(text)
    res.json(analysis)
  } catch (err) {

    res.status(500).json({
      error: err.message
    })
  }
}



exports.getInsights = async (req, res) => {
  try {
    const userId = req.userId;

    const journals = await Journal.find({ userId });

    if (!journals.length) {
      return res.json({
        totalEntries: 0,
        topEmotion: null,
        mostUsedAmbience: null,
        recentKeywords: []
      });
    }

    // total entries
    const totalEntries = journals.length;

    // count emotions
    const emotionCount = {};
    const ambienceCount = {};
    let keywords = [];

    journals.forEach(journal => {
      if (journal.emotion) {
        emotionCount[journal.emotion] =
          (emotionCount[journal.emotion] || 0) + 1;
      }

      if (journal.ambience) {
        ambienceCount[journal.ambience] =
          (ambienceCount[journal.ambience] || 0) + 1;
      }

      if (journal.keywords) {
        keywords = keywords.concat(journal.keywords);
      }
    });

    const topEmotion = Object.keys(emotionCount).length
      ? Object.keys(emotionCount).reduce((a, b) => emotionCount[a] > emotionCount[b] ? a : b)
      : null;

    const mostUsedAmbience = Object.keys(ambienceCount).length
      ? Object.keys(ambienceCount).reduce((a, b) => ambienceCount[a] > ambienceCount[b] ? a : b)
      : null;

    // recent keywords (latest 3)
    const recentKeywords = [...new Set(keywords.reverse())].slice(0, 3);

    res.json({
      totalEntries,
      topEmotion,
      mostUsedAmbience,
      recentKeywords
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching insights",
      error: error.message
    });
  }
};