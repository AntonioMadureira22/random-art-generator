import React, { useState, useRef } from "react";
import Sketch from "react-p5";

const ArtGenerator = () => {
  const [artType, setArtType] = useState("abstract");
  const [color, setColor] = useState("#000000"); // State for selected color
  const canvasRef = useRef(null);

  const setup = (p5, canvasParentRef) => {
    const canvas = p5.createCanvas(400, 400).parent(canvasParentRef);
    canvasRef.current = p5;
    generateArt(p5); // Initial art generation
  };

  const generateArt = (p5) => {
    p5.background(255); // Set art background to white

    // For Fractals, use the selected color
    let artColor = artType === "fractals" ? p5.color(color) : p5.color(p5.random(255), p5.random(255), p5.random(255));

    p5.fill(artColor); // Set fill color
    p5.stroke(artColor); // Set stroke color

    if (artType === "abstract") {
      for (let i = 0; i < 10; i++) {
        p5.ellipse(p5.random(400), p5.random(400), p5.random(100));
      }
    } else if (artType === "pixel") {
      const pixelSize = 10; // Size of each pixel block
      for (let x = 0; x < 400; x += pixelSize) {
        for (let y = 0; y < 400; y += pixelSize) {
          let pixelColor = artType === "pixel" ? p5.color(p5.random(255), p5.random(255), p5.random(255)) : p5.color(color);
          p5.fill(pixelColor); // Set the pixel color
          p5.noStroke(); // No border for the pixel blocks
          p5.rect(x, y, pixelSize, pixelSize); // Draw the pixel block
        }
      }
    } else if (artType === "lines") {
      for (let i = 0; i < 20; i++) {
        p5.line(p5.random(400), p5.random(400), p5.random(400), p5.random(400));
      }
    } else if (artType === "fractals") {
      const startX = p5.random(100, 300);
      const startY = p5.random(100, 300);
      const size = p5.random(50, 150);
      const depth = Math.floor(p5.random(3, 6)); // Random depth for variety
      drawFractal(p5, startX, startY, size, depth); // Randomized fractal generation
    } else if (artType === "mosaic") {
      drawMosaic(p5);
    }
  };

  // Fractal Drawing Function (Recursive) with Color
  const drawFractal = (p5, x, y, len, depth) => {
    if (depth === 0) return;
    p5.rect(x, y, len, len); // Draw square
    let newLen = len / 3;
    drawFractal(p5, x - newLen, y - newLen, newLen, depth - 1);
    drawFractal(p5, x + len + newLen, y - newLen, newLen, depth - 1);
    drawFractal(p5, x - newLen, y + len + newLen, newLen, depth - 1);
    drawFractal(p5, x + len + newLen, y + len + newLen, newLen, depth - 1);
  };

  // Mosaic Drawing Function with Random Color
  const drawMosaic = (p5) => {
    for (let x = 0; x < p5.width; x += 20) {
      for (let y = 0; y < p5.height; y += 20) {
        p5.fill(p5.random(255), p5.random(255), p5.random(255)); // Random colors
        p5.rect(x, y, 20, 20);
      }
    }
  };

  const downloadArt = () => {
    if (canvasRef.current) {
      const p5 = canvasRef.current;
      const img = p5.canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = img;
      link.download = `random-art-${artType}.png`;
      link.click();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Web3 Art Generator</h1>

      <div className="mb-6 flex justify-center">
        <select
          onChange={(e) => setArtType(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="abstract">Abstract</option>
          <option value="pixel">Pixelated</option>
          <option value="lines">Lines</option>
          <option value="fractals">Fractals</option>
          <option value="mosaic">Mosaic/Geometric</option>
        </select>
      </div>

      {/* Only show the color picker for Fractals */}
      {artType === "fractals" && (
        <div className="mb-6 flex justify-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 border-none rounded-full cursor-pointer"
          />
        </div>
      )}

      <Sketch setup={setup} />

      <div className="button-container flex justify-center gap-6 mt-6">
        <button
          onClick={() => generateArt(canvasRef.current)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        >
          Generate Art
        </button>
        <button
          onClick={downloadArt}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
        >
          Download Art
        </button>
      </div>
    </div>
  );
};

export default ArtGenerator;
