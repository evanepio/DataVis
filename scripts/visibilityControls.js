VISIBILTIY_CONTROLS = (function () {
    "use strict";

    var _addVisibilityControlsToDOM = function (idString, allGroups, theGraph) {
        var controls = document.getElementById(idString);
        var visibilityOptions = {groups: {visibility: {}}};
        allGroups.forEach(function (group, index) {
            var id = "group" + index;
            var checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            checkBox.name = "groupVisibility";
            checkBox.value = group;
            checkBox.id = id;

            var label = document.createElement('label');
            label.htmlFor = id;
            label.appendChild(document.createTextNode(group));

            controls.appendChild(checkBox);
            controls.appendChild(label);
            controls.appendChild(document.createElement('br'));

            checkBox.checked = "checked";
            checkBox.onchange = function () {
                visibilityOptions.groups.visibility[index] = !visibilityOptions.groups.visibility[index];

                theGraph.setOptions(visibilityOptions);
            };

            visibilityOptions.groups.visibility[index] = true;
        });
    };

    return {
        addVisibilityControlsToDOM: _addVisibilityControlsToDOM
    };
}());