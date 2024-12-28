import CommunicationController from "./CommunicationController";
import DBController from "./DBController";  

export const getOrderStatus = async (oid, sid) => {
    try {
        console.log("(orderStatusModel) sid: ", sid);
        const query = { sid: sid };
        const orderStatus = await CommunicationController.genericRequest(`/order/${oid}`, 'GET', query, {});   
        console.log('(orderStatusModel) orderStatus: ', orderStatus);
        return orderStatus;
    } catch (error) {
        console.error('Error during order status request: ', error);
        throw error;
        
    }
};

export const getMenuDetails = async (mid, lat, lng, sid) => {
    try {
        const response = await CommunicationController.genericRequest(`/menu/${mid}`, 'GET', { lat, lng, sid }, {});
        console.log('(orderStatusModel) getMenuDetails response: ', response);
        return response;
    } catch (error) {
        throw new Error('Error fetching menu details:', error); 
    }
};
