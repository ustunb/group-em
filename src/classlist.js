/* Depends on
 *
 * lodash.js
 * student.js
 *
 */

function Classlist(studentArray) {

    var self = this;
    self.name=[];
    self.students = [];
    self.studentIDs = [];

    // checks to see if student is in list of students
    function has(studentID) {
        return self.studentIDs.indexOf(studentID) > -1
    }

    // adds a new student to this list
    // returns true if student is successfully added to list of students
    function add(student) {
        var update_flag = false;
        var studentID = student.id();
        if (!self.has(studentID)) {
            self.students.push(student);
            self.studentIDs.push(studentID);
            update_flag = true;
            checkRep();
        }
        return update_flag;
    }

    // removes a student from this group 
    function remove(studentID) {
        var update_flag = true;
        if (self.has(studentID)) {
            idx = self.studentIDs.indexOf(studentID);
            student = self.students.splice(idx, 1)[0];
            self.studentIDs.splice(idx, 1);
            for (i = 0; i < self.size; i++) {
                self.students[i].removeFromPreferences('all', studentID);
            }
            update_flag = true;
            checkRep();
        }
        return update_flag;
    }

    // returns a copy of a student from this group
    function getStudentFromID(studentID) {
        if (self.has(studentID)) {
            idx = self.studentIDs.indexOf(studentID);
            checkRep();
            return self.students[idx];
        }
    }

    //returns a unique student ID for a new student
    function getNextStudentID() {
        if (self.students.length > 0 ) {
            return _.max(self.studentIDs) + 1;
        } else {
            return 1;
        }
    }


    function getSize() {
        return self.students.length;
    }

    function getStudents() {
        return _.clone(self.students);
    }

    function getStudentIDs() {
        return _.clone(self.studentIDs);
    }

    function getStudentNames(){
        return self.students.map(function (s){return s.name()});
    }

    //returns list of groups in current grouping
    function toString() {
        var classString = _.map(self.students, function(v) {
            return v.toString();
        }).join("\n");
        return classString;
    }

    //returns unique identifier for this group (group = [1,2,5] <=> group_ID = "10011")
    function valueOf() {
        return _.reduce(self.students, function(bin, s) {
            return bin + Math.pow(2, s.id() - 1);
        }, 0).toString(2);
    }

    //returns true iff this self has the same students as thatGroup    
    function equals(that) {
        return valueOf() === that.valueOf()
    }

    //check representation invariants
    function checkRep() {
        return true;
    }

    //attach public methods to object
    self.has = has;
    self.add = add;
    self.remove = remove;
    self.equals = equals;
    self.getStudentFromID = getStudentFromID;
    self.getNextStudentID = getNextStudentID;
    self.toString = toString;
    self.valueOf = valueOf;
    self.getSize = getSize;
    self.getStudents = getStudents;
    self.getStudentNames = getStudentNames;
    self.getStudentIDs = getStudentIDs;

    //initialization
    if (studentArray != null) {
        for (var i = 0; i < studentArray.length; i++) {
            if (!self.add(studentArray[i])) {
                throw new Error('need to initialize classlist using an array of Students with unique IDs');
            }
        }
        checkRep();
    }

    //parses a classroom object from JSON
    self.fromJSON = function(jsonClasslist) {
        var obj = JSON.parse(jsonClasslist);
        self.students = [];

        if (obj && obj.students) {
            
            //get IDs of all students in JSON object
            var allIDs = []
            for (var i = 0; i < obj.students.length; i++) {
                var studentObj = JSON.parse(obj.students[i]);
                allIDs.push(studentObj.id);
            }
    
            //create student objects
            for (var i = 0; i < obj.students.length; i++) {
                var studentObj = JSON.parse(obj.students[i]);
                for (key in studentObj.preferences){//make sure that preferences do not include missing students
                    studentObj.preferences[key] = _.intersection(allIDs, studentObj.preferences[key]);
                }
                self.students.push(new Student(studentObj.name, studentObj.id, studentObj.preferences));
            }
            
            self.studentIDs = self.students.map(function(student) {
                return student.id();
            });

        }
        return true
    }

    self.toJSON = function() {
        var jsonClasslist = {
            students: [],
        };

        for (var i = 0; i < self.students.length; i++) {
            jsonClasslist['students'].push(self.students[i].toJSON());
        }

        return JSON.stringify(jsonClasslist);
    }

}
