/* Depends on
*
* group.js
* classroom.js
*
*/
function Grouping(classroom) {
	
	var self = this;
	self.student_pool = []
	self.random_groups = []
	self.pinned_groups = [] 	//#explicitly enforced groups
	self.banned_groups = [] 	//#explicitly banned groups
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

	//get number of groups in the current grouping
	function size(){
		return self.random_groups.length + self.pinned_groups.length + self.student_pool.length;
	}
	
    //returns true iff this grouping has the same groups as that grouping
    function equals(thatGrouping) {
    	//TODO
    }
    
	//returns list of groups in current grouping
	function toString() {
		//TODO
	}
	
	//check representation invariants
	function checkRep() {
		//TODO
		return true;
	}

	//returns group_id of group with a given student
	function groupOf(student_id){
		//TODO
	}

	//add group to current grouping
	function addGroup(group_id){
	}

	//remove group from current grouping
	function removeGroup(group_id){
		//TODO
	}

	//switch student from one old group to new group
	function switchGroups(student_id, old_group_id, new_group_id){
		//TODO
	}

	//randomly create new groups of students
	function shuffle(){
		//TODO
	}

	//pins a group
	function pinGroup(group_id){
		var pin_flag = false;
		//TODO
		return pin_flag;
	}
	
	//unpins a group
	function unpinGroup(group_id){
		var unpin_flag = false;
		//TODO
		return unpin_flag;
	}

	//adds group to the list of banned groups
	function banGroup(group_id){
		var ban_flag = false;
		//TODO
		return ban_flag;
	}

	//remove group from the list of banned groups
	function unbanGroup(group_id){
		var unban_flag = false;
		//TODO
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
	
}
