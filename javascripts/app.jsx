const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      time: 0
		}
	};

	handlePlay() {
    this.setState({
      time: this.state.time + 1
    });
	};

	render() {
		return (
			<div>
				<button type="button" onClick={this.handlePlay.bind(this)}>Play</button>
        <div>{this.state.time}</div>
			</div>
		)
	}
}



ReactDOM.render(<App />, document.getElementById('app'));
