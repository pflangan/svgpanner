const originalZoom = "0 0 180 335";
const [oMinX, oMinY, oWidth, oHeight] = originalZoom.split(" ").map(Number);
const xZoomStepSize = oWidth / 10;
const yZoomStepSize = oHeight / 10;
var currentZoom = 100;
var dragging = false;
var dragStart = {
  x: null, y: null
};

function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
  return n;
}

function setupPlate() {
  const shape = document.getElementById("box");
  for (let rows = 1; rows <= 8 ; rows++) {
    for (let cols = 1; cols <= 16 ; cols++) {
      var el = getNode('ellipse', { cx: 20 * rows, cy: 20 * cols, rx: 5, ry: 5, fill:'#' + (Math.min(255, cols*15)).toString(16).padStart(2, "0") + (Math.min(255,rows*10)).toString(16).padStart(2, "0") + (Math.min(255, cols * rows * 5)).toString(16).padStart(2, "0") });
      shape.appendChild(el);

      var text = getNode('text', { 
                                    x: 20 * rows, 
                                    y: 20 * cols, 
                                    fill: 'white',
                                    textAnchor: 'middle',
                                    fontSize:8});
      text.appendChild(document.createTextNode("d"));
      shape.appendChild(text);
      
    }
  }
}

$(document).ready(() => {
    setupPlate();
    const viewportWidth = document.getElementById('box').clientWidth;
    const viewportHeight = document.getElementById('box').clientHeight;
    $('#zoomout').on('click', (e) => {
      const shape = document.getElementById("box");
      var viewBoxProperties = shape.getAttribute("viewBox");
      console.log(viewBoxProperties);
      var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
      // console.log(minx);
      width += xZoomStepSize;
      height += yZoomStepSize;
      currentZoom += 10;
      width = Math.min(oWidth, width);
      height = Math.min(oHeight, height);
      viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
      console.log(viewBoxProperties);
      shape.setAttribute("viewBox", viewBoxProperties);
    });

    $('#zoomin').on('click', (e) => {
      const shape = document.getElementById("box");
      var viewBoxProperties = shape.getAttribute("viewBox");
      console.log(viewBoxProperties);
      var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
      // console.log(minx);
      width -= xZoomStepSize;
      // minx -= 10;
      // miny -= 10;
      height -= yZoomStepSize;
      minx = Math.max(0, minx);
      miny = Math.max(0, miny);
      viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
      console.log(viewBoxProperties);
      shape.setAttribute("viewBox", viewBoxProperties);
    });
    
    $("#reset").on("click", (e) => {
      const shape = document.getElementById("box");
      shape.setAttribute("viewBox", originalZoom);
    });
    
    $("#box").on("mousedown", (e) => {
      dragging = true;
      const shape = document.getElementById("box");
      var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
      // dragStart.x = (minx + e.offsetX) / currentZoom;
      // dragStart.y = (miny + e.offsetY) / currentZoom;
      dragStart.x = e.offsetX;
      dragStart.y = e.offsetY;
      console.log(currentZoom);
    });
    
    $(document).on("mouseup", (e) => {
      if (dragging)
        dragging = false;
    });
    
    $("#box").on("mouseleave", (e) => {
      dragging = false;
    })
    
    $("#box").on("mousemove", (e) => {
      if (dragging) {
        const shape = document.getElementById("box");
        var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
        let endX = e.offsetX;
        let endY = e.offsetY;
    //     ${eventLeft / width * originalWidth - originalWidth / 4} 
        let diffX = ((dragStart.x - endX) / viewportWidth) * (width);
        let diffY = ((dragStart.y - endY) / viewportHeight) * (height);
    
        var viewBoxProperties = shape.getAttribute("viewBox");
        console.log(diffX, diffY);
        console.log(viewBoxProperties);
        if ((minx + diffX) <= (oWidth - width))
          minx = Math.max(0, minx + diffX);
        else if ((minx + diffX) >= oWidth - width)
          minx = Math.min(oWidth - width, minx + diffX);

        if ((miny + diffY) <= oHeight - height)
          miny = Math.max(0, miny + diffY);
        else if ((miny + diffY) >= oHeight - height)
          miny = Math.min(oHeight - height, miny + diffY);

        dragStart.x = endX;
        dragStart.y = endY;
        viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
        // console.log(viewBoxProperties);
        shape.setAttribute("viewBox", viewBoxProperties);
      }
    });
})