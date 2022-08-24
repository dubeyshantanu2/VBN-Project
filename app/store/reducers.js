const initialState = {
    accessToken: null,
    user_info: null,
    user_id: null,
    first_name: null,
    last_name: null,
    firm_name: null,
    profile_picture: null,
    email: null,
    mobile: null,
    category: null,
    address: null,
    memberSince: null,
    user_id: null,
    website: null,
    chapter_id: null,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case 'LOGIN':
            return {
                ...state, //copy all previous states
                accessToken: action.payload,
                user_info: action.payloadOne,
                user_id: action.payloaduser_id,
                first_name: action.payloadfirst_name,
                last_name: action.payloadlast_name,
                firm_name: action.payloadfirm_name,
                profile_picture: action.payloadprofile_picture,
                email: action.payloademail,
                mobile: action.payloadmobile,
                category: action.payloadcategory,
                address: action.payloadaddress,
                memberSince: action.payloadmemberSince,
                user_id: action.payloaduser_id,
                website: action.payloadwebsite,
                chapter_id: action.payloadchapter_id,
            }

        case 'LOGOUT':
            return {
                ...initialState,
            }
        default:
            return state;
    }
}