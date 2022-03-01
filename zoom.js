const originalZoom = "0 0 180 335";
const originalRowZoom = "-47 0 60 335";
const originalColZoom = "0 -20.5 180 33.5";
const [oMinX, oMinY, oWidth, oHeight] = originalZoom.split(" ").map(Number);
const xZoomStepSize = oWidth / 10;
const yZoomStepSize = oHeight / 10;
const maxZoom = 160;
var currentZoom = 100;
var dragging = false;
var dragStart = {  x: null, y: null };

function getNode(n, v) {
  n = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (var p in v)
    n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
  return n;
}

function setupPlate() {
  const shape = document.getElementById("box");
  const rowHeader = document.getElementById("rows");
  const colHeader = document.getElementById("cols");
  for (let columns = 1; columns <= 8 ; columns++) {
    for (let rows = 1; rows <= 16 ; rows++) {
      let rowStr = "ABCEDEFGHIJKLMNOP";
      let colStr = "0123456789";
      var el = getNode('ellipse', { cx: 20 * columns, cy: 20 * rows, rx: 5, ry: 5, fill:'#' + (Math.min(255, rows*15)).toString(16).padStart(2, "0") + (Math.min(255,columns*10)).toString(16).padStart(2, "0") + (Math.min(255, rows * columns * 5)).toString(16).padStart(2, "0") });
      shape.appendChild(el);
      if (rows == 1) {
        var text = getNode('text', { x: (20 * columns) - 4, y: 0, fontSize: 15, alignmentBaseline: 'hanging'});
        text.appendChild(document.createTextNode(colStr.charAt(columns - 1)));
        colHeader.appendChild(text);
      }
      if (columns == 1) {
        var text = getNode('text', { x: 0, y: (5 + (20 * rows)), fontSize: 15});
        text.appendChild(document.createTextNode(rowStr.charAt(rows - 1)));
        rowHeader.appendChild(text);
      }
      // var text = getNode('text', { 
      //                               x: 20 * rows, 
      //                               y: 20 * cols, 
      //                               fill: 'white',
      //                               textAnchor: 'middle',
      //                               fontSize:8});
      // text.appendChild(document.createTextNode("d"));
      // shape.appendChild(text);
    }
  }
}

