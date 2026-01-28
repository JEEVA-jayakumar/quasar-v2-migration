export const additionalTidFromMars = (state) => {
  console.log("Getter Datas------------------>"+JSON.stringify(state.TidFromMars))
  return state.TidFromMars;
}

export const additionalTidFromBackEnd = (state) => {
  return state.TidFromBackEnd;
}