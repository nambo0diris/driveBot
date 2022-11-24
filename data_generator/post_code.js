function post_code() {
    function random_number() {
        const number = Math.random().toFixed(3);
        const z = number * 1000;

        if (z < 100 || z > 199) {
            return random_number();
        }
        return  z;
    }
    return `${random_number()}${random_number()}`
}


export default post_code;
