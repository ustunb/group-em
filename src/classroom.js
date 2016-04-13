// Depends on underscore/lodash.js

//if you have a name and want the full student object, call classroom.getStudentFromName(name)
//if you have an sid and want the full student object, call classroom.getStudentFromSID(name)
//once you have a student object you can access student_object.name/prefer/avoid/sid as well

function Classroom() {
    var self = this;
    var studentList = [];
    var lastid = 0;
    
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

    function getStudentFromName(studentname) {
        for (var i = 0; i < studentList.length; i++) {
            if (studentList[i].name == studentname) {
                return studentList[i];
            }
        }
        return null;
    }

    function updatePreference(studentToUpdate, studentToAdd, preference) {
        var studentToUpdate = getStudentFromName(studentToUpdate);
        already_in = 0;
        for (var i = 0; i < studentToUpdate[preference].length; i++) {
            if (studentToUpdate[preference][i] == studentToAdd) {
                already_in = 1;
            }
        }
        if (already_in == 0 && studentToAdd != studentToUpdate.name) {
            studentToUpdate[preference].push(studentToAdd);
            return 0;
        }
        return 1;
    }


    function getStudentFromSID(sid) {
        for (var i = 0; i < studentList.length; i++) {
            if (studentList[i].sid == sid) {
                return studentList[i];
            }
        }
        return null;
    }
    // Call this with an object like this:
    // self.setStudent({name: "Amy", avoid: ["Susan", "Pat"], prefer: []})
    function setStudent(index, obj) {
        studentList[index] = _.clone(obj);
        $(self).trigger({type: 'changestudents', first: index, last: index+1});
    }

    function getID(studentname) {
        var s = getStudentFromName(studentname);
        return s.sid;
    }


    

    function addStudent(obj) {
        var index = studentList.length;
        studentList[index] = _.clone(obj);
        studentList[index]['sid'] = lastid;
        lastid++;
        $(self).trigger({type: 'changestudents', first: index, last: index+1});
    }
    //Remove a given student from the list
    function removeStudent(sid) {
        for (var index = 0; index < studentList.length; index++){
            if ((studentList[index].sid) == sid) {
                studentList.splice(index, 1);
                $(self).trigger({type: 'changestudents', first: index, last: studentList.length + 1});
            }
        }

    }
    
    function clearStudents() {
        studentList = [];
    }

    //Note this assumes names are distinct. 
    function findStudentNamed(name) {
        for (var i = 0; i < studentList.length; i++) {
            console.log(studentList[i]["name"]);
            if (studentList[i]["name"] == name) {
                return i;
            }
        }
        return null;
    }

    function getStudentList() {
        return _.clone(self.studentList);
    }

    //for testing Grouping
    function setStudentList(studentList) {
        this.studentList = _.clone(studentList);
    }

    //public methods
    self.getStudentCount = getStudentCount
    self.setStudent = setStudent
    self.getStudent = getStudent
    self.getStudentList = getStudentList
    self.addStudent = addStudent
    self.removeStudent = removeStudent
    self.studentList = studentList
    self.clearStudents = clearStudents
    self.findStudentNamed = findStudentNamed
    self.updatePreference = updatePreference
    self.getStudentFromName = getStudentFromName
    self.getStudentFromSID = getStudentFromSID
    self.setStudentList = setStudentList
    self.getStudentList = getStudentList
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
    console.log('Student 0 is currently', c.getStudent(0).name);
    c.removeStudent(0);
    console.log('Student 0 is now', c.getStudent(0).name);

}
