function Grouping() {
	var grouping = this;
	
	//grouping.classroom 
	grouping.groups = []
	//grouping.pinned_groups = [] #explicitly enforced groups
	//grouping.forbidden_groups = [] #explicitly forbidden groups
	//grouping.past_groups = [] #groups that were previously created
	
	/*
	* Adds group to current grouping
	*/
	this.addGroup = function(group_id){
	}

	/*
	* Removes group from current grouping
	*/
	this.removeGroup = function(group_id){
		//TODO
	}

	/*
	* Returns group_id of group with a given student
	*/
	this.findGroupOfStudent = function(student_id){
		//TODO
	}

	/*
	* Switches student from a given group to a different group
	*/
	this.switchGroups = function(student_id, old_group_id, new_group_id){
		//TODO
	}

	/*
	* Creates new groups of students
	*/
	this.shuffle = function(){

		//TODO
	}

	/*
	* Pins a group
	* Pinned groups are "fixed" and cannot change
	*/
	this.pinGroup = function(group_id){
		//TODO
	}

	/*
	* Unpins a group
	*/
	this.unpinGroup = function(group_id){
		//TODO
	}

	/*
	* Adds group to list of forbidden groups
	*/
	this.forbidGroup = function(group_id){
	}

	/*
	* Unforbid group from list of forbidden groups
	*/
	this.forbidGroup = function(group_id){
	}


	/*
	*/
	this.size = function() {
		return grouping.groups.length;
	}
	/*
    *	@returns true iff this grouping has the same groups as that grouping
    */
    this.equals = function(thatGroup) {
    	//TODO
    }

	/*
	* Returns list of groups in current grouping
	*/
	this.toString = function() {
		//TODO
	}

	/*
	* Checks representation invariants
	*/
	this.checkRep = function() {
		//TODO
	}

}



