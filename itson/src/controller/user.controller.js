const authService = require('../service/auth.service');
const userRepository = require('../repository/user.repository');

exports.validateUserCredentials = async (req, res) => {
    try {
        const { user_id, password } = req.body;
        const user = await authService.validateUserCredentials(user_id, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getStudentClassesById = async (req, res) => {
    try {
        const { student_id } = req.query;
        const student = await userRepository.getStudentClassesById(student_id);
        // Verificamos si el usuario existe y tiene clases
        const classes = (student && student.classes) ? student.classes : [];
        res.status(200).json(classes);
    } catch (error) {
        console.error("Error getting student classes:", error);
        res.status(500).json({ message: error.message });
    }
}

exports.getProfessorClassesById = async (req, res) => {
    try {
        const { professor_id } = req.query;
        console.log("Buscando clases para profesor:", professor_id);

        const professor = await userRepository.getProfessorClassesById(professor_id);
        // Verificamos si el usuario existe y tiene clases
        const classes = (professor && professor.classes) ? professor.classes : [];
        
        res.status(200).json(classes);
    } catch (error) {
        console.error("Error getting professor classes:", error);
        // Enviamos el mensaje exacto del error para verlo en el frontend
        res.status(500).json({ message: error.message, stack: error.stack });
    }
}