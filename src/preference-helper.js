/*

DEPENDS ON 

lodash.js
student.js
group.js
classroom.js


*/


//initialize M x M preference matrix [P_ij] indexed by student id
//p_ij = +1 if student with id i prefers student with id j 
//p_ij = -1 if student with id i avoids student with id j
createPreferenceMatrix = function(studentArray) {
    var PREFER_WEIGHT = 1.0 //must be positive
    var AVOID_WEIGHT = 1.0 //must be negative

    //initialize preference matrix
    var N = studentArray.length;
    var studentIDs = studentArray.map(function(s) {
        return s.id()
    });
    var maxID = _.max(studentIDs);
    var M = maxID + 1;

    var preferenceMatrix = [];
    for (var i = 0; i < M; i++){
        preferenceMatrix.push(Array.apply(null, Array(M)).map(Number.prototype.valueOf, 0.0))
    } 

    //fill preference Matrix
    for (var i = 0; i < N; i++) {
        var student = studentArray[i];
        var row_ind = student.id()

        //set p_ij = preferWeight if student i prefers j
        var preferIDs = student.getPreferences('prefer');
        for (var j = 0; j < preferIDs.length; j++) {
            preferenceMatrix[row_ind][preferIDs[j]] = PREFER_WEIGHT;
        }

        //set p_ij = avoidWeight if student i avoids j
        var avoidIDs = student.getPreferences('avoid');
        for (var j = 0; j < avoidIDs.length; j++) {
            preferenceMatrix[row_ind][avoidIDs[j]] = -AVOID_WEIGHT;
        }
    }
    return preferenceMatrix;
}

//helper function to deal with conflicting preferences and other issues
//current overrides:
//
//1. if student i wants to be with student j; but student j does not want to be with student i; 
//    we adjust p_ij and p_ji so that this will be less likely to occur
//    
fixPreferences = function(preferenceMatrix) {
    var CONFLICT_PENALTY = 100.0;
    var M = preferenceMatrix.length;
    console.log(preferenceMatrix)
    for (var i = 0; i < M; i++) {
        for (var j = 0; j < M; j++) {
            if ((preferenceMatrix[i][j] > 0) && (preferenceMatrix[j][i] < 0)) {
                preferenceMatrix[j][i] = CONFLICT_PENALTY * preferenceMatrix[j][i];
            } else if ((preferenceMatrix[i][j] < 0) && (preferenceMatrix[j][i] > 0)) {
                preferenceMatrix[i][j] = CONFLICT_PENALTY * preferenceMatrix[i][j];
            }
        }
    }
    return preferenceMatrix;
}

getProposedScore = function(studentID, groupIDs, groupScore, preferenceMatrix) {
    var score = groupScore;
    for (var i = 0; i < groupIDs.length; i++) {
        score += preferenceMatrix[studentID][groupIDs[i]];
        score += preferenceMatrix[groupIDs[i]][studentID];
    }
    return score;
}

//randomly assigns students weigh
assignStudentsWithPreferences = function(studentArray, students_per_group) {

    //create preference matrix 
    var preferenceMatrix = createPreferenceMatrix(studentArray);
    console.log('initialized preference matrix', preferenceMatrix);

    //address weird preference issues through matrix
    preferenceMatrix = fixPreferences(preferenceMatrix);
    console.log('fixed preference matrix', preferenceMatrix);

    //initialize variables required to create new groups
    var nStudents = studentArray.length;
    var nGroups = Math.ceil(nStudents / students_per_group);
    var groupIDs = []
    var groupScores = [] 
    for (var j = 0; j < nGroups; j++){
        groupIDs.push([]);
        groupScores.push(0.0);
    }

    //reorder students
    studentArray = _.shuffle(studentArray);

    //shuffle the order of students
    for (var i = 0; i < nStudents; i++) {
        
        var studentID = studentArray[i].id();
        var proposedScores = _.clone(groupScores);

        //compute score of adding student i to every group that has space
        for (var j = 0; j < groupIDs.length; j++) {
            if (groupIDs[j].length < students_per_group) {
                proposedScores[j] = getProposedScore(studentID, groupIDs[j], proposedScores[j], preferenceMatrix);
            } else {
                proposedScores[j] = Number.NEGATIVE_INFINITY;
            }
        }

        //add student to group that maximizes the proposed score
        var ind = proposedScores.indexOf(_.max(proposedScores));
        console.log('proposedScores', proposedScores)
        groupScores[ind] = _.clone(proposedScores[ind]);
        groupIDs[ind].push(studentID);
        console.log('adding student ', studentID, ' to group with ', groupIDs)
    }
    return groupIDs;
}


