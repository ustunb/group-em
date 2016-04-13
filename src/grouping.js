/* Depends on
 *
 * lodash.js
 * student.js
 * group.js
 *
 */

//creating a new Grouping
var grouping = new Grouping(classroom, students_per_group);

//getting node / edge information for D3
var groupArray = grouping.getGroups();
for (var j = 0; j < groupArray.length; j++) {
    var group = groupArray[j];
    var studentArray = group.getStudents();
    for (var k = 0; k < studentArray.length; k++) {
        //set node information here
    }
}

// remove a student from a group, then add them to another group
// given student_id and group_id (group_id = lowest student id of all students in that group)
grouping.addStudentToGroup(student_id, group_id);


//remove student from a group, then drop them in the middle of nowhere
//given student_id
grouping.addStudentToGroup(student_id);


//pinning a group (i.e. making sure it is kept for the shuffle)
//TODO

//unpinning a group (i.e., freeing it to change in the next shuffle)
//TODO

//banning a group (i.e., freeing it to change in the next shuffle)
//TODO

//unbanning a group (i.e., freeing it to change in the next shuffle)
//TODO


function Grouping(classroom, students_per_group) {

    var self = this;
    random_groups = _.chunk(classroom.getStudentList(), students_per_group); //randomly generated groups
    students_per_group = students_per_group; //number of students per pool
    pinned_groups = []; //explicitly enforced groups
    //banned_groups = []; //explicitly banned groups

    //get number of groups in the current grouping
    function getNumberOfGroups() {
        return self.random_groups.length + self.pinned_groups.length
    }

    //get the number of students in the current grouping
    function getNumberOfStudents() {
        return _.reduce(random_groups, function(s, g) {
            return s + g.getSize();
        }, 0) + _.reduce(pinned_groups, function(s, g) {
            return s + g.getSize();
        }, 0)
    }

    //get the group ID of student in 
    function getGroupIDOf(student_id) {
        for (var i = 0; i < random_groups.length; i++) {
            if (random_groups[i].has(student_id)) {
                return random_groups[i].getGroupID();
            }
        }
        for (var i = 0; i < pinned_groups.length; i++) {
            if (pinned_groups[i].has(student_id)) {
                return pinned_groups[i].getGroupID();
            }
        }
    }

    //get the index  ID of student in 
    function getGroupIndex(group_id) {
        for (var i = 0; i < random_groups.length; i++) {
            if (random_groups[i].has(group_id)) {
                return i;
            }
        }
        return -1;
    }

    //get a copy of the groups
    function getGroups() {
        checkRep();
        return _.concat(random_groups, pinned_groups);
    }

    //get a copy of the pinned groups
    function getPinnedGroups() {
        checkRep();
        return _.clone(pinned_groups);
    }

    //get a copy of the random groups
    function getRandomGroups() {
        checkRep();
        return _.clone(random_groups);
    }

    //checks representation invariants
    function checkRep() {
        if (!_.isInteger(students_per_group)) throw new Exception('students per group must be integer')
        if (students_per_group < 1.0) throw new Exception('at least 1 student per group is needed');
        if (students_per_group > self.getNumberOfStudents()) throw new Exception('students per group larger than total students');
        return true;
    }

    //switch student from one group to another group
    function addStudentToGroup(student_id, group_id) {
        var old_group_id = getGroupIDOf(student_id);
        var old_idx = getGroupIndex(old_group_id);
        var student = random_groups[old_idx].remove(student_id)

        //add student to new group
        if (group_id == null) {
            var new_idx = getGroupIndex(group_id);
            random_groups.push(new Group(student));
        } else {
            var new_idx = getGroupIndex(group_id);
            random_groups[new_idx].add(student);
        }

        //delete group from random groups;
        if (random_groups[old_idx].getSize() == 0) {
            random_groups.splice(old_idx, 1);
        }
        checkRep();
    }

    //randomly create new groups of students from student_pool
    function shuffle() {
        //populate student pool
        //_.flatten(random_groups.map(function(group){return group.getStudents()}));
        var studentArray = []
        for (var i = 0; i < random_groups.length; i++) {
            studentArray.push(random_groups[i].getStudents());
        }
        random_groups = _.shuffle(studentArray).map(function(students) {
            return new Group(students);
        })
        return _.concat(random_groups, pinned_groups);
    }

    //attach functions to object
    self.shuffle = shuffle;
    self.addStudentToGroup = addStudentToGroupOf;
    self.getGroups = getGroups;
    self.getPinnedGroups = getPinnedGroups;
    self.getRandomGroups = getRandomGroups;
    self.getGroupIndex = getGroupIndex;
    self.getNumberOfGroups = getNumberOfGroups;
    self.getNumberOfStudents = getNumberOfStudents;
    //self.pinGroup = pinGroup
    //self.unpinGroup = unpinGroup
    //self.banGroup = banGroup
    //self.unbanGroup = unbanGroup

    self.shuffle();
}


// //adds a student group to the list of pinned groups
// function pinGroup(group) {
//     var pin_flag = false;
//     //TODO
//     checkRep();
//     return pin_flag;
// }

// //removes a group from the list of pinned groups
// function unpinGroup(group) {
//     var unpin_flag = false;
//     //TODO
//     checkRep();
//     return unpin_flag;
// }

// //adds group to the list of banned groups
// function banGroup(group) {
//     var ban_flag = false;
//     //TODO
//     checkRep();
//     return ban_flag;
// }

// //remove group from the list of banned groups
// function unbanGroup(group) {
//     var unban_flag = false;
//     //TODO
//     checkRep();
//     return unban_flag;
// }

// //returns list of groups in current grouping
// function toString() {
//     //TODO
// }
