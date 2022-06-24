function ColorToHex(color) {
	var hexadecimal = color.toString(16);
	return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}

function ConvertRGBtoHex(red, green, blue) {
	return '#' + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

function HexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

module.exports = {
	ColorToHex,
	HexToRgb,
	ConvertRGBtoHex,
};
