const incrementStringId = (currentId) => {
    if(!currentId){
        return null
    }
    // Extract the numeric part from the string
    const numericPart = currentId?.slice(1);

    // Convert the numeric part to an integer and increment it
    const incrementedNumber = parseInt(numericPart, 10) + 1;

    // Convert the incremented number back to a string, and pad it with leading zeros
    const incrementedString = incrementedNumber?.toString()?.padStart(numericPart?.length, '0');

    // Combine the original prefix with the incremented numeric part
    return incrementedString;
};

module.exports = incrementStringId
