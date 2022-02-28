const originalZoom = "0 0 180 335";
const [oMinX, oMinY, oWidth, oHeight] = originalZoom.split(" ").map(Number);
const xZoomStepSize = oWidth / 10;
const yZoomStepSize = oHeight / 10;
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
      var el = getNode('ellipse', { cx: 20 * rows, cy: 20 * cols, rx: 5, ry: 5, fill:'#' + (Math.min(255, cols*15)).toString(16) + (Math.min(255,rows*10)).toString(16) + (Math.min(255, cols * rows * 5)).toString(16) });
      shape.appendChild(el);
      console.log("created ellipse ",cols, rows);
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
      if (minx > 0) {
        minx = Math.max(0, minx - xZoomStepSize);
        width = Math.min(oWidth, width + xZoomStepSize/2);
      } else {
        width = Math.min(oHeight, width + xZoomStepSize);
      }

      if (miny > 0) {
        miny = Math.max(0, miny - (yZoomStepSize));
        height = Math.min(oHeight, height + yZoomStepSize/2);
      } else {
        height = Math.min(oHeight, height + yZoomStepSize);  
      }

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
      var currentZoom = oWidth / width;
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
        var currentZoom = oWidth / width;
        // let endX = (minx + e.offsetX) / currentZoom;
        // let endY = (miny + e.offsetY) / currentZoom;
        let endX = e.offsetX;
        let endY = e.offsetY;
    //     ${eventLeft / width * originalWidth - originalWidth / 4} 
        let diffX = ((dragStart.x - endX) / viewportWidth) * (oWidth - width);
        let diffY = ((dragStart.y - endY) / viewportHeight) * height;
    
        var viewBoxProperties = shape.getAttribute("viewBox");
        console.log(diffX, diffY);
        console.log(viewBoxProperties);
        if ((minx + diffX) <= (oWidth - width))
          minx = Math.max(0, minx + diffX);
        if ((miny + diffY) <= oHeight - height)
          miny = Math.max(0, miny + diffY);
        
        viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
        // console.log(viewBoxProperties);
        shape.setAttribute("viewBox", viewBoxProperties);
      }
    });
})