const { OpenAI } = require('openai');

export const ChatAPIcall = async () => {
    console.log(`Sending chatgpt request!`)
    // Initialize the OpenAI instance with your API key
    // const openai = new OpenAI(process.env.OPENAI_SECRET_KEY);
    const openai = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true  })

    // Sample prompt to start the conversation
    // const prompt = "Q: What is the meaning of life?\nA:";
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-3.5-turbo",
    });

    const chatResult = chatCompletion
    console.log(`chat Full message: ${JSON.stringify(chatResult)}`)
    console.log(`chat content: ${JSON.stringify(chatResult['choices'][0]['message']['content'])}`)

    // console.log(`test`)
}
