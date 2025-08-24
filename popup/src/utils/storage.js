// Storage utilities for managing highlights

export const getHighlights = async () => {
    try {
        // Check if chrome.storage is available
        if (!chrome || !chrome.storage) {
            console.error('Chrome storage API not available')
            return []
        }

        const result = await chrome.storage.local.get(['highlights'])
        console.log('Loaded highlights:', result.highlights?.length || 0)
        return result.highlights || []
    } catch (error) {
        console.error('Error getting highlights:', error)
        return []
    }
}

export const saveHighlight = async (highlight) => {
    try {
        const highlights = await getHighlights()
        highlights.unshift(highlight)
        await chrome.storage.local.set({ highlights })
        return true
    } catch (error) {
        console.error('Error saving highlight:', error)
        return false
    }
}

export const deleteHighlight = async (id) => {
    try {
        const highlights = await getHighlights()
        const filteredHighlights = highlights.filter(h => h.id !== id)
        await chrome.storage.local.set({ highlights: filteredHighlights })
        return true
    } catch (error) {
        console.error('Error deleting highlight:', error)
        return false
    }
}

export const updateHighlight = async (id, updates) => {
    try {
        const highlights = await getHighlights()
        const updatedHighlights = highlights.map(h =>
            h.id === id ? { ...h, ...updates } : h
        )
        await chrome.storage.local.set({ highlights: updatedHighlights })
        return true
    } catch (error) {
        console.error('Error updating highlight:', error)
        return false
    }
}