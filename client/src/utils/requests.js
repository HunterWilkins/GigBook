import axios from "axios";

export default {
    bookGigAsArtist: data => {
        return axios.post("/api/requests", data);
    },
    getRequestedGigs: data => {
        return axios.get("/api/requests/" + data);
    },
    denyThisRequest: data => {
        return axios.delete("/api/requests/" + data.gigId
         + "/" + data.venueId + "/" + data.artistId);
    },
    confirmThisRequest: data => {
        return axios.put("/api/requests/" + data.gigId
         + "/" + data.venueId + "/" + data.artistId);
    }
}