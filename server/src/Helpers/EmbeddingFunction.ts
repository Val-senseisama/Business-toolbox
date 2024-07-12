
import _CONFIG from "../config/config";
import { Ollama } from 'ollama'
const embeddingModels = _CONFIG.models.filter(model => model.embedding && model.enabled);

// class EmbeddingFunction {
//     private api_key: string;
//     constructor(api_key?: string) {
//         this.api_key = api_key;
//     }
class EmbeddingFunction {
    private api_key: string = '';  
    constructor(api_key?: string) {
        this.api_key = api_key || '';  
    }

    public async generate(texts: string[]): Promise<number[][]> {
        let models = embeddingModels;
        models.sort(() => Math.random() - 0.5);
        const ollama = new Ollama({ host: models[0].baseURL });
        const output = [];
        for (const text of texts) {
            const response = await ollama.embeddings({
                model: models[0].model,
                prompt: texts[0]
            })
            output.push(response.embedding)
        }
        // do things to turn texts into embeddings with an api_key perhaps
        return output;
    }
}
export default EmbeddingFunction