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
    var students = [];
    var studentIDs = [];
    var size = 0;
    var value = "0"; //store value in cache

    // checks to see if student is in list of students
    function has(studentID) {
        return studentIDs.indexOf(studentID) > -1
    }

    //returns unique identifier for this group (group = [1,2,5] <=> group_ID = "10011")
    function valueOf() {
        return _.reduce(students, function(bin, s) {
            return bin + Math.pow(2, s.id() - 1);
        }, 0).toString(2);
    }

    // adds a new student to this group
    // returns true if student is successfully added to list of students
    function add(student) {
        var update_flag = false;
        var studentID = student.id();
        if (!self.has(studentID)) {
            students.push(student);
            studentIDs.push(studentID);
            value += Math.pow(2, studentID);
            size++;
            update_flag = true;
            checkRep();
        }
        return update_flag;
    }

    // removes a student from this group 
    function remove(studentID) {
        if (self.has(studentID)) {
            idx = student_ids.indexOf(studentID);
            student = students.splice(idx, 1);
            studentIDs.splice(idx, 1);
            value -= Math.pow(2, studentID);
            size--;
            checkRep();
            return student;
        }
    }

    //returns list of groups in current grouping
    function toString() {
        return _.map(students, function(v) {
            return v.toString();
        }).join("\n");
    }

    //returns true iff this self has the same students as thatGroup    
    function equals(that) {
        return value === that.valueOf()
    }

    //check representation invariants
    function checkRep() {
        if (size < 0) throw new Error('size of group must be non-negative');
    }

    //attach public methods to object
    self.has = has;
    self.add = add;
    self.remove = remove;
    self.equals = equals
    self.toString = toString
    self.valueOf = function() {
        return value;
    }

    self.getSize = function() {
        return size;
    }

    self.getStudents = function() {
        return _.clone(students);
    }

    self.getGroupID = function() {
        return Math.min(studentIDs);
    }

    self.getStudentIDs = function() {
        return _.clone(studentIDs);
    }

    //initialization
    for (var i = 0; i < studentArray.length; i++) {
        if (!self.add(studentArray[i])) {
            throw new Error('student array should contain distinct students');
        }
    }
    checkRep();
}
