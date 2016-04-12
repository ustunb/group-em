/* Depends on
 *
 * lodash.js
 * student.js
 * 
 */
//http://stackoverflow.com/questions/36558813/how-to-create-a-set-of-user-defined-objects-in-javascript-with-a-user-defined-eq?noredirect=1#comment60719822_36558813


/**
 * [mutable class to represent a unique unordered collection of one or more students]
 * @param {[Array<Student>]} students [array composed of distinct students]
 */
function Group(studentList) {

    // Rep Invariants
    // size >= 0
    // students must be distinct
    var self = this;

    //private fields
    var students = [];
    var size = 0;     
    var value = "0";//store value in cache

    // checks to see if student is in list of students
    function has(student_id) {
        return _.map(students, function(v) {return v.id();}).indexOf(student_id) > -1
    }

    //returns unique identifier for this group (group = [1,2,5] <=> group_ID = "10011")
    function valueOf() {
        console.log('called valueOf')
        return _.reduce(students, function(bin, s) {return bin + Math.pow(2, s.id() - 1);}, 0).toString(2);
    }

    // adds a new student to this group
    // returns true if student is successfully added to list of students
    function add(student) {
        var update_flag = false;
        var student_id = student.valueOf();
        if (!self.has(student_id)) {
            students.push(student);
            console.log(students)
            size++;
            value = valueOf();
            update_flag = true;
            checkRep();
        }
        return update_flag;
    }

    // gets a student from this group 
    // returns null if student does not exist in this group
    function get(student_id) {
        if (self.has(student_id)) {
            student = students.get(student_id);
            size--;
            value = valueOf();
            checkRep();
            return student;
        }
    }

    //returns list of groups in current grouping
    function toString() {
        return _.map(students, function(v) {return v.toString();}).join("\n");
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
    self.students = students
    self.has = has
    self.add = add
    self.get = get
    self.equals = equals
    self.toString = toString
    self.valueOf = function() {
        return value;
    }
    self.size = function() {
        return size;
    }

    //initialization
    for (var i = 0; i < studentList.length; i++) {
        if (!self.add(studentList[i])) {
            throw new Error('student list should be distinct');
        }
    }
    checkRep();
}
