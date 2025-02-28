import React, { useState, useRef, useEffect } from "react";
import Sketch from "react-p5";
import { Sun, Moon } from "lucide-react"; // Icons for theme toggle

const ArtGenerator = () => {
  const [artType, setArtType] = useState("abstract");
  const [color, setColor] = useState("#000000");
  const [darkMode, setDarkMode] = useState(false); // Theme state
  const canvasRef = useRef(null);

  // Load theme preference from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(400, 400).parent(canvasParentRef);
    canvasRef.current = p5;
    generateArt(p5);
  };

  const generateArt = (p5) => {
    p5.background(255);

    let artColor =
      artType === "fractals"
        ? p5.color(color)
        : p5.color(p5.random(255), p5.random(255), p5.random(255));

    p5.fill(artColor);
    p5.stroke(artColor);

    if (artType === "abstract") {
      for (let i = 0; i < 10; i++) {
        p5.ellipse(p5.random(400), p5.random(400), p5.random(100));
      }
    } else if (artType === "pixel") {
      const pixelSize = 10;
      for (let x = 0; x < 400; x += pixelSize) {
        for (let y = 0; y < 400; y += pixelSize) {
          let pixelColor = p5.color(p5.random(255), p5.random(255), p5.random(255));
          p5.fill(pixelColor);
          p5.noStroke();
          p5.rect(x, y, pixelSize, pixelSize);
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
      const depth = Math.floor(p5.random(3, 6));
      drawFractal(p5, startX, startY, size, depth);
    } else if (artType === "mosaic") {
      drawMosaic(p5);
    }
  };

  const drawFractal = (p5, x, y, len, depth) => {
    if (depth === 0) return;
    p5.rect(x, y, len, len);
    let newLen = len / 3;
    drawFractal(p5, x - newLen, y - newLen, newLen, depth - 1);
    drawFractal(p5, x + len + newLen, y - newLen, newLen, depth - 1);
    drawFractal(p5, x - newLen, y + len + newLen, newLen, depth - 1);
    drawFractal(p5, x + len + newLen, y + len + newLen, newLen, depth - 1);
  };

  const drawMosaic = (p5) => {
    for (let x = 0; x < p5.width; x += 20) {
      for (let y = 0; y < p5.height; y += 20) {
        p5.fill(p5.random(255), p5.random(255), p5.random(255));
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
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Title & Theme Toggle */}
      <div className="w-full flex justify-between items-center max-w-4xl">
        <h1 className="text-3xl font-bold">Web3 Art Generator</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Art Type Selection */}
      <div className="my-4">
        <select
          onChange={(e) => setArtType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="abstract">Abstract</option>
          <option value="pixel">Pixelated</option>
          <option value="lines">Lines</option>
          <option value="fractals">Fractals</option>
          <option value="mosaic">Mosaic/Geometric</option>
        </select>
      </div>

      {/* Color Picker (Only for Fractals) */}
      {artType === "fractals" && (
        <div className="mb-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 border-none rounded-full cursor-pointer"
          />
        </div>
      )}

      {/* Canvas */}
      <div className="w-full max-w-4xl flex justify-center">
        <Sketch setup={setup} />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => generateArt(canvasRef.current)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Generate Art
        </button>
        <button
          onClick={downloadArt}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Download Art
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-4 w-full text-center bg-gray-800 text-white">
        <p className="text-sm">2025 @tonemadureira on X (Antonio Madureira) created this with love</p>
      </footer>
    </div>
  );
};

export default ArtGenerator;
