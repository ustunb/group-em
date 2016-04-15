/* Depends on
 *
 * lodash.js
 * student.js
 * 
 */

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

    //returns 1 if update is made, returns 0 if student was already in preferences (and so no change)
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
            $(self).trigger({type: 'changestudents'});
            return 0;
        }
        return 1;
    }

    //returns 1 if update is made, returns 0 if student was not in preferences (and so no change)
    function removePreference(studentToUpdate, studentToRemove, preference) {
        for (var  i = 0; i < classroom.getStudentCount(); i++) {
            if (classroom.getStudent(i).name == studentToUpdate) {
                for (var j = 0; j < classroom.getStudent(i)[preference].length; j++) {
                    if (classroom.getStudent(i)[preference][j] == studentToRemove) {
                        classroom.getStudent(i)[preference].splice(j, 1);
                        $(classroom).trigger({type:'changestudents'});
                        return 1;
                    }
                }
            }
        }
        return 0;
    }

/**
        var studentToUpdate = getStudentFromName(studentToUpdate);
        already_in = 0;
        var newpreferences = [];
        console.log(studentToUpdate);
        console.log(studentToRemove);
        for (var i = 0; i < studentToUpdate[preference].length; i++) {
            if (studentToUpdate[preference][i] != studentToRemove) {
                newpreferences.push(studentToUpdate[preference][i]);
            }
            else {
                already_in = 1;
            }

        }
        studentToUpdate[preference] = newpreferences;
        $(self).trigger({type: 'changestudents'});
        return already_in;

    }**/

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
        $(self).trigger({type: 'changestudents'});
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
        $(self).trigger({type: 'changestudents'});
    }

    //Remove a given student from the list
    function removeStudent(sid) {
        for (var index = 0; index < studentList.length; index++){
            if ((studentList[index].sid) == sid) {
                studentList.splice(index, 1);
                $(self).trigger({type: 'changestudents'});
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
        return _.clone(studentList);
    }

    function getStudentListForGrouping() {
        newStudentList = []
        for (var i = 0; i < studentList.length; i++) {
            newStudentList.push(new Student(studentList[i].name, studentList[i].sid))
        }
        return newStudentList;
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
    self.getStudentList = getStudentList
    self.getStudentListForGrouping = getStudentListForGrouping
    self.removePreference = removePreference
    self.getStudentFromSID = getStudentFromSID
}

function assert(b) {
    if (!b) throw new Exception('failed assertion');
}
/**
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

}**/
