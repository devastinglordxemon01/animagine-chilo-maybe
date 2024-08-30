//find some anime image generetor like huggingface.co/models/cagliostrolab/animagine-xl-3.1
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const API_KEY = "redwan"; 
const HUGGING_FACE_API_KEY = "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";

app.get("/api/generate", async (req, res) => {
  let prompt = req.query.prompt;
  const apiKey = req.query.apikey;

  if (!prompt) {
    return res.status(400).send("Prompt query parameter is required");
  }

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).send("Invalid API key");
  }

  
  const qualityPrompts = ", (masterpiece), (best quality), (ultra-detailed), (intricate details), (photorealistic), (sharp focus), (high resolution), (cinematic lighting), (perfect composition)";
  prompt += qualityPrompts;

  
  const negativePrompt =
    "blurry, deformed, bad anatomy, unnatural pose, misaligned eyes, text, watermark, signature, extra objects, poorly drawn background, oversaturated, unrealistic lighting";

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1",
      {
        inputs: prompt, 
        parameters: {
          negative_prompt: negativePrompt,
          
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const outputData = response.data;
    res.json({ output: outputData });
  } catch (error) {
    if (error.message === "Image generation timed out") {
      res
        .status(504)
        .send(
          "Image generation timed out. Please try a simpler prompt or try again later."
        );
    } else {
      console.error("Error generating image:", error);
      res
        .status(500)
        .send(
          "Error generating image. Please check your prompt and try again."
        );
    }
  }
});


app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
