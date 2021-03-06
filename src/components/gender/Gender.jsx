import { h, Component } from 'preact';
import classNames from 'classnames';

const maleIcon = require('../../images/male-icon.png');
const maleIconX2 = require('../../images/male-icon@2x.png');
const femaleIcon = require('../../images/female-icon.png');
const femaleIconX2 = require('../../images/female-icon@2x.png');

/**
 * Gender component
 */
export default class Gender extends Component {
  state = {
    value: null,
  }

  /**
   * Gender change event handler
   */
  onGenderChange = (e) => {
    const { change } = this.props;

    const { value } = e.target;

    this.setState({
      value,
    }, () => change(value));
  }

  render() {
    const { className, isValid } = this.props;
    const { value } = this.state;

    return (
      <div className={classNames('gender', className, { 'gender--invalid': !isValid })}>
        <label className={classNames('gender__item', { checked: value === 'female' })} htmlFor="gender-female">
          <input type="radio" name="gender" id="gender-female" value="female" onChange={this.onGenderChange} checked={value === 'female'} />
          <span>Female</span>
          <img src={femaleIcon} srcSet={`${femaleIcon} 1x, ${femaleIconX2} 2x`} alt="female icon" />
        </label>

        <label className={classNames('gender__item', { checked: value === 'male' })} htmlFor="gender-male">
          <input type="radio" name="gender" id="gender-male" value="male" onChange={this.onGenderChange} checked={value === 'male'} />
          <span>Male</span>
          <img src={maleIcon} srcSet={`${maleIcon} 1x, ${maleIconX2} 2x`} alt="male icon" />
        </label>
      </div>
    );
  }
}
