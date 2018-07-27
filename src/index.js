import Lottery from './Lottery'

const install = function (Vue, opts = {}) {
    Vue.component(Lottery.name, Lottery)
}

export default {
    install
}