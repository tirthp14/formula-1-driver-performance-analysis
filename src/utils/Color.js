// colorUtils.js

/**
 * Convert hex color to RGB format.
 * @param {string} hex - The hex color string.
 * @returns {object} The RGB color object.
 */
const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    
    return { r, g, b };
};

/**
 * Convert RGB color to hex format.
 * @param {number} r - The red component.
 * @param {number} g - The green component.
 * @param {number} b - The blue component.
 * @returns {string} The hex color string.
 */
const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Get the opposite color on the color wheel.
 * @param {string} hex - The original hex color.
 * @returns {string} The hex color of the opposite color.
 */
export const getOppositeColor = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const oppositeColor = rgbToHex(255 - r, 255 - g, 255 - b);
    return oppositeColor;
};