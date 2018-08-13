<template>
  <div>
      <v-lottery :options="options" diameter="600px" :winner="winner"></v-lottery>
  </div>
</template>
<style>
</style>
<script>
export default {
  data() {
    return {
      options: {
        prizes: [],
        rotations: 6,
        rotatingTime: 5, // seconds
        startButtonText: "Spin!",
        callback: this.callback,
        roll: this.rollFunction
      },
      winner: null
    };
  },
  methods: {
    loadPrizeList() {
      this.options.prizes = [
        {
          name: "First",
          chance: 1,
          image: "doge/dogedoge.jpg"
        },
        {
          name: "Second",
          chance: 2,
          image: "doge/doge.jpg"
        },
        {
          name: "Sorry",
          chance: 10,
          image: "doge/doge.jpg"
        },
        {
          name: "Thrid",
          chance: 7,
          image: "doge/doge.jpg"
        },
        {
          name: "Forth",
          chance: 10,
          image: "doge/doge.jpg"
        },
        {
          name: "Next Time",
          chance: 5,
          image: "doge/doge.jpg"
        },
        {
          name: "Fifth",
          chance: 20,
          image: "doge/doge.jpg"
        },
        {
          name: "Sixth",
          chance: 40,
          image: "doge/doge.jpg"
        },
        {
          name: "Nope",
          chance: 5,
          image: "doge/doge.jpg"
        }
      ];
    },
    callback(winner) {
      alert("Congratulations! You've won " + winner.name + " Prize");
    },
    rollFunction() {
      // Should retrieve winner from server
      let hit = Math.floor(Math.random() * 100 + 1);
      let winner = this.prizeRange().findIndex(function(prize) {
        return hit <= prize.max && hit >= prize.min;
      });
      this.winner = winner;
    },
    prizeRange() {
      let range = [];
      for (let i = 0; i < this.options.prizes.length; i++) {
        if (i > 1) {
          range.push({
            min: range[i - 1].max + 1,
            max: range[i - 1].max + this.options.prizes[i].chance
          });
        } else if (i === this.options.prizes.length - 1) {
          // last one
          range.push({
            min: range[i - 1].max + 1,
            max: 100
          });
        } else {
          // first one
          range.push({
            min: 1,
            max: this.options.prizes[i].chance
          });
        }
      }
      return range;
    }
  },
  mounted() {
    // load prize list from server
    this.loadPrizeList();
  }
};
</script>