/* 

// DEPENDS ON 

lodash.js
student.js
group.js
classroom.js

// HOW TO USE THIS CLASS 

//create a new Grouping

var grouping = new Grouping(classroom);

//get node/edge information for D3

var students_per_group = 2
var grouping = new Grouping(classroom);
grouping.shuffle(students_per_group);
var groupArray = grouping.getGroups(); 

for (var j = 0; j < groupArray.length; j++) {
    var group = groupArray[j];
    var studentArray = group.getStudents();
    for (var k = 0; k < studentArray.length; k++) {
        //set node information here
    }
}

// remove a student from a group, then add them to another group
// given student_id and group_id (:= lowest student id of all students in group)

grouping.assignStudentToGroup(student_id, group_id);

// to drop students in the middle of nowhere:

grouping.assignStudentToGroup(student_id);
grouping.assignStudentToGroup(student_id, null);

// pin/unpin a group

update_flag = grouping.pinGroup(group_id) //returns true if pinning succeeds; false if pinning failed
update_flag = grouping.unpinGroup(group_id) //returns true if unpinning succeeds; false if unpinning failed

//saving to JSON String

var jsonGrouping = grouping.toJSON()

//loading from JSON String

var grouping = new Grouping() //initialize empty grouping
grouping.fromJSON(jsonGrouping) 

*/
function Grouping(classroom) {

    var self = this;
    self.random_groups = []; //randomly generated groups
    self.pinned_groups = []; //explicitly enforced groups

    //get number of groups in the current grouping
    function getNumberOfGroups() {
        return self.random_groups.length + self.pinned_groups.length
    }

    //get the number of students in the current grouping
    function getNumberOfStudents() {
        return _.reduce(self.random_groups, function(s, g) {
            return s + g.getSize();
        }, 0) + _.reduce(self.pinned_groups, function(s, g) {
            return s + g.getSize();
        }, 0)
    }

    //get the group ID of student in 
    function getGroupIDOf(student_id) {
        for (var i = 0; i < self.random_groups.length; i++) {
            if (self.random_groups[i].has(student_id)) {
                return self.random_groups[i].getGroupID();
            }
        }
        for (var i = 0; i < self.pinned_groups.length; i++) {
            if (self.pinned_groups[i].has(student_id)) {
                return pinned_groups[i].getGroupID();
            }
        }
    }

    //get the index ID of student in 
    function locateGroup(group_id) {

        for (var i = 0; i < self.random_groups.length; i++) {
            if (self.random_groups[i].has(group_id)) {
                return {
                    state: 'random',
                    index: i,
                };
            }
        }

        for (var i = 0; i < self.pinned_groups.length; i++) {
            if (self.pinned_groups[i].has(group_id)) {
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

    function isPinnedGroup(group_id){
         for (var i = 0; i < self.pinned_groups.length; i++){
            if (self.pinned_groups[i].has(group_id)) {
                return true;
            }
         }
         return false;
    }

    //get a copy of the groups
    function getGroups() {
        checkRep();
        return _.concat(self.random_groups, self.pinned_groups);
    }

    //get a copy of the pinned groups
    function getPinnedGroups() {
        checkRep();
        return _.clone(self.pinned_groups);
    }

    //get a copy of the random groups
    function getRandomGroups() {
        checkRep();
        return _.clone(self.random_groups);
    }

    //checks representation invariants
    function checkRep() {
        return true;
    }

    //returns a String representation fo object for debugging
    function toString() {
        var groupString = [];
        groupString.push('-'.repeat(60));
        groupString.push('Randomly Generated Groups');
        groupString.push('-'.repeat(60));
        for (var i = 0; i < self.random_groups.length; i++) {
            var groupID = self.random_groups[i].getGroupID()
            groupString.push('Group ' + groupID + '\n' + self.random_groups[i].toString() + '\n');
        }
        groupString.push('-'.repeat(60));
        groupString.push('Pinned Groups');
        groupString.push('-'.repeat(60));
        for (var i = 0; i < self.pinned_groups.length; i++) {
            var groupID =
                groupString.push('Group ' + getGroupID() + '\n' + self.pinned_groups[i].toString());
        }
        return groupString.join('\n');
    }

    //return a list of all students
    function getStudents() {
        var studentArray = getGroups().map(function(group) {
            return group.getStudents();
        });
        return _.flatten(studentArray)
    }

    // adds a student group to the list of pinned groups
    function pinGroup(group_id) {
        var update_flag = false;
        var location = locateGroup(group_id);
        if (location.state === 'random' && location.index > 0) {
            self.pinned_groups.push(random_groups.splice(location.index)[0]);
            update_flag = true;
            checkRep();
        }
        return update_flag;
    }

    //removes a group from the list of pinned groups
    function unpinGroup(group_id) {
        var update_flag = false;
        var idx = locateGroup(group_id);
        if (location.state === 'pinned' && location.index > 0) {
            self.random_groups.push(pinned_groups.splice(location.index)[0]);
            update_flag = true;
            checkRep();
        }
        return update_flag;
    }

    //switch student from one group to another group
    function assignStudentToGroup(student_id, group_id) {
        // console.log('assigning student', 'student_id', student_id, 'group_id', group_id);
        var old_group_location = locateGroup(getGroupIDOf(student_id));
        // console.log('old_group_location', old_group_location);
        if (old_group_location.state === 'random') {
            old_idx = old_group_location.index;
            var student = self.random_groups[old_idx].remove(student_id);
            if (group_id == null) {
                //add student to new group
                // console.log('adding student to new group', self.random_groups)
                self.random_groups.push(new Group([student]));
                console.log(self.random_groups)
            } else {
                //add student to existing group;
                var new_group_location = locateGroup(group_id);
                // console.log(student.toString())
                self.random_groups[new_group_location.index].add(student);
            }

            //delete group from random groups;
            if (self.random_groups[old_idx].getSize() == 0) {
                self.random_groups.splice(old_idx, 1);
            }
        }
        checkRep();
    }

    //randomly create new groups of students from student_pool
    function shuffle(students_per_group) {
        console.log(self.random_groups)
        var studentArray = self.random_groups.map(function(group) {
            return group.getStudents()
        });
        studentArray = _.flatten(studentArray);
        var groupedStudentArray = assignStudentsWithPreferences(studentArray, students_per_group);
        self.random_groups = groupedStudentArray.map(function(students) {
            return new Group(students);
        })
        console.log(toString())
        checkRep();
        return _.concat(self.random_groups, self.pinned_groups);
    }

    function toJSON() {
        var jsonGrouping = {};
        jsonGrouping['random_groups'] = [];
        for (var i = 0; i < self.random_groups.length; i++) {
            jsonGrouping['random_groups'].push(self.random_groups[i].toJSON());
        }
        jsonGrouping['pinned_groups'] = [];
        for (var i = 0; i < self.pinned_groups.length; i++) {
            jsonGrouping['pinned_groups'].push(self.pinned_groups[i].toJSON());
        }
        return JSON.stringify(jsonGrouping);
    }

    function fromJSON(jsonGrouping) {
        var obj = JSON.parse(jsonGrouping);
        self.random_groups = [];
        for (var i = 0; i < obj.random_groups.length; i++) {
            var group = new Group();
            group.fromJSON(obj.random_groups[i]);
            self.random_groups.push(group);
        }
        self.pinned_groups = [];
        for (var i = 0; i < obj.pinned_groups.length; i++) {
            var group = new Group();
            group.fromJSON(obj.pinned_groups[i]);
            self.pinned_groups.push(group);
        }
        return true;
    }

    //public methods
    self.getNumberOfGroups = getNumberOfGroups;
    self.getNumberOfStudents = getNumberOfStudents;
    self.getGroups = getGroups;
    self.getStudents = getStudents;
    self.getPinnedGroups = getPinnedGroups;
    self.getRandomGroups = getRandomGroups;
    self.toString = toString;
    self.getGroupIDOf = getGroupIDOf;
    self.shuffle = shuffle;
    self.assignStudentToGroup = assignStudentToGroup;
    self.pinGroup = pinGroup;
    self.unpinGroup = unpinGroup;
    self.isPinnedGroup = isPinnedGroup;
    self.toJSON = toJSON;
    self.fromJSON = fromJSON;

    //initialization
    if (classroom != null) {
        self.random_groups.push(new Group(classroom.getStudents()));
        checkRep();
    }

}
