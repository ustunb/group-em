// Depends on underscore/lodash.js

function Classroom() {
    var classroom = this;
    
    // This retrieves a student by number
    this.getStudentCount = function() {
        return studentList.length;
    }
    // Retrieves a student or null if the index is not valid
    this.getStudent = function(index) {
        if (index < 0 || index > studentList.length - 1) {
            return null;
        }
        return studentList[index];
    }
    // Call this with an object like this:
    // classroom.setStudent({name: "Amy", avoid: ["Susan", "Pat"], prefer: []})
    this.setStudent = function(index, obj) {
        studentList[index] = _.clone(obj);
        $(classroom).trigger({type: 'changestudents', first: index, last: index+1});
    }
    this.addStudent = function(obj) {
        var index = studentList.length;
        studentList[index] = _.clone(obj);
        $(classroom).trigger({type: 'changestudents', first: index, last: index+1});
    }
    //Remove a given student from the list
    this.removeStudent = function(index) {
        studentList.splice(index, 1);
        $(classroom).trigger({type: 'changestudents', first: index, last: studentList.length + 1});
    }
    
    this.clearStudents = function() {
        studentList = [];
    }
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

    

