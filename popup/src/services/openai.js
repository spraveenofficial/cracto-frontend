import { API_CONFIG, getApiKey, isApiKeyConfigured } from '../config/api.js';

export const generateSummary = async (text, domain = '') => {
    if (!isApiKeyConfigured()) {
        throw new Error('OpenAI API key not configured. Please update your API key in src/config/api.js');
    }

    const prompt = `Please provide a concise summary (2-3 sentences) of the following text highlight${domain ? ` from ${domain}` : ''}:\n\n"${text}"\n\nSummary:`;

    try {
        const response = await fetch(API_CONFIG.OPENAI_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getApiKey()}`
            },
            body: JSON.stringify({
                model: API_CONFIG.MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: API_CONFIG.MAX_TOKENS,
                temperature: API_CONFIG.TEMPERATURE
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw new Error(`Failed to generate summary: ${error.message}`);
    }
};