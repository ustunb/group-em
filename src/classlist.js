/* Depends on
 *
 * lodash.js
 * student.js
 *
 */

function Classlist(studentArray) {

    // Rep Invariants
    // size >= 0
    // students must be distinct
    var self = this;

    //private fields
    self.students = [];
    self.studentIDs = [];
    self.maxStudentID = 0;
    self.size = 0;
    self.value = "0"; //store value in cache

    // checks to see if student is in list of students
    function has(studentID) {
        return self.studentIDs.indexOf(studentID) > -1
    }

    //returns unique identifier for this group (group = [1,2,5] <=> group_ID = "10011")
    function valueOf() {
        return _.reduce(self.students, function(bin, s) {
            return bin + Math.pow(2, s.id() - 1);
        }, 0).toString(2);
    }

    // adds a new student to this group
    // returns true if student is successfully added to list of students
    function add(student) {
        var update_flag = false;
        var studentID = student.id();
        if (!self.has(studentID)) {
            self.students.push(student);
            self.studentIDs.push(studentID);
            self.value += Math.pow(2, studentID);
            self.size++;
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
            self.value -= Math.pow(2, studentID);
            self.size--;
            for (i = 0; i < self.size; i++) {
                console.log('before removal')
                console.log(self.students[i].toString())
                self.students[i].removeFromPreferences('all', studentID);
                console.log('after removal')
                console.log(self.students[i].toString())
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

    function getNextStudentID() {
        if (self.size === 0) {
            return 1;
        } else {
            return _.max(self.studentIDs) + 1;
        }
    }

    //returns list of groups in current grouping
    function toString() {
        var classString = _.map(self.students, function(v) {
            return v.toString();
        }).join("\n");
        return classString;
    }

    //returns true iff this self has the same students as thatGroup    
    function equals(that) {
        return self.value === that.valueOf()
    }

    //check representation invariants
    function checkRep() {
        if (self.size < 0) throw new Error('size of group must be non-negative');
    }

    //attach public methods to object
    self.has = has;
    self.add = add;
    self.remove = remove;
    self.equals = equals;
    self.getStudentFromID = getStudentFromID;
    self.getNextStudentID = getNextStudentID;
    self.toString = toString;
    self.valueOf = valueOf();

    self.getSize = function() {
        return self.size;
    }

    self.getStudents = function() {
        return _.clone(self.students);
    }

    self.getStudentIDs = function() {
        return _.clone(self.studentIDs);
    }

    self.getStudentNames = function() {
        return map(self.students, function (s){s.name()});
    }


    //initialization
    if (studentArray != null) {
        for (var i = 0; i < studentArray.length; i++) {
            if (!self.add(studentArray[i])) {
                throw new Error('student array should contain distinct students');
            }
        }
        checkRep();
    }

    //parses a classroom object from JSON
    self.fromJSON = function(jsonClasslist) {
        var obj = JSON.parse(jsonClasslist);
        self.students = [];

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
        })
        self.maxStudentID = _.max(self.studentIDs);
        self.size = self.students.length;
        self.value = valueOf();
        return true
    }

    self.toJSON = function() {
        var jsonClasslist = {};
        var jsonClasslist = {};
        jsonClasslist['students'] = [];
        for (var i = 0; i < self.size; i++) {
            jsonClasslist['students'].push(self.students[i].toJSON());
        }
        return JSON.stringify(jsonClasslist);
    }

}
