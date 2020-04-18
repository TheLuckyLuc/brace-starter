// If I find a cleaner way to write this, I'll be sure to tidy it up. Does the trick for now.

module.exports = (string) => {
	const sanitisedString = string
		.toLowerCase()
		.replace(/[^-0-9A-Za-z_ ]/g, '') // Removes any characters apart from alphanumeric characters, hyphens, underscores or spaces
		.replace(/\s{2,}/g, ' ') // Replaces repeated spaces with just one space
		.replace(/^\s*(\S.*\S)\s*$/, '$1') // Removes any leading or trailing spaces
		.replace(/\s/g, '-'); // Finally replaces spaces with hyphens

	return sanitisedString;
};
