function Group() {
	
	var group = this;
	group.members = [];

	/* 
	*	checks to see if student is in list of group members
	*	@returns true if student exists in list of group members
	*/
	this.hasStudent = function(student_id) {
		var found_student = false
		for (var i = 0; i < group.size() - 1; i++) {
			if (group.members[i] === student_id){
				found_student = true;
				break;
			}
		}
		return found_student;
	}

	/*
	*	adds a student to the list of group members 
	*	@returns true if student is successfully added to list of group members
	*/
	this.addStudent = function(student_id) {
		var update_flag = false;
		if (!group.hasStudent(student_id)){
			group.members.push(student_id);
			update_flag = true;
		}
		return update_flag;
	}

    /*
    * 	remove a student from the list of group members
    *	@returns true if student is successfully removed from list of group members
    */
    this.removeStudent = function(student_id) {
    	var update_flag = false;
    	for (var i = group.size() - 1; i >= 0; i--) {
    		if (group.members[i] === student_id) {
    			group.splice(i, 1);
    			update_flag = true;
    		}
    	}
    	return update_flag;
    }

    /*
    *	@returns number of students in the group
    */
    this.size = function() {
    	return group.members.length;
    }

	/*
    *	@returns true iff this group has the same students as thatGroup
    */
    this.equals = function(thatGroup) {
    	var equal_flag = true
    	if (group.size() != thatGroup.size()){
    		equal_flag = false 
    	} else {
    		for (var i = 0; i < group.size() - 1; i++) {
    			if (!thatGroup.hasStudent(group.members[i])){
    				equal_flag = false;
    				break;
    			}
    		}
    	}
    	return equal_flag;
    }

    /*
    */
    this.toString = function() {
		//todo
	}

	/*
	*/
	this.checkRep = function() {
		//todo
	}


    /*
    *	@returns true iff this group has the all of the student as thatGroup
    */
    this.contains = function(thatGroup) {
    	var contains_flag = true
    	if (group.size() < thatGroup.size()){
    		contains_flag = false 
    	} else {
    		for (var i = 0; i < thatGroup.size()- 1; i++) {
    			if (!group.hasStudent(thatGroup.members[i])){
    				contains_flag = false;
    				break;
    			}
    		}
    	}
    	return contains_flag;
    }


	/*
	*/
	this.setLocation = function() {
		//todo
	}

	/*
	*/
	this.getLocation = function() {
		//todo
	}
}