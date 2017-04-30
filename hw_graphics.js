/**
 * Created by oliver on 4/2/17.
 */
// ## Hacknode Drawing Functions ## //
paper.install(window);

function Node(x, y, r, c) {


    this.name = "Node at " + x + "," + y + " with color " + c;
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;

    var _health = 100;
    var owned = false;
    var w = 15; // border width

    var outerNode = new Path.Circle({
        center: new Point(x, y),
        radius: r + w, // border width is 15px
        shadowColor: c,
        shadowBlur: 80,
        shadowOffset: new Point(0, 0),
        name: 'outerNode'
    });

    var innerNode = new Path.Circle({
        center: new Point(x, y),
        radius: r,
        name: 'innerNode'
    });

    var arcNode = createArc(x, y, r + w, c);

    // Make the damage indicator (text)
    var damageText = new PointText({
        point: new Point(x, y + 10),
        //content: _health,
        fillColor: 'white',
        opacity: 0.5,
        justification: 'center',
        fontFamily: 'Gill Sans',
        fontWeight: 'normal',
        fontSize: 24
    });

    // Make a transparent circle over the node as a consistent target for mouse events
    var mouseTarget = new Path.Circle({
        center: new Point(x, y),
        radius: r + w,
        fillColor: new Color(1, 0.001),
        name: 'mouseTarget'
    });

    setBaseColor(c);

    // Make the select circle and hide it
    var selectNode = new Path.Circle({
        center: new Point(x, y),
        radius: r + w,
        strokeColor: 'white',
        strokeWidth: 3,
        shadowColor: 'white',
        shadowBlur: 40,
        shadowOffset: new Point(0, 0)
    });
    selectNode.visible = false;

    // Make the targeting circle and hide it
    var targetCircle = new Path.Circle({
        center: new Point(x, y),
        radius: r,
        strokeColor: 'orange',
        strokeWidth: 3,
        shadowColor: 'orange',
        shadowBlur: 40,
        shadowOffset: new Point(0, 0)
    });
    targetCircle.visible = false;

    Group.call(this, [outerNode, innerNode, arcNode, damageText, selectNode, targetCircle, mouseTarget]);

    // ACCESSORS

    Object.defineProperty(this, "owned", {
        get: function () {
            return owned;
        },
        set: function (_bool) {
            owned = _bool;
            if(owned) { setBaseColor('#4286f4') };
        }
    });
    Object.defineProperty(this, "selected", {
        get: function () {
            return selectNode.visible;
        },
        set: function (_selected) {
            selectNode.visible = _selected;
        }
    });
    Object.defineProperty(this, "targeted", {
        get: function () {
            return targetNode.visible;
        },
        set: function (_targeted) {
            targetNode.visible = _targeted;
        }
    });
    Object.defineProperty(this, "health", {
        get: function () {
            return _health;
        },
        set: function (amount) {
            _health = amount;
            damageText.content = _health;
        }
    });
    Object.defineProperty(this, "baseColor", {
        get: function() {
            return outerNode.fillColor;
        },
        set: function (_color) {
            setBaseColor(_color);
        }
    });

    // PRIVATE FUNCTIONS

    function setBaseColor(c) {
        outerNode.fillColor = c;
        // If the node color is a shade of grey (no saturation) shadow color must be white
        if (outerNode.fillColor.saturation == 0) {
            outerNode.shadowColor = new Color(.7);
        } else {
            outerNode.shadowColor = c;
            outerNode.shadowColor.brightness = 1; // Boost the shadow brightness to max
            outerNode.shadowColor.saturation = 1; // Boost the shadow color saturation
        }
        innerNode.fillColor = c;
        innerNode.fillColor.brightness += .07;
        innerNode.fillColor.saturation -= .1;
        arcNode.fillColor = c;
        arcNode.fillColor.alpha = 0.3;
        arcNode.blendMode = 'multiply';
    };

    // Draws the half circle
    function createArc(x, y, r) {
        // Draw the outside curve of a half-circle
        var start = new Point(x, y - r);
        var through = new Point(x - r, y);
        var to = new Point(x, y + r);
        var arcNode = Path.Arc(start, through, to);
        // Draw the flat line
        arcNode.add(new Point(x, y));
        arcNode.add(new Point(x, y - r));
        arcNode.rotate(45, new Point(x, y));
        arcNode.name = 'arcNode';
        return arcNode;
    };
}

Node.prototype = Object.create(Group.prototype);
Node.prototype.constructor = Group;

Node.prototype.isSelectable = function () {
    return this.owned;
}

// ### Standalone functions


function connectNodes(node1, node2) {
    // TODO: Need to make lines an object type
    console.log(node1, node2)


    var line = new Path();
    line.name = 'line';
    line.sendToBack();
    line.add(node1.position);
    line.add(node2.position);
    line.strokeWidth = 10;
    line.strokeColor = '#156011';
    line.isAnAttack = false;
    line.node1 = node1;
    line.node2 = node2;
    return line;
}


