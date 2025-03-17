import express from 'express';
import axios from 'axios';

const createCitiesRouter = ({ GEONAMES_USERNAME, GEONAMES_API_URL }) => {
    const router = express.Router();

    console.log("GEONAMES_USERNAME in router:", GEONAMES_USERNAME);
    console.log("GEONAMES_API_URL in router:", GEONAMES_API_URL);

    router.get('/cities', async (req, res) => {
        const { q } = req.query; // Assuming 'q' is the search query parameter
        const url = `${GEONAMES_API_URL}?country=SK&featureClass=P&maxRows=1000&username=${GEONAMES_USERNAME}&name_startsWith=${q}`;

        try {
            console.log('Request URL:', url); // Log the request URL
            const response = await axios.get(url);
            console.log('API response:', response.data); // Log the entire response

            if (!response.data.geonames) {
                console.error('No geonames data found:', response.data);
                return res.status(500).json({ message: 'No geonames data found', data: response.data });
            }

            const cities = response.data.geonames.map(city => ({
                value: city.name,
                label: city.name
            }));
            res.json(cities);
        } catch (error) {
            console.error('Error fetching cities:', error.response ? error.response.data : error.message);
            res.status(500).json({ message: 'Error fetching cities', error: error.message });
        }
    });

    router.get('/districts', async (req, res) => {
        const { q } = req.query; // Assuming 'q' is the search query parameter
        const url = `${GEONAMES_API_URL}?country=SK&featureClass=A&fcode=ADM2&maxRows=1000&username=${GEONAMES_USERNAME}&name_startsWith=${q}`;

        try {
            console.log('Request URL:', url); // Log the request URL
            const response = await axios.get(url);
            console.log('API response:', response.data); // Log the entire response

            if (!response.data.geonames) {
                console.error('No geonames data found:', response.data);
                return res.status(500).json({ message: 'No geonames data found', data: response.data });
            }

            const districts = response.data.geonames.map(district => ({
                value: district.name,
                label: district.name,
            }));
            res.json(districts);
        } catch (error) {
            console.error('Error fetching districts:', error.response ? error.response.data : error.message);
            res.status(500).json({ message: 'Error fetching districts', error: error.message });
        }
    });

    return router;
};

export { createCitiesRouter as CitiesRouter };
