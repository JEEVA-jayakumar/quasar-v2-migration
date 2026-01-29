const additionalTidFromMars = (state) => {
  console.log("Getter Datas------------------>"+JSON.stringify(state.TidFromMars))
  return state.TidFromMars;
}

const additionalTidFromBackEnd = (state) => {
  return state.TidFromBackEnd;
}

export default {
  additionalTidFromMars,
  additionalTidFromBackEnd
};
