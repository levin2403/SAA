const getClassSessionService = require('../services/getClassSession.service');

exports.getClassSession = async(req, res) => {
    try {
      const { class_id, professor_id, date } = req.query;
      console.log(class_id, professor_id, date);
      const classSession =  await getClassSessionService.
            getClassSession(class_id, professor_id, date);
      res.status(200).json(classSession);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }