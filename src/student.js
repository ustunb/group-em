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

    //public methods
    self.name = function() {
        return name;
    }

    self.id = function() {
        return id;
    }

    self.valueOf = function() {
        return id;
    }

    self.toString = function() {
        return name + ' (sid: ' + id + ')';
    }
}
