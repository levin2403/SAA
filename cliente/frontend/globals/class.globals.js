
export const API_URL = 'http://localhost:4000/api';

class ClassGlobals {

    static instance = null;

    classes = [];
    selectedClass = {}; 

    static getInstance() {
        if (!ClassGlobals.instance) {
            ClassGlobals.instance = new ClassGlobals();
        }
        return ClassGlobals.instance;
    }
    
    constructor() {}

    setClasses(classes) {
        this.classes = classes;
    }

    getClasses() {
        return this.classes;
    }

    setSelectedClass(selectedClass) {
        this.selectedClass = selectedClass;
    }

    getSelectedClass() {
        return this.selectedClass;
    }
}

export default ClassGlobals;
