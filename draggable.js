function DraggableContainer(containerID, overlap){
  var container = this;
  container.overlap = overlap || [0, 0];
  container.element = document.getElementById(containerID);
  container.children = [];
  container.topZIndex = container.element.style.zIndex || 0;

  (function prepareChildren(){
    var draggables = container.element.children,
      l = draggables.length,
      p;
    for(p = 0; p < l; p++){
      container.children.push(new Draggable(draggables[p], container));
    }
  }());

  (function startChildren(){
    var draggables = container.children,
      l = draggables.length,
      p;
    for(p = 0; p < l; p++){
      draggables[p].position();
      draggables[p].listenForClick();
    }
  }());
}

function Draggable(element, container){
  var instance = this;
  instance.isDragging = false;
  instance.isAbleToBeDragged = false;

  instance.container = container;
  instance.element = element;
  instance.drag = instance.drag.bind(instance);
  instance.drop = instance.drop.bind(instance);

  instance.origin = {
    left: instance.element.offsetLeft,
    top: instance.element.offsetTop
  }
  instance.distanceRemaining = {}
  instance.maxDistance = {}
  instance.cursor = {}
};
Draggable.prototype = {
  position: function(){
    var instance = this;
    var overlap = instance.container.overlap;
    instance.element.style.position = "absolute";
    instance.element.style.zIndex = instance.container.topZIndex;
    instance.element.style.left = instance.origin.left + "px";
    instance.element.style.top = instance.origin.top + "px";
    instance.maxDistanceTo = {
      top: 0 - overlap[0],
      right: instance.element.offsetParent.offsetWidth - instance.element.offsetWidth + overlap[1],
      bottom: instance.element.offsetParent.offsetHeight - instance.element.offsetHeight + overlap[0],
      left: 0 - overlap[1]
    }
  },
  listenForClick: function(){
    var instance = this;
    instance.element.addEventListener("mousedown", instance.startDragging.bind(instance));
    instance.element.addEventListener("touchstart", instance.startDragging.bind(instance));
    instance.isAbleToBeDragged = true;
  },
  startDragging: function(evt){
    var instance = this;
    var isTouchy = (evt.type == "touchstart");
    if(instance.isDragging || !instance.isAbleToBeDragged) return;
    else instance.isDragging = true;
    instance.getOriginCoords();
    instance.getDistanceRemaining();
    instance.getCursorCoords(evt);
    instance.setZIndex();
    window.addEventListener(isTouchy ? "touchmove" : "mousemove", instance.drag);
    window.addEventListener(isTouchy ? "touchend" : "mouseup", instance.drop);
  },
  drag: function(evt){
    var instance = this;
    if(evt.type == "touchmove") evt = evt.touches[0];
    var cursorChangeY = evt.clientY - instance.cursor.top;
    var cursorChangeX = evt.clientX - instance.cursor.left;
    var isToo = {
      top: cursorChangeY < instance.distanceRemaining.top,
      right: cursorChangeX > instance.distanceRemaining.right,
      bottom: cursorChangeY > instance.distanceRemaining.bottom,
      left: cursorChangeX < instance.distanceRemaining.left
    }
    instance.element.style.top = (function(){
      if(isToo.top) return instance.maxDistanceTo.top;
      if(isToo.bottom) return instance.maxDistanceTo.bottom;
      return instance.origin.top + cursorChangeY;
    }()) + "px";
    instance.element.style.left = (function(){
      if(isToo.left) return instance.maxDistanceTo.left;
      if(isToo.right) return instance.maxDistanceTo.right;
      return instance.origin.left + cursorChangeX;
    }()) + "px";
  },
  drop: function(evt){
    var instance = this;
    instance.isDragging = false;
    window.removeEventListener("touchmove", instance.drag);
    window.removeEventListener("touchend", instance.drop);
    window.removeEventListener("mousemove", instance.drag);
    window.removeEventListener("mouseup", instance.drop);
  },
  getOriginCoords: function(){
    var instance = this;
    instance.origin = {
      top: parseInt(instance.element.style.top),
      left: parseInt(instance.element.style.left)
    }
  },
  getDistanceRemaining: function(){
    var instance = this;
    var overlap = instance.container.overlap;
    var el = instance.element;
    var parent = instance.element.offsetParent;
    instance.distanceRemaining = {
      top: 0 - el.offsetTop - overlap[0],
      right: parent.offsetWidth - (el.offsetWidth + el.offsetLeft) + overlap[1],
      bottom: parent.offsetHeight - (el.offsetHeight + el.offsetTop) + overlap[0],
      left: 0 - el.offsetLeft - overlap[0]
    }
  },
  getCursorCoords: function(evt){
    var instance = this;
    if(evt.type == "touchstart") evt = evt.touches[0];
    instance.cursor = {
      top: evt.clientY,
      left: evt.clientX
    }
  },
  setZIndex: function(){
    var instance = this;
    if(parseInt(instance.element.style.zIndex) <= instance.container.topZIndex){
      instance.element.style.zIndex = ++instance.container.topZIndex;
    }
  },
};

