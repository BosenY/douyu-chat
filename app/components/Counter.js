// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import styles from './Counter.css';
import routes from '../constants/routes';

type Props = {
  increment: () => void,
  incrementIfOdd: () => void,
  incrementAsync: () => void,
  decrement: () => void,
  counter: number
};

export default class Counter extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }

  initDouyu() {
    const res = ipcRenderer.sendSync('synchronous-message', '1113121');
    console.log(res);
  }

  initAsyncDouyu() {
    ipcRenderer.send('asynchronous-message', 2009);
  }

  componentDidMount() {
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      // console.log(232);
      console.log(arg); // prints "pong"
    });
  }

  render() {
    const {
      increment,
      incrementIfOdd,
      incrementAsync,
      decrement,
      counter
    } = this.props;
    return (
      <div>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className={`counter ${styles.counter}`} data-tid="counter">
          {counter}
        </div>

        <div className={styles.btnGroup}>
          <button onClick={this.initDouyu}>douyu</button>
          <button onClick={this.initAsyncDouyu}>async douyu </button>
          {/* <button
            className={styles.btn}
            onClick={increment}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-plus" />
          </button>
          <button
            className={styles.btn}
            onClick={decrement}
            data-tclass="btn"
            type="button"
          >
            <i className="fa fa-minus" />
          </button> */}
          {/* <button
            className={styles.btn}
            onClick={incrementIfOdd}
            data-tclass="btn"
            type="button"
          >
            odd
          </button>
          <button
            className={styles.btn}
            onClick={() => incrementAsync()}
            data-tclass="btn"
            type="button"
          >
            async
          </button> */}
        </div>
      </div>
    );
  }
}
