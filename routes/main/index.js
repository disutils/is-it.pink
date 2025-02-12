const express = require('express');
const router = express.Router();
const { name, pfp, support } = require('../../configuration/config.json');


function checkIfPink(color) {
    const hexToRgb = (hex) => {
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        return { r, g, b };
    };

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }
        return { h, s: s * 100, l: l * 100 };
    }

    if (!/^#([0-9A-F]{6})$/i.test(color)) return false;
    let { r, g, b } = hexToRgb(color);
    let { h, s, l } = rgbToHsl(r, g, b);

    return (
        ((h >= 290 && h <= 360) || (h >= 0 && h <= 20)) && // Wider pink hue range
        s > 20 &&  // Allow more desaturated pinks
        l > 30 && l < 90  // Accept lighter and darker pinks
    );
}



function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

router.get('/', (req, res) => {
    const randomColor = getRandomColor();
    res.render('main/index', { color: randomColor, name, pfp, support });
});

router.post('/guess', (req, res) => {
    const { guess, color } = req.body;
    const isPink = checkIfPink(color);
    let result, message;

    if (isPink && guess === 'yes') {
        result = true;
        message = '😁 Correct!';
    } else if (isPink && guess === 'no') {
        result = false;
        message = '😞 Wrong! Try again!';
    } else if (!isPink && guess === 'no') {
        result = true;
        message = '😐 Correct, try to make it pink!';
    } else {
        result = false;
        message = '😞 Wrong! Try again!';
    }

    res.json({ result, isPink, message });
});

router.get('/newColor', (req, res) => {
    const randomColor = getRandomColor();
    res.json({ color: randomColor });
});

module.exports = router;
