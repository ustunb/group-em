/* Depends on
 *
 * lodash.js
 * student.js
 *
 */

function Group(studentArray) {

    // Rep Invariants
    // size >= 0
    // students must be distinct
    var self = this;

    //private fields
    self.students = [];
    self.studentIDs = [];
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
        if (self.has(studentID)) {
            idx = self.studentIDs.indexOf(studentID);
            student = self.students.splice(idx, 1)[0];
            self.studentIDs.splice(idx, 1);
            self.value -= Math.pow(2, studentID);
            self.size--;
            checkRep();
            return student;
        }
    }

    function getGroupID() {
        return _.min(self.studentIDs)
    }


    //returns list of groups in current grouping
    function toString() {
        var groupString = 'gid: ' + getGroupID() + '\n' +
            _.map(self.students, function(v) {
                return v.toString();
            }).join("\n");

        return groupString;
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
    self.equals = equals
    self.getGroupID = getGroupID
    self.toString = toString

    self.valueOf = function() {
        return self.value;
    }

    self.getSize = function() {
        return self.size;
    }

    self.getStudents = function() {
        return _.clone(self.students);
    }

    self.getStudentIDs = function() {
        return _.clone(self.studentIDs);
    }

    //parses a classroom object from JSON
    self.fromJSON = function(jsonGroup) {
        var obj = JSON.parse(jsonGroup);
        self.students = [];
        console.log(jsonGroup)
        console.log(obj)

        //get IDs of all students in JSON object
        var allIDs = [];
        for (var i = 0; i < obj.students.length; i++) {
            var studentObj = JSON.parse(obj.students[i]);
            allIDs.push(studentObj.id);
        }

        //create student objects
        for (var i = 0; i < obj.students.length; i++) {
            var studentObj = JSON.parse(obj.students[i]);
            for (key in studentObj.preferences) { //make sure that preferences do not include missing students
                studentObj.preferences[key] = _.intersection(allIDs, studentObj.preferences[key]);
            }
            self.students.push(new Student(studentObj.name, studentObj.id, studentObj.preferences));
        }

        self.studentIDs = self.students.map(function(s) {return s.id();});
        self.size = self.students.length;
        self.value = self.valueOf();
        console.log('initialized from JSON', self.toString());
        return true
    }

    self.toJSON = function() {
        var jsonGroup = {};
        jsonGroup['students'] = [];
        for (var i = 0; i < self.size; i++) {
            jsonGroup['students'].push(self.students[i].toJSON());
        }
        return JSON.stringify(jsonGroup);
    }

    //initialization
    if (studentArray != null){
        for (var i = 0; i < studentArray.length; i++) {
            if (!self.add(studentArray[i])) {
                throw new Error('student array should contain distinct students');
            }
        }    
        checkRep();
    }
}
