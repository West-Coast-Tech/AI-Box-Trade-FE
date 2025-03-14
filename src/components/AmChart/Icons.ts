export function createIndicatorIcon(): SVGElement {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("fill", "#ffffff");
  svg.setAttribute("stroke", "#000000");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const path1 = document.createElementNS(svgNS, "path");
  path1.setAttribute("d", "M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34");
  
  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", "18 2 22 6 12 16 8 16 8 12 18 2");

  svg.appendChild(path1);
  svg.appendChild(polygon);

  return svg;
}

export function createTimeIcon(): SVGElement {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("fill", "#ffffff");
  svg.setAttribute("stroke", "#000000");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");

  const polyline = document.createElementNS(svgNS, "polyline");
  polyline.setAttribute("points", "12 6 12 12 16 14");

  svg.appendChild(circle);
  svg.appendChild(polyline);

  return svg;
}
