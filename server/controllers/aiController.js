import main from '../config/gemini.js';

export const generatePost = async (req, res) => {
    try {
        const { topic, tone, audience, length } = req.body;

        const prompt = `Write a comprehensive blog post about "${topic}". 
        Tone: ${tone || 'Professional'}. 
        Target Audience: ${audience || 'General'}. 
        Approximate Length: ${length || 'Medium'}.
        Format: Markdown.
        Include a catchy title, introduction, body with subheadings, and conclusion.`;

        const content = await main(prompt);
        res.json({ success: true, content });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate content" });
    }
};

export const optimizeSEO = async (req, res) => {
    try {
        const { content, title } = req.body;

        const prompt = `Analyze the following blog post content and title: "${title}".
        Content: "${content.substring(0, 2000)}..." (truncated for analysis).
        
        Generate a JSON object with:
        1. "title": Optimized SEO title (under 60 chars).
        2. "description": Meta description (under 160 chars).
        3. "keywords": Array of 5-10 relevant SEO keywords.
        4. "tags": Array of 5 relevant tags.
        
        Return ONLY the JSON string.`;

        const result = await main(prompt);
        // Clean up markdown code blocks if AI wraps it
        const jsonStr = result.replace(/```json/g, '').replace(/```/g, '').trim();
        const seoData = JSON.parse(jsonStr);

        res.json({ success: true, data: seoData });
    } catch (error) {
        console.error("AI SEO Error:", error);
        res.status(500).json({ success: false, message: "Failed to optimize SEO" });
    }
};

export const summarizeContent = async (req, res) => {
    try {
        const { content } = req.body;
        const prompt = `Summarize the following text into a short, engaging excerpt (max 2 sentences):\n\n${content.substring(0, 3000)}`;

        const summary = await main(prompt);
        res.json({ success: true, summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to summarize" });
    }
};

export const chatWithAI = async (req, res) => {
    try {
        const { prompt, context } = req.body;

        let systemContext = `You are "Antigravity", an intelligent AI assistant for the QuickBlog platform. 
        Your goal is to help the admin manage their blog, analyze performance, and brainstorm ideas.
        Be helpful, concise, and professional but with a creative flair.
        `;

        if (context) {
            systemContext += `\nHere is the current dashboard context: ${JSON.stringify(context)}`;
        }

        const fullPrompt = `${systemContext}\n\nUser Question: ${prompt}`;

        const response = await main(fullPrompt);
        res.json({ success: true, response });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ success: false, message: "AI is currently offline." });
    }
};
