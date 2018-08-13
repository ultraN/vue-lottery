<template>
  <div>
      <div class="wheel" :style="{
        width: diameter,
        height: diameter
      }">
      <div class="wheel-container">
          <div class="wheel-start-container">
            <div class="wheel-arrow"></div>
            <div class="wheel-start-button" @click="roll">
              <div class="wheel-start-text">
                {{startButtonText}}
              </div>
            </div>
          </div>
        <div class="wheel-background" :style="wheelRotation">
          <div class="prize-list split" :style="sliceOffsetTranform">
            <div class="prize-list prize-item-container" v-for="(prize, index) in prizeList" :key="index" :style="sliceRotation(index)"/>
          </div>
          <div class="prize-list">
            <div class="prize-list prize-item-container" v-for="(prize, index) in prizeList" :key="index" :style="sliceRotation(index)">
              <div class="prize-list prize-item" :style="slice">
                <div class="prize-name">
                  {{prize.name}}
                </div>
                <div v-if="prize.image">
                  <img style="max-width: 50%; max-height: 50%;" :src="prize.image"/>
                  </div>
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
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wheel-start-container {
  display: flex;
  justify-content: center;
  position: relative;
  width: 20%;
  height: 20%;
  z-index: 2;
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

.wheel-arrow {
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 60px solid lightgray;
  position: absolute;
  transform: scaleX(0.6) translateY(-50px);
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
  name: "VLottery",
  props: {
    options: {
      validator: function(options) {
        return (
          options.hasOwnProperty("prizes") &&
          options.hasOwnProperty("callback") &&
          options.hasOwnProperty("roll") &&
          options.hasOwnProperty("startButtonText")
        );
      }
    },
    diameter: {
      required: false,
      default: "400px",
      type: String
    },
    winner: {
      required: true
    }
  },
  data() {
    return {
      startRotatingDegree: 0,
      rotateAngle: 0,
      disabled: true
    };
  },
  methods: {
    roll() {
      if (!this.disabled) return;
      this.options.roll();
    },
    rotating(winner) {
      if (!this.disabled) return;
      this.sendResult(winner);
      let resultIndex = winner; // Last piece
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
      }, this.rotatingTime * 1000 + 255);
    },
    gameOver(winner) {
      this.options.callback(this.prizeList[winner]);
    },
    sendResult(winner) {
      // send to back end
      console.log(winner);
    },
    sliceRotation(index) {
      const rotateAngle = index * this.sliceAngle + this.sliceOffset;
      return { transform: `rotate(${rotateAngle}deg)` };
    }
  },
  computed: {
    prizeList() {
      return (this.options && this.options.prizes) || [];
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
      return (
        (Number.isInteger(this.options.rotatingTime) &&
          this.options.rotatingTime) ||
        5
      );
    },
    rotateTransition() {
      return `transform ${this.options.rotatingTime}s ease-in-out`;
    },
    sliceAngle() {
      return this.prizeList.length > 0 ? 360 / this.prizeList.length : 0;
    },
    sliceOffset() {
      return this.sliceAngle / 2;
    },
    startButtonText() {
      return this.options.startButtonText || "Start";
    },
    wheelRotation() {
      return {
        transform: this.rotateAngle,
        transition: this.rotateTransition
      };
    },
    sliceOffsetTranform() {
      return {
        transform: `rotate(${this.sliceOffset}deg)`
      };
    },
    slice() {
      return {
        width: `calc(100% * ${Math.PI} / ${this.prizeList.length})`
      };
    },
    reset() {
      // TODO: reset wheel
      // let rotateAngle =
      //   this.startRotatingDegree +
      //   this.rotations * 360 +
      //   this.resultAngles[0] -
      //   this.startRotatingDegree % 360;
      // this.startRotatingDegree = rotateAngle;
      // this.rotateAngle = "rotate(" + rotateAngle + "deg)";
    }
  },
  components: {
    arrow: Arrow
  },
  watch: {
    winner(winner) {
      if (winner !== null && winner !== undefined) {
        this.rotating(winner);
      } else {
        this.reset();
      }
    }
  }
};
</script>