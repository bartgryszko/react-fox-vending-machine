import React, { Component } from 'react';
import { VendingInterface, Deck } from 'components';
import { shapes as dbShapes, emptyShape } from '../../db-mockup';
import styles from './App.scss';

function mapShapeIdToDBShape(shapeId) {
  return dbShapes.find(
    shape => shape.id === shapeId
  );
}

export default class App extends Component {

  state = {
    shapes: [],
    selectedShape: 0,
  }

  onBuy = (shapeId) => {
    this.setState({ shapes: [...this.state.shapes, shapeId], selectedShape: this.state.shapes.length });
  }

  onShapeChange = (shapeIndex) => {
    this.setState({ selectedShape: shapeIndex });
  }

  render() {
    const { shapes, selectedShape } = this.state;

    return (
      <div className={styles.container}>
        <VendingInterface
          onBuy={this.onBuy}
          className={styles.interface}
        />
        <Deck
          shapes={shapes.map(mapShapeIdToDBShape)}
          emptyShape={emptyShape}
          className={styles.deck}
          selectedShape={selectedShape}
          onShapeChange={this.onShapeChange}
        />
      </div>
    );
  }
}
