function removeComments(code) {
    return code.replace(
        /(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g,
        (match, quote) => (quote ? match : "")
    );
}

// Example usage
const code = `
    const a = "This is a string with a // fake comment";
    const b = 'Another string with /* not a comment */';
    // This is a single-line comment
    /*
        This is a
        multi-line comment
    */
    const c = 42; // Another comment
`;

console.log(removeComments(code));