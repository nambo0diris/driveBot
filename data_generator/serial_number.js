function serial_number(subjectNumber) {
    // 99  BN  264195
    let number = Math.random().toFixed(6).toString().slice(2);
    return `${subjectNumber} DD ${number}`;
}

export default serial_number;