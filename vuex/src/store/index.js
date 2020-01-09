import Vuex from 'vuex'
import Vue from 'vue'
import todos from './modules/todos'
Node.js, Express, MongoDB & More: The Complete Bootcamp 2020Node.js, Express, MongoDB & More: The Complete Bootcamp 2020

//Vuex

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        todos
    }
})