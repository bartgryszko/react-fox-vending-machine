import React, { Component, PropTypes } from 'react';
import { shapes } from '../../db-mockup';
import styles from './VendingInterface.scss';


export default class VendingInterface extends Component {

  static propTypes = {
    className: PropTypes.string,
    onBuy: PropTypes.func,
  }

  state = {
    credits: {},
  }

  createOnClick = (shapeId, price) => () => {
    const { credits } = this.state;
    let newCredits;

    if (price - (credits[shapeId] || 0) === 1) {
      this.props.onBuy(shapeId);
      newCredits = 0;
    } else {
      newCredits = (credits[shapeId] || 0) + 1;
    }

    this.setState({
      credits: { ...credits, [shapeId]: newCredits }
    });
  }

  render() {
    const { className } = this.props;
    const { credits } = this.state;

    return (
      <div className={[styles.container, className].filter(o => o).join(' ')}>
        <div className={styles.select}>
          Click indicated number of times to get
          <ul>
            {
              shapes.map(shape => (
                <li onClick={this.createOnClick(shape.id, shape.price)} key={shape.id}>
                  <span className={styles.name}>{shape.name}</span>
                  <span className={styles.price}>
                    {
                      `${shape.price - (credits[shape.id] || 0)} click${shape.price - (credits[shape.id] || 0) > 1 ? 's' : ''}`
                    }
                  </span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }
}
