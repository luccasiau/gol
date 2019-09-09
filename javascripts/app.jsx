const React = require('react');
const ReactDOM = require('react-dom');
const globalConfig = require('../configs/config.js')

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      playing: false,
      time: 0,
      liveCells: new Set()
		}
    setInterval(this.updateGame.bind(this), 500);
	};

	handlePlay() {
    this.setState({
      playing: true,
      time: 0
    });
	};

  updateGame() {
    if (this.state.playing === false) {
      return;
    }
    this.setState({
      time: this.state.time + 1
    });
  }

  // TODO: Fix scrolling issue.
  processClick(e) {
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
				<button type="button" onClick={this.handlePlay.bind(this)}>Play</button>
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

