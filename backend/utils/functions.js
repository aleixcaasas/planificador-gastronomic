function convertTitle(text) {
    return text.toLowerCase().replace(/ /g, '-')
}

module.exports = { convertTitle }
