/* Depends on
*
* group.js
* classroom.js
*
*/
function Grouping(classroom) {
	
	var self = this;
	self.pool = []
	self.groups = []
	self.pinned_groups = [] 	//#explicitly enforced groups
	self.banned_groups = [] 	//#explicitly banned groups
	self.preferred_groups = [] 	//#weakly enforced groups
	self.avoided_groups = [] 	//#weakly banned groups
	// Rep Invariants 
	//
	// every student is in exactly one group
	// every group contains at least 1 student
	// all groups = groups + pinned groups
	// all students = students in groups + students in pinned_groups
	// every student is unique
	// every group is unique
	// only students in student_pool are 'shuffled' to form groups randomly
	// either groups is empty or student_pool is empty

	
	//get size of group
	function size(){
		return self.groups.length;
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
