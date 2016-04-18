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
 * @param {[dict]} preferences [set of student preferences by student ID]
 */
function Student(name, id, preferences) {
    // console.log('initializing new student')
    // console.log(name)
    // console.log(id)
    // console.log(preferences)

    var self = this;
    var id = parseInt(id);
    if (!(_.isInteger(id) && id >= 0)) throw new Error('initialization error: integer id required');
    if (!_.isString(name)) throw new Error('initialization error: name must be String');
    name = name.trim();
    if (name.length < 1) throw new Error('initialization error: name must contain at least 1 non-whitespace character');
    if (!(/[\w]+/.test(name))) throw new Error('initialization error: name must contain at least 1 letter');
    if (preferences == null) {
        self.preferences = {
            'banned': [],
            'avoid': [],
            'prefer': [],
            'pinned': [],
        }
    } else {
        self.preferences = [];
        var preferenceTypes = ['banned', 'avoid', 'pinned', 'prefer']
        for (var i = 0; i < preferenceTypes.length; i++) {
            var prefType = preferenceTypes[i];
            if (prefType in preferences) {
                self.preferences[prefType] = _.clone(preferences[prefType]);
            } else {
                throw new Error("initialization error: student preferences must contain a field named '" + prefType + "'");
            }
        }
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
        var stringRep = 'name:' + name + '\n' +
            'sid: ' + id + '\n' +
            'prefer: ' + self.preferences['prefer'] + '\n' +
            'avoid: ' + self.preferences['avoid'] + '\n' +
            'pinned: ' + self.preferences['pinned'] + '\n' +
            'banned: ' + self.preferences['banned']
        return stringRep
    }

    self.toJSON = function() {
        return JSON.stringify({
            'name': name,
            'id': id,
            'preferences': preferences
        });
    }

    //returns a copy of preference vector
    self.getPreferences = function(prefType) {
        if (prefType == null) {
            return _.clone(self.preferences[prefType]);
        } else if (prefType in self.preferences) {
            return _.clone(self.preferences[prefType]);
        }
    }

    self.hasPreferenceFor = function(targetStudentID) {
        for (var key in self.preferences) {
            if (_.includes(self.getPreferences(key), targetStudentID)) {
                return true;
            }
        }
        return false;
    }

    self.checkRep = function() {
        if (self.hasPreferenceFor(self.id())) throw new Error('preferences for student ' + self.id() + ' include own id');
    }

    self.addToPreferences = function(prefType, targetStudentID) {
        var update_flag = false;
        if (prefType in self.preferences) {
            if (!self.hasPreferenceFor(targetStudentID)) {
                self.preferences[prefType].push(targetStudentID);
                update_flag = true;
            }
        }
        self.checkRep()
        return update_flag;
    }

    self.removeFromPreferences = function(prefType, targetStudentID) {
        var update_flag = false;
        console.log('pref type is ' + prefType);
        if (prefType in self.preferences) {
            if (targetStudentID != self.id()) {
                var idx = self.preferences[prefType].indexOf(targetStudentID);
                if (idx > -1) {
                    self.preferences[prefType].splice(idx, 1);
                    update_flag = true;
                }
            }
        } else if (prefType == 'all') {
            console.log('prefType' == 'all')
            for (var key in self.preferences) {
                var idx = self.preferences[key].indexOf(targetStudentID);
                if (idx > -1) {
                    self.preferences[key].splice(idx, 1);
                    update_flag = true;
                }
            }
        }
        self.checkRep()
        return update_flag;
    }

    // returns true if pinned with another person
    self.isPinned = function() {
        return self.preferences['pinned'].length > 0
    }


}