document.addEventListener('DOMContentLoaded', function(event) {

    setupPlate();
    const viewportWidth = document.getElementById('box').clientWidth;
    const colViewportHeight = document.getElementById('cols').clientHeight;
    const rowViewportWidth = document.getElementById('rows').clientWidth;
    const viewportHeight = document.getElementById('box').clientHeight;
    const zoomOut = document.getElementById('zoomout');

    // $('#zoomout').on('click', (e) => {
    zoomOut.addEventListener("click", (e) => { 
      if (currentZoom > 100) {
        const shape = document.getElementById("box");
        const rowHeader = document.getElementById("rows");
        const colHeader = document.getElementById("cols");
        var viewBoxProperties = shape.getAttribute("viewBox");
        console.log(viewBoxProperties);
        var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
        var [rowx, rowy, rowWidth, rowHeight] = rowHeader.getAttribute("viewBox").split(" ").map(Number);
        var [colx, coly, colWidth, colHeight] = colHeader.getAttribute("viewBox").split(" ").map(Number);
        // console.log(minx);
        width += xZoomStepSize;
        height += yZoomStepSize;
        rowHeight += yZoomStepSize;
        colWidth += xZoomStepSize;
        colHeight = colViewportHeight * (height / viewportHeight);
        rowWidth = rowViewportWidth * (width / viewportWidth);
        currentZoom -= 10;
        width = Math.min(oWidth, width);
        height = Math.min(oHeight, height);
        if ((minx + width) > oWidth) {
          minx = oWidth - width;
        }

        if ((miny + height) > oHeight) {
          miny = oHeight - height;
        }

        viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
        let rowProperties = `${-(rowWidth - 13)} ${miny} ${rowWidth} ${rowHeight}`;
        let colProperties = `${minx} ${-(colHeight - 13)} ${colWidth} ${colHeight}`;
        console.log(viewBoxProperties);
        shape.setAttribute("viewBox", viewBoxProperties);
        rowHeader.setAttribute("viewBox", rowProperties);
        colHeader.setAttribute("viewBox", colProperties);
      }
    }, false);

    const zoomIn = document.getElementById("zoomin");
    // $('#zoomin').on('click', (e) => {
    zoomIn.addEventListener("click", (e) => {
      if (currentZoom < maxZoom) {
        const shape = document.getElementById("box");
        const rowHeader = document.getElementById("rows");
        const colHeader = document.getElementById("cols");
        var viewBoxProperties = shape.getAttribute("viewBox");
        const textEls = document.getElementsByTagName('text');
        console.log(viewBoxProperties);
        var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
        var [,,rowWidth, rowHeight] = rowHeader.getAttribute("viewBox").split(" ").map(Number);
        var [,,colWidth, colHeight] = colHeader.getAttribute("viewBox").split(" ").map(Number);
        // console.log(minx);
        width -= xZoomStepSize;
        // minx -= 10;
        // miny -= 10;
        height -= yZoomStepSize;
        rowHeight -= yZoomStepSize;
        colWidth -= xZoomStepSize;
        currentZoom += 10;
        minx = Math.max(0, minx);
        miny = Math.max(0, miny);
        colHeight = colViewportHeight * (height / viewportHeight);
        rowWidth = rowViewportWidth * (width / viewportWidth);
        
        viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
        rowProperties = `${-(rowWidth - 13)} ${miny} ${rowWidth} ${rowHeight}`;
        colProperties = `${minx} ${-(colHeight - 13)} ${colWidth} ${colHeight}`;
        console.log(viewBoxProperties);
        shape.setAttribute("viewBox", viewBoxProperties);
        rowHeader.setAttribute("viewBox", rowProperties);
        colHeader.setAttribute("viewBox", colProperties);
      }
    }, false);
    
    const reset = document.getElementById("reset");
    // $("#reset").on("click", (e) => {
    reset.addEventListener("click", (e) => {
      const shape = document.getElementById("box");
      shape.setAttribute("viewBox", originalZoom);
      const rowHeader = document.getElementById("rows");
      rowHeader.setAttribute("viewBox", originalRowZoom);
      const colHeader = document.getElementById("cols");
      colHeader.setAttribute("viewBox", originalColZoom);
      currentZoom = 100;
    }, false);
    
    const box = document.getElementById("box");
    // $("#box").on("mousedown", (e) => {
    box.addEventListener("mousedown", (e) => {
      dragging = true;
      const shape = document.getElementById("box");
      var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
      // dragStart.x = (minx + e.offsetX) / currentZoom;
      // dragStart.y = (miny + e.offsetY) / currentZoom;
      dragStart.x = e.offsetX;
      dragStart.y = e.offsetY;
      console.log(currentZoom);
    }, false);
    
    // $(document).on("mouseup", (e) => {
    document.addEventListener("mouseup", (e) => {
      if (dragging)
        dragging = false;
    }, false);
    
    // $("#box").on("mouseleave", (e) => {
    box.addEventListener("mouseleave", (e) => {
      dragging = false;
    }, false);
    
    // $("#box").on("mousemove", (e) => {
    box.addEventListener("mousemove", (e) => {
      if (dragging) {
        const shape = document.getElementById("box");
        const rowHeader = document.getElementById("rows");
        const colHeader = document.getElementById("cols");
        var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
        var [rowx, rowy, rowWidth, rowHeight] = rowHeader.getAttribute("viewBox").split(" ").map(Number);
        var [colx, coly, colWidth, colHeight] = colHeader.getAttribute("viewBox").split(" ").map(Number);
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
        let rowProperties = `${rowx} ${miny} ${rowWidth} ${rowHeight}`;
        let colProperties = `${minx} ${coly} ${colWidth} ${colHeight}`;
        // console.log(viewBoxProperties);
        shape.setAttribute("viewBox", viewBoxProperties);
        rowHeader.setAttribute("viewBox", rowProperties);
        colHeader.setAttribute("viewBox", colProperties);
      }
    }, false);
});