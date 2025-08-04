// main.js
import { loadData } from "./data.js";
import { scene1, scene2, scene3 } from "./scenes.js";

// Select once
const svg        = d3.select("svg");
const annotation = d3.select("#annotation");
const buttons    = d3.selectAll("nav button");

let globalData = [];

// 1. Load & parse the CSV
loadData().then(data => {
  globalData = data;
  // render the first scene by default
  scene1(svg, globalData, annotation);
  buttons.filter(d => d3.select(d3.event.currentTarget).attr("data-scene") === "scene1")
         .classed("active", true);
});

// 2. Wire up the buttons
buttons.on("click", function(event) {
  const scene = this.dataset.scene;

  // reset active class
  buttons.classed("active", false);
  d3.select(this).classed("active", true);

  // call the right scene
  if (scene === "scene1") scene1(svg, globalData, annotation);
  if (scene === "scene2") scene2(svg, globalData, annotation);
  if (scene === "scene3") scene3(svg, globalData, annotation);
});
