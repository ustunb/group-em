/* Depends on
 *
 * lodash.js
 * student.js
 */

function Grouping(studentList, students_per_group) {

    var self = this;
    self.student_pool = [] //#pool of students in the classroom
    self.random_groups = [] //#randomly generated groups
    self.pinned_groups = [] //#explicitly enforced groups
    self.banned_groups = [] //#explicitly banned groups
    self.students_per_group = students_per_group
        //
        // Rep Invariants 
        //
        // every student has a unique student_id
        // every group has a unique group_id
        // every student is in exactly one group
        // every group contains at least 1 student
        // all groups = random_groups + pinned_groups
        // all students = students in random_groups + students in pinned_groups
        // random_groups and pinned_groups cannot contain any groups from banned_groups
        // either random_groups.length = 0 or student_pool.length = 0
        // only students in student_pool are 'shuffled' to form random_groups
        // 
        // 1 <= students_per_group <= classroom.getNumberOfStudents

    //get number of groups in the current grouping
    function getNumberOfGroups() {
        return self.random_groups.length + self.pinned_groups.length
    }

    //get the number of students in the current grouping
    function getNumberOfStudents() {
        return self.student_pool.length +
            _.reduce(self.random_groups, function(s, g) {
                return s + g.size();
            }, 0) +
            _.reduce(self.pinned_groups, function(s, g) {
                return s + g.size();
            }, 0)
    }

    //returns true iff this grouping has the same student pool, random groups, pinned groups, banned groups (regardless of ordering)
    function equals(thatGrouping) {
        return arraysEqual(self.student_pool, thatGrouping.student_pool) &&
            arraysEqual(self.random_groups, thatGrouping.random_groups) &&
            arraysEqual(self.pinned_groups, thatGrouping.pinned_groups) &&
            arraysEqual(self.banned_groups, thatGrouping.banned_groups)
    }

    //returns list of groups in current grouping
    function toString() {
        //TODO
    }

    //returns group that contains a given student
    function groupOf(student_id) {
        //TODO
    }

    //check representation invariants
    function checkRep() {
        if (!_.isInteger(self.students_per_group)) throw new Exception('students per group must be integer')
        if (self.students_per_group < 1.0) throw new Exception('at least 1 student per group is needed');
        if (self.students_per_group > self.getNumberOfStudents()) throw new Exception('students per group larger than total students');
        return true;
    }

    //add a new group to random_groups using students in the student_pool
    function addGroup(student_ids) {
        //TODO
        checkRep();
    }

    //remove group from random_groups and add students back to the student_pool
    function removeGroup(group) {
        //TODO
        checkRep();
    }

    //switch student from one group to another group
    function switchGroups(student_id, old_group_id, new_group_id) {
        if (old_group.hasStudent(student_id)) {
            old_group.removeStudent(student_id)
            new_group.addStudent(student_id)
        }
        checkRep();
    }

    //randomly create new groups of students from student_pool
    function shuffle() {
        //TODO
        //shuffle
        //_.shuffle(self.random_groups)
        //_.chunk(array, [size=1])
        checkRep();
        //student_pool should now be empty
    }

    //adds a student group to the list of pinned groups
    function pinGroup(group) {
        var pin_flag = false;
        //TODO
        checkRep();
        return pin_flag;
    }

    //removes a group from the list of pinned groups
    function unpinGroup(group) {
        var unpin_flag = false;
        //TODO
        checkRep();
        return unpin_flag;
    }

    //adds group to the list of banned groups
    function banGroup(group) {
        var ban_flag = false;
        //TODO
        checkRep();
        return ban_flag;
    }

    //remove group from the list of banned groups
    function unbanGroup(group) {
        var unban_flag = false;
        //TODO
        checkRep();
        return unban_flag;
    }


    //attach functions to object
    self.size = size
    self.equals = equals
    self.toString = toString

    self.groupOf = groupOf
    self.addGroup = addGroup
    self.removeGroup = removeGroup
    self.switchGroups = switchGroups
    self.shuffle = shuffle
    self.pinGroup = pinGroup
    self.unpinGroup = unpinGroup
    self.banGroup = forbidGroup
    self.unbanGroup = unforbidGroup

} * /
