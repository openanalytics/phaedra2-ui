<script>
import { h } from 'vue'
import HelloWorld from '@/components/views/HelloWorld.vue'
import Dashboard from '@/components/views/Dashboard.vue'
import PlateView from '@/components/views/PlateView.vue'

const routes = {
  '': Dashboard,
  'plate': PlateView,
  'hello': HelloWorld
}

export default {
  name: 'App',
  data() {
    return {
      currentRoute: window.location.pathname.split('/')[1]
    }
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute]
    }
  },
  render () { return h(this.ViewComponent) }
}
</script>