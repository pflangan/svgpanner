const originalZoom = "0 0 100 100";
const [oMinX, oMinY, oWidth, oHeight] = originalZoom.split(" ").map(Number);
var dragging = false;
var dragStart = {
  x: null, y: null
};
$(document).ready(() => {
    $('#zoomout').on('click', (e) => {
      const shape = document.getElementById("box");
      var viewBoxProperties = shape.getAttribute("viewBox");
      console.log(viewBoxProperties);
      var [minx, miny, width, height] = shape.getAttribute("viewBox").split(" ").map(Number);
      // console.log(minx);
      width += 10;
      // minx += 10;
      // miny += 10;
      height +=10;
      width = Math.min(100, height);
      height = Math.min(100, height);
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
      width -= 10;
      // minx -= 10;
      // miny -= 10;
      height -=10;
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
      dragStart.x = (minx + e.offsetX) / currentZoom;
      dragStart.y = (miny + e.offsetY) / currentZoom;
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
        let endX = (minx + e.offsetX) / currentZoom;
        let endY = (miny + e.offsetY) / currentZoom;
    //     ${eventLeft / width * originalWidth - originalWidth / 4} 
        let diffX = dragStart.x - endX;
        let diffY = dragStart.y - endY;
    
        var viewBoxProperties = shape.getAttribute("viewBox");
        console.log(diffX, diffY);
        console.log(viewBoxProperties);
        if ((minx + diffX) < oWidth && (minx + diffX) >= 0)
          minx += diffX;
        if ((miny + diffY) < oHeight && (miny + diffY) >= 0)
          miny += diffY;
        
        viewBoxProperties = `${minx} ${miny} ${width} ${height}`;
        // console.log(viewBoxProperties);
        shape.setAttribute("viewBox", viewBoxProperties);
      }
    });
})