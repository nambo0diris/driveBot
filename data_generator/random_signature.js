function random_signature() {
    function random_number() {
        const number = Math.random().toFixed(1);
        const z = number * 10;

        if (z > 4) {
            return random_number();
        }
        return  z;
    }
    return `${random_number()}`
}

export default random_signature;