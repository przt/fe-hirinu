import axios from "axios";
import config from '../config.json';
import authHeader from '../utils/axiosHeader';

export class WorkexperienceService {

    async getWorkexperience(urlParam){
        if (urlParam){
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'workexperience/' + urlParam, {headers: authHeader()})
                let data = res.data;
                return data
            } catch (error){
                return error.response;
            }
        } else {
            try {
                let res = await axios.get(config.BACKEND_API_URL + 'workexperience/', { headers: authHeader() })
                let data = res.data;
                return data
            } catch (error) {
                return error.response
            }
        }
    }

    async postWorkexperience(payload) {
        try {
            let res = await axios.post(config.BACKEND_API_URL + 'workexperience/', payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async updateWorkexperience(id, payload) {
        try {
            let res = await axios.put(config.BACKEND_API_URL + `workexperience/${id}`, payload, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }

    async deleteTbUrl(id) {
        try {
            let res = await axios.delete(config.BACKEND_API_URL + `workexperience/${id}`, { headers: authHeader() })
            let data = res.data;
            return data;
        } catch (error) {
            // console.log(error.response);
            return error.response;
        }
    }
}