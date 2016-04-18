/* Depends on
 *
 * lodash.js
 * student.js
 * group.js
 * classroom.js
 *
 */

/* create a new Grouping

var grouping = new Grouping(classroom, students_per_group);

*/

/* get node/edge information for D3

var grouping = new Grouping(classroom, students_per_group);
var groupArray = grouping.getGroups(); 

for (var j = 0; j < groupArray.length; j++) {
    var group = groupArray[j];
    var studentArray = group.getStudents();
    for (var k = 0; k < studentArray.length; k++) {
        //set node information here
    }
}

*/

/* remove a student from a group, then add them to another group
 * given student_id and group_id (:= lowest student id of all students in group)

grouping.assignStudentToGroup(student_id, group_id);

*to drop them in the middle of nowhere (use)

grouping.assignStudentToGroup(student_id);
grouping.assignStudentToGroup(student_id, null);

*/

/* pin/unpin a group

TODO

*/

/* ban/unban a group

TODO

*/
function Grouping(classroom, students_per_group) {

    var self = this;
    //randomly generated groups
    students_per_group = students_per_group; //number of students per pool
    random_groups = [];
    pinned_groups = []; //explicitly enforced groups
    //banned_groups = []; //explicitly banned groups

    //get number of groups in the current grouping
    function getNumberOfGroups() {
        return random_groups.length + pinned_groups.length
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

    //get the index ID of student in 
    function locateGroup(group_id) {

        for (var i = 0; i < random_groups.length; i++) {
            if (random_groups[i].has(group_id)) {
                return {
                    state: 'random',
                    index: i,
                };
            }
        }

        for (var i = 0; i < pinned_groups.length; i++) {
            if (pinned_groups[i].has(group_id)) {
                return {
                    state: 'pinned',
                    index: i,
                };
            }
        }

        return {
            state: 'none',
            index: -1,
        };
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
        if (!_.isInteger(students_per_group)) throw new Error('students per group must be integer')
        if (students_per_group < 1.0) throw new Error('at least 1 student per group is needed');
        if (students_per_group > getNumberOfStudents()) throw new Error('students per group (=' + students_per_group + ') + is larger than total students (=' + getNumberOfStudents() + ')');
        return true;
    }

    //returns a String representation fo object for debugging
    function toString() {
        var groupString = []
        groupString.push('-'.repeat(60));
        groupString.push('Randomly Generated Groups');
        groupString.push('-'.repeat(60));
        for (var i = 0; i < random_groups.length; i++) {
            var groupID = random_groups[i].getGroupID()
            groupString.push('Group ' + groupID + '\n' + random_groups[i].toString() + '\n');

        }
        groupString.push('-'.repeat(60));
        groupString.push('Pinned Groups');
        groupString.push('-'.repeat(60));
        for (var i = 0; i < pinned_groups.length; i++) {
            var groupID =
                groupString.push('Group ' + getGroupID() + '\n' + pinned_groups[i].toString());
        }
        return groupString.join('\n');
    }

    function getStudents() {
        var studentArray = getGroups().map(function(group) {
            return group.getStudents()
        });
        return _.flatten(studentArray)
    }

    // adds a student group to the list of pinned groups
    function pinGroup(group_id) {
        var pin_flag = false;
        var location = locateGroup(group_id);
        if (location.state === 'random' && location.index > 0) {
            pinned_groups.push(random_groups.splice(location.index)[0]);
            pin_flag = true;
            checkRep();
        }
        return pin_flag;
    }

    //removes a group from the list of pinned groups
    function unpinGroup(group_id) {
        var unpin_flag = false;
        var idx = locateGroup(group_id);
        if (location.state === 'pinned' && location.index > 0) {
            random_groups.push(pinned_groups.splice(location.index)[0]);
            unpin_flag = true;
            checkRep();
        }
        return unpin_flag;
    }

    //switch student from one group to another group
    function assignStudentToGroup(student_id, group_id) {
        var old_group_location = locateGroup(getGroupIDOf(student_id));
        if (old_group_location.state === 'random') {
            old_idx = old_group_location.index;
            var student = random_groups[old_idx].remove(student_id)
            if (group_id == null) {
                //add student to new group
                random_groups.push(new Group([student]));
            } else {
                //add student to existing group;
                var new_group_location = locateGroup(group_id);
                console.log(group_id);
                console.log(student.toString())
                console.log(student)
                random_groups[new_group_location.index].add(student);
            }

            //delete group from random groups;
            if (random_groups[old_idx].getSize() == 0) {
                random_groups.splice(old_idx, 1);
            }
        }
        checkRep();
    }

    //randomly create new groups of students from student_pool
    function shuffle() {
        var studentArray = random_groups.map(function(group) {
            return group.getStudents()
        });
        studentArray = _.flatten(studentArray);
        studentArray = _.shuffle(studentArray);
        studentArray = _.chunk(studentArray, students_per_group);
        random_groups = studentArray.map(function(students) {
            return new Group(students);
        })
        console.log(toString())
        checkRep();
        return _.concat(random_groups, pinned_groups);
    }

    function setStudentsPerGroup(new_students_per_group) {
        students_per_group = new_students_per_group;
        checkRep();
        return true;
    }

    //public methods
    self.getNumberOfGroups = getNumberOfGroups;
    self.getNumberOfStudents = getNumberOfStudents;
    self.getGroups = getGroups;
    self.getStudents = getStudents;
    self.getPinnedGroups = getPinnedGroups;
    self.getRandomGroups = getRandomGroups;
    self.setStudentsPerGroup = setStudentsPerGroup;
    self.toString = toString;
    self.getGroupIDOf = getGroupIDOf;
    self.shuffle = shuffle;
    self.assignStudentToGroup = assignStudentToGroup;
    self.pinGroup = pinGroup
    self.unpinGroup = unpinGroup
        // self.banGroup = banGroup
        //self.unbanGroup = unbanGroup

    //initialize
    console.log(new Group(classroom.getStudents()))
    random_groups.push(new Group(classroom.getStudents()));
    self.shuffle();
    checkRep();
}


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
