function id_code() {
    // 42221DSK55
    let number1 = Math.random().toFixed(5).toString().slice(2);
    let number2 = Math.random().toFixed(2).toString().slice(2);
    return `${number1}DSK${number2}`;
}

export default id_code;