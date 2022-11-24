import post_code from "./post_code.js";
import serial_number from "./serial_number.js";
 const get_places = async () => {

    const addresses = {
        cities: [
             {
                name: "Sankt-Peterburg",
                streets: ["Desantnikov street", "Geroev street", "Kuzmina street", "Jukova street", "Kazakova street"],
                house_numbers: ["12/2-366", "11-366", "45/3-145", "65-13", "23/2-422", "41/4-654","11/2-54","71/3-12", "32-117", "31-162","12-16", "5-326", "49-145", "61-13", "21/7-11", "22/3-24","41-4","54/3-11", "33-141", "32-5"],
                subject_id: "78"
            },
             {
                name: "Moskva",
                streets: ["Dovatora street", "Efimova street", "Shuhova street", "Klimashkina street", "Mashkova street"],
                house_numbers: ["12/2-366", "11-366", "45/3-145", "65-13", "23/2-422", "41/4-654","11/2-54","71/3-12", "32-117", "31-162","17/2-366", "5-326", "49/3-145", "61-13", "23/2-412", "41/4-254","11/2-34","76/3-12", "42-111", "21-112"],
                subject_id: "99"
            },
            {
                name: "Ekaterinburg",
                streets: ["Solnechnaya street", "Sovetskaya street", "Mira street", "Gagarina street", "Malisheva street"],
                house_numbers: ["11/2-366", "11-316", "45/3-125", "15-13", "13/2-412", "21/4-654","5/2-54","66/3-12", "15-117", "31-153","17/2-111", "5-326", "39/3-145", "71-13", "23/2-66", "41/4-45","11/2-23","21/3-12", "65-111", "21-112"],
                subject_id: "96"
            },
            {
                name: "Volgograd",
                streets: ["Eletskaya street", "Rostovskaya street", "Kuznetskaya street", "Vyazemskaya street", "Lavochkina street"],
                house_numbers: ["13/2-366", "12-316", "35/3-115", "16-13", "13/2-532", "21/4-344","5/2-111","11/3-12", "23-117", "31-153","17/2-111", "5-326", "39/3-145", "71-13", "23/2-66", "41/4-45","11/2-23","21/3-12", "65-111", "21-112"],
                subject_id: "34"
            },
        ]
    }

    async function random_number(length) {
        const number = Math.random().toFixed(3);
        const z = number * 1000;
        if (z > length - 1) {
            return random_number(length);
        }
        return  z;
    }
    try {
        let address = {};
        await random_number(addresses.cities.length).then(async random => {
            console.log(random)
            const city = addresses.cities[random];
            console.log(city)
            address.city_of_birth = city.name;
            address.country_of_birth = "Russia";
            await random_number(city.streets.length).then(async living_street_idx => {
                await random_number(city.house_numbers.length).then(async house_number_idx => {
                    address.living_city = city.name;
                    address.living_country = "Russia";
                    address.living_street = city.streets[living_street_idx];
                    address.house_number = city.house_numbers[house_number_idx];
                    address.subject_id = serial_number(city.subject_id);
                    address.living_index = post_code();
                });
            })
        });
        return address;
    } catch (e) {
        console.log(e)
    }
}
export default get_places;