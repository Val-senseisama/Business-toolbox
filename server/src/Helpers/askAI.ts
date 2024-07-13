import OpenAI from 'openai';
import CONFIG from '../config/config';
import fs from 'fs';
import { ImageGenerateParams } from 'openai/resources/images.js';
import google from 'googlethis';
import axios from 'axios';
import { ModelType } from './types';
import { ChatCompletionMessageParam } from 'openai/resources';


interface ExtendedImageGenerateParams extends ImageGenerateParams {
    revise?: boolean;
}

const excludedSearchWebsites = [
    'stock',
    '123rf',
    'alamy',
    'photo',
    'foto',
    'dreamstime',
    'flickr',
    'fotki',
    'wallpaper',
    'unsplash',
    'pixabay',
    'shutter',
    'adobe',
    'vecteexzy',
    'getty',
    'pixta',
    'pngtree',
    'freePixel'
]

const proposers: ModelType[] = CONFIG.models.filter(model => model.proposer === true);
const aggregator: ModelType | undefined = CONFIG.models.find(model => model.aggregator === true);
const vision: ModelType | undefined = CONFIG.models.find(model => model.vision === true);
const image: ModelType | undefined = CONFIG.models.find(model => model.image === true);
const storybook: ModelType | undefined = CONFIG.models.find(model => model.speech === true && model.storybook === true);
const textbook: ModelType | undefined = CONFIG.models.find(model => model.speech === true && model.textbook === true);

const AGGREGATOR = aggregator ? {
    client: new OpenAI({
        baseURL: aggregator.baseURL,
        apiKey: aggregator.apiKey
    }),
    ...aggregator
} : null

const PROPOSERS: Record<string, any>[] = [];

for (const model of proposers) {
    PROPOSERS.push({
        client: new OpenAI({
            baseURL: model.baseURL,
            apiKey: model.apiKey
        }),
        ...model
    })
}

const VISION = vision ? {
    client: new OpenAI({
        baseURL: vision.baseURL,
        apiKey: vision.apiKey
    }),
    ...vision
} : null;

const IMAGE = image ? {
    client: new OpenAI({
        baseURL: image.baseURL,
        apiKey: image.apiKey
    }),
    ...image
} : null;

const STORYBOOK = storybook ? {
    client: new OpenAI({
        baseURL: storybook.baseURL,
        apiKey: storybook.apiKey
    }),
    ...storybook
} : null;

const TEXTBOOK = textbook ? {
    client: new OpenAI({
        baseURL: textbook.baseURL,
        apiKey: textbook.apiKey
    }),
    ...textbook
} : null



export async function askAI({ prompt, systemPrompt = '', json = false }: { prompt: string, systemPrompt?: string, json?: boolean }): Promise<string | null> {
    if (!AGGREGATOR) {
        return '';
    }
    const response_format: Record<string, any> = json ? { response_format: { "type": "json_object" } } : {}
    const messages: ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
        messages.push({
            role: 'system',
            content: systemPrompt
        })
    }
    messages.push({
        role: 'user',
        content: prompt
    })
    const completion = await AGGREGATOR.client.chat.completions.create({
        messages,
        model: AGGREGATOR.model,
        ...response_format,
        max_tokens: AGGREGATOR.max_tokens,
    });
    return completion.choices[0].message.content;
}


export async function askMOA({ prompt, systemPrompt = '', json = false }: { prompt: string, systemPrompt?: string, json?: boolean }): Promise<string | null> {
    if (!AGGREGATOR) {
        return '';
    }
    const pending = [];
    const response_format: Record<string, any> = json ? { response_format: { "type": "json_object" } } : {};

    for (const model of PROPOSERS) {
        const messages = [];
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            })
        }
        messages.push({
            role: 'user',
            content: prompt
        })
        const completion = model.client.chat.completions.create({
            messages,
            model: model.model,
            ...response_format,
            max_tokens: model.max_tokens,
        });
        pending.push(completion);
    }
    const proposersResponses = await Promise.all(pending);


    const completion = await AGGREGATOR.client.chat.completions.create({
        messages: [
            {
                'role': 'system',
                'content': `You are a helpful assistant. You have been provided with a set of responses from various open-source models to the original user query. Your task is to synthesize these responses into a single, high-quality, all-encompassing response in the format expected from the open source models. It is crucial to critically evaluate the information provided in the original user query and the responses, recognizing that some of the responses may be incomplete or incorrect. Your response should not simply replicate the given answers but should offer a refined, accurate, and comprehensive reply to the original user query. Ensure your response is well-structured, coherent, and adheres to the highest standards of accuracy and reliability. Always provide your response in the exact output format requested by the original user query.`
            },
            {
                'role': 'user',
                'content': `original user query to open-source models: \n\n${systemPrompt}\n${prompt}\n\n\n\nResponses from open-source models:\n----------\n${proposersResponses.map(x => x.choices[0].message.content).join('\n----------\n')}`
            }
        ],
        model: AGGREGATOR.model,
        ...response_format,
        max_tokens: AGGREGATOR.max_tokens,
    })

    let outData = completion.choices[0].message.content ?? '';
    if (!json) {
        return outData;
    }


    // Test for valid json
    try {
        JSON.parse(outData);
    } catch (e) {
        for (const response of proposersResponses) {
            try {
                const text = JSON.parse(response.choices[0].message.content);
                outData = response.choices[0].message.content;
                break;
            } catch (e) {
                console.log(e)
            }
        }

    }

    return outData;
}

