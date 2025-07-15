import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

app.use(cors());
app.use(express.json());

app.post("/responder", async (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem) return res.status(400).json({ error: "Mensagem é obrigatória" });

  try {
    const response = await axios.post(HUGGING_FACE_API_URL,
      {
        inputs: mensagem,
        parameters: { max_new_tokens: 100 }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json"
        }
      });

    const data = response.data;
    const texto = data[0]?.generated_text || "(Resposta vazia)";
    res.json({ resposta: texto });

  } catch (error) {
    console.error("Erro no backend IA:", error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao gerar resposta" });
  }
});

app.listen(port, () => {
  console.log(`Backend IA rodando na porta ${port}`);
});
