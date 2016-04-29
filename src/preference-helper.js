


//initialize M x M preference matrix [P_ij] indexed by student id
//p_ij = +1 if student with id i prefers student with id j 
//p_ij = -1 if student with id i avoids student with id j 
createPreferenceMatrix = function(studentArray){
    var PREFER_WEIGHT = 1.0 //must be positive
    var AVOID_WEIGHT = 1.0 //must be negative
    
    //initialize preference matrix
    var N = studentArray.length;
    var studentIDs = studentArray.map(function(s){return s.id()});
    var maxID = _.max(studentIDs);
    var preferenceMatrix = new Array(maxID);
    
    for (var i = 0; i < N; i++){

        var student = studentArray[i];
        
        //create new row filled with zeros
        var preferenceRow = [];
        for (var j = 0; j <= maxID; j++){
            preferenceRow.push(0);
        }

        //set p_ij = preferWeight if student i prefers j
        var preferIDs =  student.getPreferences('prefer');
        for (var j = 0; j < preferIDs.length; j++){
            preferenceRow[preferIDs[j]] = PREFER_WEIGHT;
        }

        //set p_ij = avoidWeight if student i avoids j
        var avoidIDs = student.getPreferences('avoid');
        for (var j = 0; j < avoidIDs.length; j++){
            preferenceRow[avoidIDs[j]] = -AVOID_WEIGHT;
        }

        preferenceMatrix[studentIDs[i]] = preferenceRow;
    }
    return preferenceMatrix;
}

//helper function to deal with conflicting preferences
//current overrides:
//
//1. if student i wants to be with student j; but student j does not want to be with student i; 
//    we adjust p_ij and p_ji so that this will be less likely to occur
//    
fixConflictingPreferences = function(preferenceMatrix) {
    var CONFLICT_PENALTY = 100;
    M = preferenceMatrix.length;
    for (var i = 0; i++; i < M) {
        for (var j = 0; j++; j < M){
            if ((preferenceMatrix[i][j] > 0) && (preferenceMatrix[j][i] < 0)){
                preferenceMatrix[j][i] = CONFLICT_PENALTY * preferenceMatrix[j][i];
            } else if ((preferenceMatrix[i][j] < 0) && (preferenceMatrix[j][i] > 0)) {
                preferenceMatrix[i][j]  = CONFLICT_PENALTY * preferenceMatrix[i][j];
            }
        }
    }
}






