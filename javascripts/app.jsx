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
    setInterval(this.updateGame.bind(this), 250);
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
      paused: true
    })
  }

	playGame() {
    if (this.state.playing === false) {
      this.setState({
        playing: true,
        time: 0
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

  // TODO: Code whole thing, basically
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

    // TODO: Add dead cells
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

  // TODO: Fix scrolling issue.
  processClick(e) {
    if (this.state.playing === true || this.state.paused === true) {
      return;
    }
    let x = parseInt(globalConfig.squareSize * Math.floor(e.clientX/globalConfig.squareSize), 10)
    let y = parseInt(globalConfig.squareSize * Math.floor(e.clientY/globalConfig.squareSize), 10)

    if (x < globalConfig.playWindow && y < globalConfig.playWindow) {
      return
    }

    this.toggleCell(x, y)
  }

  tupleToInt(x, y) {
    // console.log(x, y, x * globalConfig.fuckjs + y)
    return x * globalConfig.fuckjs + y
  }

  intToTuple(v) {
    let y = v % globalConfig.fuckjs
    let x = (v - y) / globalConfig.fuckjs
    // console.log(v, x, y)
    return [x, y]
  }

  toggleCell(x, y) {
    let curCell = this.tupleToInt(x, y)
    if (this.state.liveCells.has(curCell)) {
      this.state.liveCells.delete(curCell)
      console.log("Removing")
    } else {
      this.state.liveCells.add(curCell)
      console.log("Adding")
    }
    console.log(x, y)

    this.setState({
      liveCells: this.state.liveCells
    })
  }

  render() {
    return (
      <div id="world" onClick={this.processClick.bind(this)}>
      <button type="button" onClick={this.playGame.bind(this)}>Play</button>
      <button type="button" onClick={this.pauseGame.bind(this)}>Pause</button>
      <button type="button" onClick={this.resetGame.bind(this)}>Reset</button>
      <div>{this.state.time}</div>
      <div>{this.state.playing}</div>
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

