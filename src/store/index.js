import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false
  },
  getters:{
    loading: states => states.loading,
  },
  mutations: {
    SET_LOADING(st,flag) {
        st.loading = flag
    }
  },
  actions: {
    setLoading({ commit },flag) {
        commit('SET_LOADING', flag)
    }
  },
})