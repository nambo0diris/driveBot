function passport_number() {
    // 4222155655
    let number = Math.random().toFixed(10).toString().slice(2);
    return `${number}`;
}

export default passport_number;