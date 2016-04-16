/* Depends on
 *
 * lodash.js
 * group.js
 * classroom.js
 * 
 */

/**
 * immutable class to represent each student
 * @param {[int]} id   [unique student identifier; must be positive]
 * @param {[string]} name [full student name, must only contain letters a-zA-Z or spaces/dash/apostophe and contain at least 1 non-whitespace character]
 */
function Student(name, id) {

    var self = this;
    if (!(_.isInteger(id) && id >= 0)) throw new Error('integer id required');
    if (!_.isString(name)) throw new Error('name must be String');
    name = name.trim();
    if (name.length < 1) throw new Error('name must contain at least 1 non-whitespace character');
    if (!(/[\w]+/.test(name))) throw new Error('name must contain at least 1 letter');

    preferences = {
        'banned': [],
        'avoid': [],
        'prefer': [],
        'pinned': [],
    }

    //public methods
    self.name = function() {
        return name;
    }

    self.id = function() {
        var idCopy = id;
        return idCopy;
    }

    self.valueOf = function() {
        return id;
    }

    self.toString = function() {
        return name + ' (sid: ' + id + ')';
    }

    self.checkRep = function() {
        console.log('checkRep name: ' + self.name())
        console.log('checkRep id: ' + self.id())
        if (_.includes(preferences['banned'], self.id())) throw new Error('ban list for student ' + id + 'includes own id')
        if (_.includes(preferences['pinned'], self.id())) throw new Error('pin list for student ' + id + 'includes own id')
        if (_.includes(preferences['prefer'], self.id())) throw new Error('prefer list for student ' + id + 'includes own id')
        if (_.includes(preferences['avoid'], self.id())) throw new Error('avoid list for student ' + id + 'includes own id')
    }

    self.addToPreferences = function(prefType, targetStudentID) {
        var update_flag = false;
        if (prefType in preferences) {
            // var targetID = targetStudent.id();
            if (targetStudentID != self.id()) {
                if (!_.includes(preferences[prefType], targetStudentID)) {
                    preferences[prefType].push(targetStudentID);
                    preferences[prefType].sort();
                    update_flag = true;
                    console.log(preferences)
                    console.log(targetStudentID)
                }
            }
        }
        self.checkRep()
        return update_flag;
    }

    self.removeFromPreferences = function(prefType, targetStudentID) {
        var update_flag = false;
        if (prefType in preferences) {
            // var targetID = targetStudent.id()
            if (targetStudentID != self.id()) {
                var idx = preferences[prefType].indexOf(targetStudentID);
                if (idx > -1) {
                    preferences[prefType].splice(idx, 1);
                    update_flag = true;
                }
            }
        }
        self.checkRep()
        return update_flag;
    }

    // returns true if pinned with another person
    self.isPinned = function() {
        return preferences['pinned'].length > 0
    }

    //returns a copy of preference vector
    self.getPreferences = function(prefType) {
        if (prefType in preferences) {
            return _.clone(preferences[prefType])
        }
    }

}
