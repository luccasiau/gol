const React = require('react');
const ReactDOM = require('react-dom');
const globalConfig = require('../configs/config.js')

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      playing: false,
      paused: false,
      time: 0,
      liveCells: new Set()
		}

    this.updateTime = 500
    this.updateTimer = setInterval(this.updateGame.bind(this), this.updateTime);
	};

  resetGame() {
    this.setState({
      playing: false,
      paused: false,
      time: 0,
      liveCells: new Set()
    })
  }

  pauseGame() {
    this.setState({
      playing: false,
      paused: true
    })
  }

	playGame() {
    if (this.state.playing === false) {
      this.setState({
        playing: true,
        paused: false
      });
    }
  };

  countLiveNeighbours(x, y) {
    let V = [-1, 0, 1]
    let neighbours = this.getNeighbours(x, y)

    var cnt = 0
    neighbours.forEach(cell => {
      let [nx, ny] = this.intToTuple(cell)
      if (this.state.liveCells.has(this.tupleToInt(nx, ny))) {
        cnt = cnt + 1
      }
    })

    return cnt
  }

  getNeighbours(x, y) {
    let V = [-1, 0, 1]
    let neighbours = new Set()
    V.forEach(vx => {
      V.forEach(vy => {
        if (vx === 0 && vy === 0) {
          return;
        }

        let nx = vx * globalConfig.squareSize + x
        let ny = vy * globalConfig.squareSize + y
        neighbours.add(this.tupleToInt(nx, ny))
      })
    })

    return neighbours;
  }

  updateGame() {
    if (this.state.playing === false || this.state.paused === true) {
      return;
    }

    let newCells = new Set()

    // preserving correct live cells
    this.state.liveCells.forEach( cell => {
      let [x, y] = this.intToTuple(cell)
      let nei = this.countLiveNeighbours(x, y)
      if (nei === 2 || nei === 3) {
        newCells.add(cell)
      }
    })

    this.state.liveCells.forEach( cell => {
      let [cx, cy] = this.intToTuple(cell)
      let cellNeighbours = this.getNeighbours(cx, cy)
      cellNeighbours.forEach( c => {
        if (this.state.liveCells.has(c) === false) {
          // already processed it
          if (newCells.has(c) === true) {
            return;
          }

          let [dx, dy] = this.intToTuple(c)
          if (this.countLiveNeighbours(dx, dy) === 3) {
            newCells.add(c)
          }
        }
      })
    })

    this.setState({
      time: this.state.time + 1,
      liveCells: newCells
    });
  }

  processClick(e) {
    if (this.state.playing === true || this.state.paused === true) {
      return;
    }
    let xClicked = e.clientX + window.pageXOffset
    let yClicked = e.clientY + window.pageYOffset
    let x = parseInt(globalConfig.squareSize * Math.floor(xClicked/globalConfig.squareSize), 10)
    let y = parseInt(globalConfig.squareSize * Math.floor(yClicked/globalConfig.squareSize), 10)

    if (x < globalConfig.playWindowX && y < globalConfig.playWindowY) {
      return
    }

    this.toggleCell(x, y)
  }

  tupleToInt(x, y) {
    return x * globalConfig.fuckjs + y
  }

  intToTuple(v) {
    let y = v % globalConfig.fuckjs
    let x = (v - y) / globalConfig.fuckjs
    return [x, y]
  }

  toggleCell(x, y) {
    let curCell = this.tupleToInt(x, y)
    if (this.state.liveCells.has(curCell)) {
      this.state.liveCells.delete(curCell)
    } else {
      this.state.liveCells.add(curCell)
    }

    this.setState({
      liveCells: this.state.liveCells
    })
  }

  updateSpeed() {
    console.log("Changing speed to", this.updateTime)
    clearInterval(this.updateTimer)
    this.updateTimer = setInterval(this.updateGame.bind(this), this.updateTime)
  }

  increaseSpeed() {
    if (this.updateTime === 25) {
      alert("Already at maximum speed.")
      return;
    }
    if (this.updateTime === 50) {
      this.updateTime -= 25
    } else {
      this.updateTime -= 50
    } 
   
    this.updateSpeed()
  }

  reduceSpeed() {
    if (this.updateTime === 2000) {
      alert("Already at minimum speed.")
      return;

    }
    if (this.updateTime === 25) {
      this.updateTime += 25
    } else {
      this.updateTime += 50
    }

    this.updateSpeed()
  }

  render() {
    return (
      <div id="world" onClick={this.processClick.bind(this)}>
      <button type="button" onClick={this.playGame.bind(this)}>Play</button>
      <button type="button" onClick={this.pauseGame.bind(this)}>Pause</button>
      <button type="button" onClick={this.resetGame.bind(this)}>Reset</button>
      <div>
        <button type="button" onClick={this.increaseSpeed.bind(this)}>Faster</button>
        <button type="button" onClick={this.reduceSpeed.bind(this)}>Slower</button>
      </div>
      <div>Iteration: {this.state.time}</div>
      <div>Live cells: {this.state.liveCells.size}</div>
      {
        Array.from(this.state.liveCells.values()).map(v => {
          let [x, y] = this.intToTuple(v)
          var divStyle = {
            position: 'absolute',
            left: x,
            top: y,
            height: globalConfig.squareSize,
            width: globalConfig.squareSize,
            backgroundColor: 'black'
          }
          return (<div key={v} style={divStyle}></div>)
        })
      }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