export async function askVision({ prompt, base64ImageOrURL }: Record<string, string>): Promise<string | null> {
    if (!VISION) {
        return '';
    }
    const completion = await VISION.client.chat.completions.create({
        model: VISION.model,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    {
                        type: "image_url",
                        image_url: {
                            "url": base64ImageOrURL,
                        },
                    },
                ],
            },
        ],
    });
    return completion.choices[0].message.content;
}


export async function generateTextbookSpeech({ text, filepath }: Record<string, string>): Promise<string> {
    if (!TEXTBOOK) {
        return ''
    }
    const mp3 = await TEXTBOOK.client.audio.speech.create({
        model: "tts-1",
        voice: TEXTBOOK.model as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
        input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(filepath, buffer);
    return filepath;
}


export async function generateStorybookSpeech({ text, filepath }: Record<string, string>): Promise<boolean> {
    if (!STORYBOOK) {
        return false
    }
    const mp3 = await STORYBOOK.client.audio.speech.create({
        model: "tts-1",
        voice: STORYBOOK.model as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
        input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(filepath, buffer);
    return true;
}

export async function generateImage({ prompt, filepath, size = '1024x1024', imagePath = '', revise = true }: { prompt: string, filepath: string, size?: string, imagePath?: string, revise?: boolean }): Promise<string> {
    if (!IMAGE) {
        return ''
    }
    let optionals: Record<string, any> = {};
    if (imagePath) optionals.image = fs.readFileSync(imagePath, { encoding: 'base64' });

    const completion = await IMAGE.client.images.generate({
        model: IMAGE.model, //Optional
        prompt,
        revise, //Use llm to improve your prompt like Magic Prompt on Ideogram
        ...optionals,
        n: 1, //Number of images to return
        size,
    } as ExtendedImageGenerateParams);
    let response: string = completion.data[0].url ?? '';
    const buffer = Buffer.from(response, 'base64');
    // Write the buffer to a file
    fs.writeFileSync(filepath, buffer);
    // console.log(completion.data[0].revised_prompt)
    return filepath;
}

const selectBestSuitedImage = async (imageArray: Record<string, any>[], subject: string, age: number, description: string) => {
    const prompt = `From the JSON array of image urls and descriptions below, which single url is the most suitable for use in a "${subject}" subject class for ${age}-year-old students to depict "${description}".
    Do not correct or modify the url.
    Do not include the description in your response.
    Respond with a json containing only the exact url thats best suited for use in a "${subject}" subject class for ${age}-year-old students to depict "${description}" in the format: {
    "url":"..."
    }

    \`\`\`
    JSON array: 
    ${JSON.stringify(imageArray, null, 2)}`;
    try {
        const completion = await askAI({ prompt, systemPrompt: `You are a helpful "${subject}" teacher.`, json: true });

        return completion;
    } catch (error) {
        return null
    }
}


export async function downloadImageAsBase64(url: string) {
    try {
        // Fetch the image from the URL
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        // Convert the image data to a Buffer
        const buffer = Buffer.from(response.data, 'binary');

        // Convert the Buffer to a base64 string
        const base64Image = buffer.toString('base64');

        // Optionally, add the appropriate data URI prefix for images (e.g., "data:image/jpeg;base64,")
        const mimeType = response.headers['content-type'];

        return `data:${mimeType};base64,` + base64Image;
    } catch (error) {
        return null;
    }
}


// returns an image url
export const searchGoogleImages = async ({ subject, age, description }: { subject: string, age: number, description: string }): Promise<string> => {
    // Download the suitable images from google while excluding any url containing the excludedWebsites list
    const allImages = await google.image(`${description} -${excludedSearchWebsites.join(' -')}`, { safe: true });
    let images: Record<string, any>[] = allImages
        .filter(image => {
            if (!image.url.includes('jpg') && !image.url.includes('png') && !image.url.includes('jpeg')) {
                return false;
            }
            if (image.url.includes('thumbnail') || image.url.includes('product')) return false;
            if (image.width <= 500 || image.height <= 500) return false
            return true;
        })
        .map(image => {
            return { url: image.url }
        });

    for (const image of images) {
        try {
            image.description = await askVision({
                prompt: `Describe this image in high detail.`,
                base64ImageOrURL: image.url
            });
        } catch (error) {
            continue
        }
    }

    images = images.filter(image => {
        if (!image.description) return false
        return true
    })


    try {
        const best = await selectBestSuitedImage(images, subject, age, description) ?? '';
        const jsonz = JSON.parse(best)
        return jsonz.url;
    } catch (error) {
        return '#'
    }
}