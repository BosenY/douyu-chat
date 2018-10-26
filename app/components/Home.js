// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }

  initAsyncDouyu() {
    ipcRenderer.send('asynchronous-message', 2009);
  }

  componentDidMount() {
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      // console.log(232);
      // console.log(arg); // prints "pong"
      this.props.ADD(arg);
      this.ul.scrollTop = this.ul.scrollHeight;
      if (this.props.list.length > 99) {
        this.props.DECREMENT();
      }
    });
  }

  jiance() {
    console.log(this.ul.scrollTop, this.ul.scrollHeight);
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>222</h2>
        <button
          onClick={() => {
            this.initAsyncDouyu();
          }}
        >
          开始2009
        </button>
        <button
          onClick={() => {
            this.props.DECREMENT();
          }}
        >
          jian
        </button>
        <button onClick={() => this.jiance()} />
        <ul className={styles.danmulist} ref={node => (this.ul = node)}>
          {this.props.list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
