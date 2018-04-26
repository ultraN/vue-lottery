<template>
<div>
    <lottery :options="options"></lottery>
</div>
</template>
<style>

</style>
<script>
import Lottery from "./Lottery/Lottery";
export default {
  data() {
    return {
      options: {
        prizes: [],
        rotations: 6,
        rotatingTime: 5, // seconds
        rotateTransition: "transform 6s ease-in-out",
        startButtonText: "抽奖"
      }
    };
  },
  components: {
    lottery: Lottery
  },
  methods: {
    loadPrizeList() {
      this.options.prizes = [
        {
          name: "一等奖",
          chance: 1
        },
        {
          name: "二等奖",
          chance: 2
        },
        {
          name: "再接再厉",
          chance: 10
        },
        {
          name: "三等奖",
          chance: 7
        },
        {
          name: "四等奖",
          chance: 10
        },
        {
          name: "再接再厉",
          chance: 5
        },
        {
          name: "五等奖",
          chance: 20
        },
        {
          name: "六等奖",
          chance: 40
        },
        {
          name: "再接再厉",
          chance: 5
        }
      ];
    }
  },
  mounted() {
    // load prize list from server
    this.loadPrizeList();
  }
};
</script>