var React = require('react');

require('codemirror/lib/codemirror.css');
require('codemirror/theme/solarized.css');
require('codemirror/mode/javascript/javascript');
var CodeMirror = require('codemirror');

var CodeRunner = require('./CodeRunner');
var PropsDoc = require('./PropsDoc');

import styles from './Component.less';

var Component = React.createClass({
  render() {
    return (
      <div className={styles.root}>
        <h2 className={styles.name}>{this.props.component.name}</h2>
        <div className={styles.demo}>
          <CodeRunner src={this.state.src} />
        </div>
        <div className={styles.docs}>
          <div ref="code"></div>
          <PropsDoc component={this.props.component} />
        </div>
      </div>
    );
  },

  getInitialState() {
    return {
      src: this.props.component.src || '',
    };
  },

  componentDidMount() {
    var editor = CodeMirror(this.refs.code.getDOMNode(), {
      value: this.state.src.replace(/\n$/, ''),
      theme: 'solarized light',
      smartIndent: false, // Doesn't work for jsx.
      lineWrapping: true,
      lineNumbers: true,
      viewportMargin: Infinity,
    });
    editor.on('change', (doc) => {
      this.setState({src: doc.getValue()});
    });
  },
});

module.exports = Component;
