const Poll = require('../Models/Poll');

exports.createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        const newPoll = new Poll({ question, options, createdBy: req.user.id });
        await newPoll.save();
        res.status(201).json(newPoll);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.votePoll = async (req, res) => {
    try {
        const { pollId, optionIndex } = req.body;
        const poll = await Poll.findById(pollId);
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        poll.options[optionIndex].votes += 1;
        await poll.save();
        res.json(poll);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
