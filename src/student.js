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

    self.preferences = {
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
        var stringRep = 'name:' + name + '\n' +
            'sid: ' + id + '\n' +
            'prefers: ' + self.preferences['prefer'] + '\n' +
            'avoid: ' + self.preferences['avoid'] + '\n' +
            'pinned: ' + self.preferences['pinned'] + '\n' +
            'banned: ' + self.preferences['banned']
        return stringRep
    }

    //returns a copy of preference vector
    self.getPreferences = function(prefType) {
        if (prefType in self.preferences) {
            return _.clone(self.preferences[prefType])
        }
    }

    self.checkRep = function() {
        console.log('checkRep name: ' + self.name())
        console.log('checkRep id: ' + self.id())
        if (_.includes(self.getPreferences('banned'), self.id())) throw new Error('ban list for student ' + id + 'includes own id')
        if (_.includes(self.getPreferences('pinned'), self.id())) throw new Error('pin list for student ' + id + 'includes own id')
        if (_.includes(self.getPreferences('prefer'), self.id())) throw new Error('prefer list for student ' + id + 'includes own id')
        if (_.includes(self.getPreferences('avoid'), self.id())) throw new Error('avoid list for student ' + id + 'includes own id')
    }

    self.addToPreferences = function(prefType, targetStudentID) {
        var update_flag = false;
        if (prefType in self.preferences) {
            if (targetStudentID != self.id()) {
                if (!_.includes(self.preferences[prefType], targetStudentID)) {
                    self.preferences[prefType].push(targetStudentID);
                    self.preferences[prefType].sort();
                    update_flag = true;
                    console.log(targetStudentID);
                    console.log(self.preferences);
                }
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
        } else if (prefType == 'all'){
            console.log('prefType' == 'all')
            var idx = self.preferences['pinned'].indexOf(targetStudentID);
            if (idx > -1) {
                self.preferences['pinned'].splice(idx, 1);
                update_flag = true;
            }
            var idx = self.preferences['banned'].indexOf(targetStudentID);
            if (idx > -1) {
                self.preferences['banned'].splice(idx, 1);
                update_flag = true;
            }
            var idx = self.preferences['prefer'].indexOf(targetStudentID);
            if (idx > -1) {
                self.preferences['prefer'].splice(idx, 1);
                update_flag = true;
            }
            var idx = self.preferences['avoid'].indexOf(targetStudentID);
            if (idx > -1) {
                self.preferences['avoid'].splice(idx, 1);
                update_flag = true;
            }
            console.log(self.toString())
        }
        self.checkRep()
        return update_flag;
    }

    // returns true if pinned with another person
    self.isPinned = function() {
        return self.preferences['pinned'].length > 0
    }


}
