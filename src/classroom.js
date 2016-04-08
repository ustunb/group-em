// Depends on underscore/lodash.js

function Classroom() {
    var self = this;
    var studentList = {};
    
    // This retrieves a student by number
    function getStudentCount() {
        return studentList.length;
    }
    // Retrieves a student or null if the index is not valid
    function getStudent(index) {
        if (index < 0 || index > studentList.length - 1) {
            return null;
        }
        return studentList[index];
    }
    // Call this with an object like this:
    // self.setStudent({name: "Amy", avoid: ["Susan", "Pat"], prefer: []})
    function setStudent(index, obj) {
        studentList[index] = _.clone(obj);
        $(self).trigger({type: 'changestudents', first: index, last: index+1});
    }
    

    function addStudent(obj) {
        var index = studentList.length;
        studentList[index] = _.clone(obj);
        $(self).trigger({type: 'changestudents', first: index, last: index+1});
    }
    //Remove a given student from the list
    function removeStudent(index) {
        studentList.splice(index, 1);
        $(self).trigger({type: 'changestudents', first: index, last: studentList.length + 1});
    }
    
    function clearStudents() {
        studentList = [];
    }

    //Note this assumes names are distinct. 
    function findStudentNamed(name) {
        for (var i; i < studentList.length - 1; i++) {
            if (studentList[i]["name"] === name) {
                return i;
            }
            return null;
        }
    }

    //public methods
    self.getStudentCount = getStudentCount
    self.setStudent = setStudent
    self.getStudent = getStudent
    self.addStudent = addStudent
    self.removeStudent = removeStudent
    self.studentList = studentList
    self.clearStudents = clearStudents
    self.findStudentNamed = findStudentNamed
}

function assert(b) {
    if (!b) throw new Exception('failed assertion');
}

function testClassroom() {
    var c = new Classroom();
    var recording = [];
    $(c).on('changestudent', function(event) { recording.push(event); });
    c.addStudent({name: "Alice", avoid: ["Bob"], prefer: []});
    assert(recording.length === 0);
    console.log(JSON.stringify(recording[0]));
    c.addStudent({name: "Bob", avoid: [], prefer: []});
}