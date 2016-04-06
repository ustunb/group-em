/* Depends on
*
* lodash.js
*
*/

function Group() {
	
	var self = this;
	self.members = [];

	//returns number of students in the self
	function size() {
		return self.members.length;
	}

	//returns defensive copy of member list
	function members() {
		return _.clone(self.members);
	}

	//returns true iff this self has the all of the student as thatGroup
	function contains(thatGroup) {
		var contains_flag = true
		if (self.size() < thatGroup.size()){
			contains_flag = false 
		} else {
			for (var i = 0; i < thatGroup.size()- 1; i++) {
				if (!self.hasStudent(thatGroup.members[i])){
					contains_flag = false;
					break;
				}
			}
		}
		return contains_flag;
	}

	//returns true iff this self has the same students as thatGroup    
	function equals(thatGroup) {
		return self.contains(thatGroup) && thatGroup.contains(self);
	}

    //returns list of groups in current grouping
    function toString() {
		//TODO
	}
	
	//check representation invariants
	function checkRep() {
		if (!self.size() < 0) throw new Exception('failed assertion');
	}

	// checks to see if student is in list of self members
	// returns true if student exists in list of self members
	function hasStudent(student_id) {
		var found_student = false
		for (var i = 0; i < self.size() - 1; i++) {
			if (self.members[i] === student_id){
				found_student = true;
				break;
			}
		}
		return found_student;
	}

	// adds a student from group members
	// returns true if student is successfully added to list of self members
	function addStudent(student_id) {
		var update_flag = false;
		if (!self.hasStudent(student_id)){
			self.members.push(student_id);
			update_flag = true;
		}
		checkRep()
		return update_flag;
	}

    // removes a student from group members
    // returns true if student is successfully removed from list of self members
    function removeStudent(student_id) {
    	var update_flag = false;
    	for (var i = self.size() - 1; i >= 0; i--) {
    		if (self.members[i] === student_id) {
    			self.splice(i, 1);
    			update_flag = true;
    		}
    	}
    	checkRep()
    	return update_flag;
    }

    // adds a list of students from group members
	// returns number of students added
	function addStudents(student_id_list) {
		var n_added = 0;
		for (var i = 0; i < self.size() - 1; i++){
			if (self.addStudent(student_id_list[i])) {
				n_added++;
			}
		}
		checkRep()
		return n_added;
	}

	// removes a list of students from group members
	// returns number of students removed
	function removeStudents(student_id_list) {
		var n_removed = 0;
		for (var i = 0; i < self.size() - 1; i++){
			if (self.removeStudent(student_id_list[i])) {
				n_removed++;
			}
		}
		checkRep()
		return n_removed;
	}

	//self.checkRep = checkRep

	//attach public methods to object
	self.getMembers = getMembers
	self.hasStudent = hasStudent
	self.addStudent = addStudent
	self.removeStudent = removeStudent
	self.addStudents = addStudents
	self.removeStudents = removeStudents

	self.size = size
	self.equals = equals
	self.contains = contains
	self.toString = toString

}