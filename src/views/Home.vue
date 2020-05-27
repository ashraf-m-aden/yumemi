<template>
  <div class="container">
    <div
      v-show="loading"
      class="row bg-secondary text-light notification text-center"
    >
      <div class="col-12">
        データのロード....
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        YUMEMI CHALLENGE
        <hr />
      </div>
      <div class="col-12 m-3">
        <div
          class="form-check form-check-inline"
          v-for="(pref, index) in prefectures"
          :key="index"
        >
          <input
            class="form-check-input"
            type="checkbox"
            id="inlineCheckbox1"
            :value="pref.prefCode"
            @change="showData($event, pref)"
          />
          <label class="form-check-label" for="inlineCheckbox1">{{
            pref.prefName
          }}</label>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <GChart
          v-show="data"
          type="LineChart"
          :data="chartData"
          :options="chartOptions"
        />
        <div v-show="!data" class="card border-info card-body">
          人口を見るようにをチェクください
        </div>
      </div>
    </div>
    <div class="row footer mb-3">
      <div class="col-12">
        アシュラフ
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { GChart } from 'vue-google-charts'
import axios from 'axios'
export default {
  components: {
    GChart
  },
  data () {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [
        ['Year'],
        ['1960'],
        ['1965'],
        ['1970'],
        ['1975'],
        ['1980'],
        ['1985'],
        ['1990'],
        ['1995'],
        ['2000'],
        ['2005'],
        ['2010'],
        ['2015'],
        ['2020'],
        ['2025'],
        ['2030'],
        ['2035'],
        ['2040'],
        ['2045']
      ],
      loading: false,
      chartOptions: {
        chart: {
          title: 'Yumemi challenge',
          subtitle: "Japan's prefectures population growth: 1960-2045"
        }
      },
      prefectures: []
    }
  },
  mounted () {
    axios
      .get('https://opendata.resas-portal.go.jp/api/v1/prefectures')
      .then(response => {
        this.prefectures = response.data.result
      })
  },
  methods: {
    fetchData (prefCode) {
      return axios
        .get(
          'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=' +
            prefCode
        )
        .then(response => {
          var tab = []
          const datas = response.data.result.data
          datas.forEach(element => {
            element.data.forEach(data => {
              if (tab[data.year] === null || tab[data.year] === undefined) {
                tab[data.year] = data.value
              } else {
                tab[data.year] += data.value
              }
            })
          })
          var finalTab = {}
          for (let index = 0; index < tab.length; index++) {
            if (
              tab[index] !== 0 &&
              tab[index] !== undefined &&
              tab[index] !== null
            ) {
              finalTab[index] = tab[index]
            }
          }
          this.prefectures.forEach(element => {
            if (element.prefCode === prefCode) {
              finalTab.name = element.prefName
            }
          })
          return finalTab
        })
    },
    async showData (event, pref) {
      this.loading = true
      if (event.srcElement.checked) {
        const result = await this.fetchData(pref.prefCode)
        this.chartData[0].push(result.name)
        const years = Object.keys(result)
        for (let index = 0; index < years.length; index++) {
          for (let i = 1; i < this.chartData.length; i++) {
            if (this.chartData[i][0] === years[index]) {
              this.chartData[i].push(result[years[index]])
              break
            } else if (years[index] === 'name') {
              break
            }
          }
        }
        this.loading = false
      } else {
        var target = 0
        for (let i = 0; i < this.chartData[0].length; i++) {
          if (this.chartData[0][i] === pref.prefName) {
            target = i
            break
          }
        }
        for (let index = 0; index < this.chartData.length; index++) {
          this.chartData[index].splice(target, 1)
        }
        this.loading = false
      }
    }
  },
  computed: {
    data () {
      if (this.chartData[0].length > 1) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="css" scoped>
.notification {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
.footer {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
}
</style>
