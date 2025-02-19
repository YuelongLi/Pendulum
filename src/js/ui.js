/* jshint esversion: 6 */
var MathQuill = require("../../node_modules/mathquill/build/mathquill");
var MQ = MathQuill.getInterface(2);

var objectBar = $('#object-bar')[0];

// var types = {
//     ":": "Variable",
//     "": "Function",
//     "{": "Object"
// };

var names = [];
var nameControls = {};
var defControls = {};

/**
 * Used to record whether certain number slots are filled
 */
var indexes = [];

function getIndex(position = 0) {
    if (position >= indexes.length) {
        indexes[position] = true;
        return position;
    }
    for (var i = position; i < indexes.length; i++) {
        if (!indexes[i]) {
            indexes[i] = true;
            return i;
        }
    }
    indexes.push(true);
    return i;
}

function removeIndex(position = 0) {
    indexes[position] = false;
}

class NameControl {
    constructor() {
        this.varName = "";
        this.nameContainer = document.body;
        this.nameField = document.body;
        this.type = ':';
    }
    /**
     * Used to synchronize height between definition container and namefield container
     */
    updateSize() {
        var definition = this.defControl.defField;
        var defContainer = this.defControl.defContainer;
        $(this.nameContainer).innerHeight($(this.nameField).outerHeight());
        if (definition.offsetHeight > this.nameField.offsetHeight)
            $(this.nameContainer).outerHeight($(defContainer).outerHeight(true),true);
        else $(defContainer).outerHeight($(this.nameField).outerHeight(true));
    }

    loadDefControl(ec) {
        this.defControl = ec;
    }
}
class DefControl {
    constructor() {
        this.varName = "";
        this.defContainer = document.body;
        this.defField = document.body;
        this.type = ':';
    }
    /**
     * Used to synchronize height between definition container and namefield container
     */
    updateSize() {
        var name = this.nameControl.nameField;
        var nameContainer = this.nameControl.nameContainer;
        $(this.defContainer).innerHeight($(this.defField).outerHeight());
        if (this.defField.offsetHeight > name.offsetHeight)
            $(nameContainer).outerHeight($(this.defContainer).outerHeight(true),true);
        else $(this.defContainer).outerHeight($(name).outerHeight(true));
    }

    loadNameControl(nc = new NameControl()) {
        this.type = nc.type;
        this.nameControl = nc;
    }
}

function loadTags() {
    $('.name').each(function () {
        var container = this.parentElement;
        var name = container.getAttribute('varname');
        var nc = initiateNameControl(name, container, this);
        names.push(name);
        nameControls[name] = nc;
    });
}

function loadShelves() {
    $('.expression').each(function () {
        var container = this.parentElement;
        var name = container.getAttribute('varname');
        var ec = initiateDefControl(name, container, this);
        defControls[name] = ec;
    });
}

function loadReference() {
    for (let varName in nameControls) {
        var nc = nameControls[varName];
        var ec = defControls[varName];
        nc.loadDefControl(ec);
        ec.loadNameControl(nc);
        nc.updateSize();
        ec.updateSize();
    }
}

function addNameField(name = undefined, autoIndex = 0) {
    if (name == undefined) name = 1 + autoIndex;
    var html = $.parseHTML(`<div class="name-container" varname="${name}"><div class="name">${name}</div><div class="type">:</div></div>`);
    $('#object-bar').append(html);
    var nc = initiateNameControl(name, html[0], html[0].children[0]);
    nameControls[nc.varName] = nc;
}

function addExpField(name = undefined, autoIndex = 0) {
    if (name == undefined) name = 1 + autoIndex;
    var html = $.parseHTML(`<div class=\"expression-container\" varname=\"${name} \"> <span class = \"expression\"></span> </div>`);
    $('#mathpanel').append(html);
    var ec = initiateDefControl(name, html[0], html[0].children[0]);
    defControls[name] = ec;
}

function focusNext(name) {
    defControls[name].mathquill.blur();
    defControls[names[(names.indexOf(name) + 1) % names.length]].mathquill.focus();
}

function focusLast(name) {
    defControls[name].mathquill.blur();
    defControls[names[(names.indexOf(name) + names.length - 1) % names.length]].mathquill.focus();
}

function removeNameField(name = "") {
    var nc = nameControls[name];
    var html = nc.nameContainer;
    html.parentNode.removeChild(html);
}

