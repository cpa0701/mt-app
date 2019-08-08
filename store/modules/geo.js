/**
 * Create by chenpengan on 2019/8/8
 */
const state = () => {
  // eslint-disable-next-line no-labels
  position: {}
}
const mutations = {
  setPosition(state, val) {
    state.position = val
  }
}
const actions = {
  setPosition: ({ commit }, position) => {
    commit('setPosition', position)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
