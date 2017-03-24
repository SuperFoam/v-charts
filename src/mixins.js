const chartMixin = {
  props: {
    data: { type: [Object, Array], default: null },
    settings: { type: Object, default () { return {} } },
    width: { type: String, default: 'auto' },
    height: { type: String, default: '400px' },
    beforeConfig: { type: Function },
    afterConfig: { type: Function },
    events: { type: Object }
  },

  watch: {
    data (v) {
      const dataKeys = Object.keys(v)
      const dataKeyProp = v.key
      if ((dataKeyProp && Array.isArray(dataKeyProp) && dataKeyProp.length) || dataKeys.length) {
        this.processData(v)
      } else {
        this.showLoading('data-empty')
      }
    }
  },

  computed: {
    canvasStyle () {
      return { width: this.width, height: this.height }
    }
  },

  methods: {
    dataHandler (data) {
      if (this.beforeConfig) data = this.beforeConfig(data)
      let options = this.chartHandler(data, this.settings)
      if (this.afterConfig) options = this.afterConfig(options)
      this.echarts.setOption(options, true)
    },

    init () {
      if (this.echarts) return
      this.echarts = this.echartsLib.init(this.$refs.canvas, 've-chart')
      if (this.data) this.dataHandler(this.data)
      if (this.events) this.bindEvents()
    },

    bindEvents () {
      Object.keys(this.events).forEach(event => {
        this.echarts.on(event, this.events[event])
      })
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.init()
      window.addEventListener('resize', this.echarts.resize)
    })
  },

  beforeDestory () {
    window.removeEventListener('resize', this.echarts.resize)
    this.echarts.dispose()
  }
}

export default chartMixin
