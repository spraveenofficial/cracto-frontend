// Centralized API configuration
export const API_CONFIG = {
    OPENAI_API_KEY: 'TEXT',
    OPENAI_BASE_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7
};

// Helper function to get API key
export const getApiKey = () => {
    return API_CONFIG.OPENAI_API_KEY;
};

// Helper function to check if API key is configured
export const isApiKeyConfigured = () => {
    return API_CONFIG.OPENAI_API_KEY && API_CONFIG.OPENAI_API_KEY !== 'YOUR_NEW_API_KEY_HERE';
};