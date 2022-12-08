import get_places from "./get_places.js";
import CyrillicToTranslit from "cyrillic-to-translit-js";

const get_random_data = async () => {
    const cyrillicToTranslit = new CyrillicToTranslit();
    const data = await get_places();
    const props = {
        "city_of_birth": cyrillicToTranslit.transform(data.city_of_birth).toUpperCase(),
        "country_of_birth": cyrillicToTranslit.transform(data.country_of_birth).toUpperCase(),
        "living_street": cyrillicToTranslit.transform(data.living_street).toUpperCase(),
        "living_country": cyrillicToTranslit.transform(data.living_country).toUpperCase(),
        "house_number": data.house_number,
        "living_index": data.living_index,
        "living_city": cyrillicToTranslit.transform(data.living_city).toUpperCase(),
        "subject_id": data.subject_id,
    }
    return props;
}

export default get_random_data;