import { OpenAI } from "langchain/llms/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
import { FaissStore } from "langchain/vectorstores/faiss";
import { config } from "dotenv";

config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const model = new OpenAI({
  openAIApiKey: OPENAI_API_KEY,
  temperature: 0.6,
});

export default async function getCompletion(userMessage) {
  const loader = new TextLoader("./data/info.txt");

  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    chunkSize: 300,
  });

  const documents = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings();
  const vectorstore = await FaissStore.fromDocuments(documents, embeddings);
  await vectorstore.save("./");

  const vectorStore = await FaissStore.load("./", embeddings);
  const vectorStoreRetriever = vectorStore.asRetriever();
  const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);

  const res = await chain.call({
    query: userMessage,
  });

  return res.text;
}
