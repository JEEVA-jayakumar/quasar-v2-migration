const getAllPrefixDetails = state => {
    console.log("GETTER getAllHostDetails ----->",JSON.stringify(state.AllPrefixDetails))
    return state.AllPrefixDetails;
};


export default {
  getAllPrefixDetails
};