function removeDefField(name = "") {
    var ec = defControls[name];
    var html = ec.defContainer;
    html.parentNode.removeChild(html);
}

function appendDefinition(name = undefined) {
    addNameField(name);
    addExpField(name);
    var autoIndex = getIndex(names.length);
    nameControls[name].loadDefControl(defControls[name], autoIndex);
    defControls[name].loadNameControl(nameControls[name], autoIndex);
}

function removeDefinition(name = "") {
    var index = -1;
    if ((index = names.indexOf(name)) != -1) {
        removeNameField(name);
        delete nameControls[name];
        removeDefField(name);
        delete defControls[name];
        names.splice(index, 1);
        // core.removeDefinition(name);
        if (Number.isInteger(+name)) removeIndex(+name - 1);
    }
    return index;
}

function insertNameField(previous = "", name = undefined, autoIndex = 0) {
    if (name == undefined) name = 1 + autoIndex;
    var html = $.parseHTML(`<div class="name-container" varname="${name}"><div class="name">${name}</div><div class="type">:</div></div>`);
    var previousContainer = nameControls[previous].nameContainer;
    previousContainer.parentNode.insertBefore(html[0], previousContainer.nextSibling);
    var nc = initiateNameControl(name, html[0], html[0].children[0]);
    nameControls[nc.varName] = nc;
}

function insertExpField(previous = "", name = undefined, autoIndex = 0) {
    if (name == undefined) name = 1 + autoIndex;
    var html = $.parseHTML(`<div class=\"expression-container\" varname=\"${name} \"> <span class = \"expression\"></span> </div>`);
    var previousContainer = defControls[previous].defContainer;
    previousContainer.parentNode.insertBefore(html[0], previousContainer.nextSibling);
    var ec = initiateDefControl(name, html[0], html[0].children[0]);
    defControls[ec.varName] = ec;
    return name;
}

function insertDefinition(previous = "", name = undefined) {
    var index;
    if ((index = names.indexOf(previous)) != -1) {
        var autoIndex = getIndex(index + 1);
        name = insertNameField(previous, name, autoIndex);
        name = insertExpField(previous, name, autoIndex);
        names.splice(names.indexOf(previous) + 1, 0, name);
        nameControls[name].loadDefControl(defControls[name]);
        defControls[name].loadNameControl(nameControls[name]);
    }

}

function initiateNameControl(name, container, field) {
    var nc = new NameControl();
    nc.nameContainer = container;
    nc.nameField = field;
    nc.varName = name;
    // nc.parser = new NameParser();
    nc.type = nc.nameContainer.lastElementChild.innerText;
    nc.mathquill = MQ.MathField(nc.nameField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                nc.updateSize();
                // core.resizeGraphics();
                //@TODO: replace name with identifier
                // let identifier = getIdentifier(nc.parser.tokenize(nc.mathquill.latex()));
                // console.log("updating identifier " + nc.mathquill.latex() + ": " + tokensToString(nc.parser.tokenize(nc.mathquill.latex())));
            }
        }
    });
    // let identifier = getIdentifier(nc.parser.tokenize(nc.mathquill.latex()));
    // console.log("updating identifier " + nc.mathquill.latex() + ": " + tokensToString(nc.parser.tokenize(nc.mathquill.latex())));
    // core.createDefinition(name);
    return nc;
}

function initiateDefControl(name, container, field) {
    var ec = new DefControl();
    ec.defContainer = container;
    ec.defField = field;
    ec.varName = name;
    // ec.parser = new Parser();
    ec.mathquill = MQ.MathField(ec.defField, {
        autoSubscriptNumerals: true,
        handlers: {
            edit: () => {
                ec.updateSize();
                // core.resizeGraphics();
                // let rpns = ec.parser.getRPN(ec.mathquill.latex());
                // console.log(rpnsToString(rpns));
                // core.updateDefinition(name, rpns);
            },
            enter: () => {
                insertDefinition(ec.varName);
                focusNext(ec.varName);
            },
            deleteOutOf: (direction) => {
                if (direction == MQ.L) {
                    focusLast(name);
                    removeDefinition(name);
                }
            },
            upOutOf: () => focusLast(name),
            downOutOf: () => focusNext(name)
        }
    });
    // let rpns = ec.parser.getRPN(ec.mathquill.latex());
    // core.updateDefinition(name, rpns);
    return ec;
}

module.exports =  {
    nameControls,
    defControls,
    loadTags,
    loadShelves,
    loadReference
};