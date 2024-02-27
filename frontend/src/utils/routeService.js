import webapi from '../services/api';
import sock from '../services/ws'


const postData = () => {
    return webapi.CreatePost();
}

const fetchData = () => {
    return webapi.FetchPost();
}

const updateData = () => {
    return webapi.UpdatePost();
}

const connectData = () => {
    return sock.WebSocketComponent();
}


export default {
    postData,
    fetchData,
    updateData,
    connectData
}