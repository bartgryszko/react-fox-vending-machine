import React, { Component, PropTypes } from 'react';
import { StaggeredMotion, Motion, TransitionMotion, spring } from 'react-motion';
import styles from './Deck.scss';

const SPRING = { stiffness: 120, damping: 17, precision: 1 };

function generateRadialGradient({ fromR, fromG, fromB, toR, toG, toB }) {
  return ('radial-gradient('
      + `rgb(${Math.round(fromR)}, ${Math.round(fromG)}, ${Math.round(fromB)}),`
      + `rgb(${Math.round(toR)}, ${Math.round(toG)}, ${Math.round(toB)})`
      + ')');
}

function cx(arrayOfClassNames) {
  return arrayOfClassNames.filter(o => o).join(' ');
}

export default class Deck extends Component {

  static propTypes = {
    className: PropTypes.string,
    shapes: PropTypes.array,
    selectedShape: PropTypes.number,
    emptyShape: PropTypes.object,
    onShapeChange: PropTypes.func,
  }

  state = {
    tick: 1,
  }

  componentWillUpdate(newProps) {
    if (newProps.selectedShape !== this.props.selectedShape) {
      this.setState({ tick: this.state.tick + 1 });
    }
  }

  createOnShapeChange = changeBy => () => {
    this.props.onShapeChange(
      (this.props.selectedShape + changeBy) % this.props.shapes.length
    );
  }

  render() {
    const { tick } = this.state;
    const { className, shapes, emptyShape, selectedShape } = this.props;
    const { shape: currentShape, background, shadow, name } = shapes[selectedShape] || emptyShape;

    return (
      <Motion
        style={{
          fromR: spring(background.from.r),
          fromG: spring(background.from.g),
          fromB: spring(background.from.b),
          toR: spring(background.to.r),
          toG: spring(background.to.g),
          toB: spring(background.to.b),
          shadow1: spring(shadow.x1),
          shadow2: spring(shadow.x2),
        }}
      >
        {
          bgConfig => (
            <div className={cx([styles.container, className])} style={{ background: generateRadialGradient(bgConfig) }}>
              <a onClick={this.createOnShapeChange(-1)} className={cx([styles.prev, selectedShape > 0 && styles.isVisible])}>
                <img src={require('./left.svg')} alt="Previous" />
              </a>
              <div>
                <StaggeredMotion
                  defaultStyles={emptyShape.shape.map(shape => shape.points.reduce(
                    (reduced, point, i) => ({ ...reduced, [`point${i}`]: point }),
                    { base: 0, r: shape.r, g: shape.g, b: shape.b }
                  ))}
                  styles={prevInterpolatedStyles => currentShape.map((shape, shapeIndex) => {
                    if (shapeIndex === 0 || (tick - prevInterpolatedStyles[shapeIndex - 1].base) % 2 <= 0.999) {
                      return shape.points.reduce(
                        (reduced, point, i) => ({ ...reduced, [`point${i}`]: spring(point) }),
                        { base: spring(tick), r: spring(shape.r), g: spring(shape.g), b: spring(shape.b) }
                      );
                    }

                    return prevInterpolatedStyles[shapeIndex];
                  })}
                >
                  {
                    interpolatingStyles => (
                      <svg className={styles.svg} width="600px" height="600px" viewBox="-30 -30 360 360" version="1.1" xmlns="http://www.w3.org/2000/svg">

                        <defs>
                          <radialGradient id="gradient">
                            <stop offset="0" style={{ stopColor: '#000000', stopOpacity: 0.1 }} />
                            <stop offset="1" style={{ stopColor: '#000000', stopOpacity: 0 }} />
                          </radialGradient>
                        </defs>

                        <rect x={bgConfig.shadow1} y="290" fill="url(#gradient)" width="100" height="10" />
                        <rect x={bgConfig.shadow2} y="290" fill="url(#gradient)" width="100" height="10" />
                        {
                          interpolatingStyles.map((config, i) => (
                            <polygon
                              key={`${tick}-${i}`}
                              points={[0, 1, 2, 3, 4, 5].map((_, oi) => config[`point${oi}`]).join(' ')}
                              style={{ fill: `rgb(${Math.round(config.r)}, ${Math.round(config.g)}, ${Math.round(config.b)})` }}
                            />
                          ))
                        }
                      </svg>
                    )
                  }
                </StaggeredMotion>
                {
                  name && (
                    <TransitionMotion
                      willLeave={() => ({
                        opacity: spring(0, SPRING),
                        transform: spring(-80, SPRING),
                        rotate: spring(90, SPRING)
                      })}
                      willEnter={() => ({
                        opacity: 0,
                        transform: 80,
                        rotate: -90
                      })}
                      styles={[{
                        key: `shape-${selectedShape}`,
                        style: {
                          opacity: spring(1, SPRING),
                          transform: spring(0, SPRING),
                          rotate: spring(0, SPRING)
                        },
                        data: { name, selectedShape }
                      }]}
                    >
                      {
                        interpolatedStyles => (
                          <div className={styles.nameContainer}>
                            {
                              interpolatedStyles.map(config => (
                                <div
                                  data-key={config.key}
                                  key={config.key}
                                  style={{
                                    opacity: config.style.opacity,
                                    transform: `translateY(${config.style.transform}px) rotateX(${config.style.rotate}deg)` }}
                                  className={styles.name}
                                >
                                  #{config.data.selectedShape + 1} {config.data.name}
                                </div>
                              ))
                            }
                          </div>
                        )
                      }
                    </TransitionMotion>
                  )
                }
              </div>
              <a onClick={this.createOnShapeChange(1)} className={cx([styles.next, shapes.length - 1 > selectedShape && styles.isVisible])}>
                <img src={require('./right.svg')} alt="Next" />
              </a>
            </div>
          )
        }
      </Motion>
    );
  }
}
