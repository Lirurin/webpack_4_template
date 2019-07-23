export default {
    state: {
        message: 'im from store'
    },
    mutations: {},
    actions: {},
    getters: {
        getMessage(state) {
            return state.message
        }
    }
}