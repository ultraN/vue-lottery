<template>
  <div>
      <div class="wheel">
      <div class="wheel-container">
        <div class="wheel-start-container">
          <!-- <arrow/> -->
          <div class="wheel-arrow"></div>
          <div class="wheel-start-button" @click="roll">
            <div class="wheel-start-text">
              {{startButtonText}}
            </div>
          </div>
        </div>
        <div class="wheel-background" :style="{transform:rotateAngle,transition:rotateTransition}">
          <div class="prize-list split" :style="{transform: `rotate(${sliceOffset}deg)`}">
            <div class="prize-list prize-item-container" v-for="(prize, index) in prizeList" :key="index" :style="{transform: sliceRotation(index)}"/>
          </div>
          <div class="prize-list">
            <div class="prize-list prize-item-container" v-for="(prize, index) in prizeList" :key="index" :style="{transform: sliceRotation(index)}">
              <div class="prize-list prize-item" :style="{width: `calc(100% * ${Math.PI} / ${prizeList.length})`}">
                <div class="prize-name">{{prize.name}}</div>
                <div v-if="prize.image"><img :src="prize.image"/></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
  </div>
</template>
<style scoped>
.wheel {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 10px;
}
.wheel-container {
  position: relative;
  height: 600px;
  width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wheel-background {
  width: inherit;
  height: inherit;
  background-color: white;
  border-radius: 50%;
  border: 1px solid black;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.3));
  box-sizing: border-box;
  position: absolute;
}
.wheel-start-container {
  position: absolute;
  width: 20%;
  height: 20%;
  z-index: 2;
  display: flex;
  justify-content: center;
}
.wheel-arrow {
  border-left: 24px solid transparent;
  border-right: 24px solid transparent;
  border-bottom: 60px solid lightgray;
  position: absolute;
  transform: scaleX(0.766) translateY(-50px);
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
}

.wheel-start-text {
  position: absolute;
  width: 100%;
  top: 30%;
  font-size: 2em;
  z-index: 2;
}

.wheel-start-button {
  user-select: none;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.65));
  background: radial-gradient(white, white, gray);
  transition: background-color 1s linear;
}

.wheel-start-button:hover {
  cursor: pointer;
}

.wheel-start-button:before {
  content: "";
  display: block;
  padding: 50%;
  position: absolute;
  border-radius: inherit;
  background: radial-gradient(white, white, lightgray);
  transition: all 0.5s;
}

.wheel-start-button:hover:before {
  opacity: 0;
  background-color: radial-gradient(white, white, gray);
}

.wheel-start-button:after {
  content: "";
  border-radius: 50%;
  display: block;
  position: absolute;
  padding: 50%;
  background: lightgray;
  transition: all 1s;
  opacity: 0;
}

.wheel-start-button:active:after {
  opacity: 1;
  transition: 0s;
}

.prize-list {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}

.prize-item-container {
  display: flex;
  justify-content: center;
}

.prize-name {
  font-size: 20px;
}

.prize-item {
  height: 50%;
  margin: auto;
  position: absolute;
}

.split > .prize-item-container:before {
  position: absolute;
  content: "";
  height: 50%;
  border-right: 2px solid black;
  -webkit-font-smoothing: none;
}
</style>
<script>
import Arrow from "./LotteryButton/ButtonArrow";
export default {
  props: ["options"],
  data() {
    return {
      startRotatingDegree: 0,
      rotateAngle: 0,
      disabled: true
    };
  },
  methods: {
    winner() {
      // Should retrieve winner from server
      let hit = Math.floor(Math.random() * 100 + 1);
      let winner = this.prizeRange.findIndex(function(prize) {
        return hit <= prize.max && hit >= prize.min;
      });
      return winner;
    },
    roll() {
      if (!this.disabled) return;
      let winner = this.winner();
      this.rotating(winner);
    },
    rotating(winner) {
      if (!this.disabled) return;
      this.sendResult(winner);
      // let duringTime = 5;
      let resultIndex = winner; // Last piece
      // let resultAngle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5];
      // let randCircle = 6; // rotations
      this.disabled = false; // disable lottery
      // roll
      let rotateAngle =
        this.startRotatingDegree +
        this.rotations * 360 +
        this.resultAngles[resultIndex] -
        this.startRotatingDegree % 360;

      // let rotateAngle =
      //   this.startRotatingDegree - this.startRotatingDegree % 360 +
      //    this.rotations * 360 - this.resultAngles[resultIndex]; // Rotate pointer

      this.startRotatingDegree = rotateAngle;
      this.rotateAngle = "rotate(" + rotateAngle + "deg)";
      // unlock lottery
      setTimeout(() => {
        this.disabled = true;
        this.gameOver(winner);
      }, this.rotatingTime * 1000 + 1500);
    },
    gameOver(winner) {
      alert("恭喜你！获得了 " + this.prizeList[winner].name);
    },
    sendResult(winner) {
      // send to back end
      console.log(winner);
    },
    sliceRotation(index) {
      const rotateAngle = index * this.sliceAngle + this.sliceOffset;
      return `rotate(${rotateAngle}deg)`;
    }
  },
  computed: {
    prizeList() {
      return (this.options && this.options.prizes) || [];
    },
    prizeRange() {
      let range = [];
      for (let i = 0; i < this.prizeList.length; i++) {
        if (i > 1) {
          range.push({
            min: range[i - 1].max + 1,
            max: range[i - 1].max + this.prizeList[i].chance
          });
        } else if (i === this.prizeList.length - 1) {
          // last one
          range.push({
            min: range[i - 1].max + 1,
            max: 100
          });
        } else {
          // first one
          range.push({
            min: 1,
            max: this.prizeList[i].chance
          });
        }
      }
      return range;
    },
    rotations() {
      return this.options.rotations || 1;
    },
    resultAngles() {
      let angles = [];
      for (let index = 0; index < this.prizeList.length; index++) {
        angles.push(360 - this.sliceOffset - this.sliceAngle * index);
      }
      return angles;
    },
    rotatingTime() {
      return this.options.rotatingTime || 5;
    },
    rotateTransition() {
      return this.options.rotateTransition || "transform 5s ease-in-out";
    },
    sliceAngle() {
      return this.prizeList.length > 0 ? 360 / this.prizeList.length : 0;
    },
    sliceOffset() {
      return this.sliceAngle / 2;
    },
    startButtonText() {
      return this.options.startButtonText || "Start";
    }
  },
  components: {
    arrow: Arrow
  }
};
</script>