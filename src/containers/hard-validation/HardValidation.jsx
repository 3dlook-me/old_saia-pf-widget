import { h, Component } from 'preact';
import { route } from 'preact-router';
import { connect } from 'preact-redux';

import actions from '../../store/actions';
import ImageExample from '../../components/image-example/ImageExample';
import FlowService from '../../services/flowService';
import { gaHardValidationError, gaRetakePhotoError } from '../../ga';

const cryingIcon1x = require('../../images/crying.png');
const cryingIcon2x = require('../../images/crying@2x.png');

/**
 * Hard validation page component
 */
class HardValidation extends Component {
  constructor(props) {
    super(props);

    const { flowId, token } = this.props;
    this.flow = new FlowService(token);
    this.flow.setFlowId(flowId);
  }

  componentDidMount() {
    gaHardValidationError();
  }

  componentWillReceiveProps = async (nextProps) => {
    const { hardValidation } = nextProps;
    const { front, side } = hardValidation;

    await this.flow.updateState({
      frontImage: !front,
      sideImage: !side,
    });
  }

  back = () => {
    route('/upload', true);

    gaRetakePhotoError();
  }

  render() {
    const {
      hardValidation,
      isMobile,
    } = this.props;

    const { front, side } = hardValidation;

    // front error handling
    let sideInTheFront = false;
    let cannotDetectBodyFront = false;
    let bodyIsNotFullFront = false;
    let wrongFrontPose = false;
    let wrongPartsFront;
    let tipMessageFront;
    let topMessageFront;

    if (front) {
      if (front === 'Side photo in the front') {
        sideInTheFront = true;
        topMessageFront = 'It seems you uploaded side photo instead of the front one';
        tipMessageFront = 'Please upload the front photo.';
      } else if (front === 'Can\'t detect the human body') {
        cannotDetectBodyFront = true;
        topMessageFront = 'We can’t detect your body on the front photo';
        tipMessageFront = 'Please retake the front photo. Make sure your whole body is present on the photo.';
      } else if (front === 'The body is not full') {
        bodyIsNotFullFront = true;
        topMessageFront = 'Your full body should be present on the front photo';
        tipMessageFront = 'Please retake the front photo. Make sure your whole body is present and the pose is correct.';
      } else if (front.indexOf('The pose is wrong, check: ') !== -1) {
        wrongFrontPose = true;

        wrongPartsFront = front.replace('The pose is wrong, check: ', '');
        wrongPartsFront = wrongPartsFront.replace(/_/g, ' ');
        topMessageFront = `The pose on the front photo is a bit off, we couldn’t detect your ${wrongPartsFront}`;
        tipMessageFront = `Make sure your ${wrongPartsFront} is present on a photo`;
      }
    }

    // front error handling
    let sideInTheSide = false;
    let cannotDetectBodySide = false;
    let bodyIsNotFullSide = false;
    let wrongSidePose = false;
    let wrongPartsSide;
    let tipMessageSide;
    let topMessageSide;

    if (side) {
      if (side === 'Front photo in the side') {
        sideInTheSide = true;
        topMessageSide = 'It seems you uploaded frong photo instead of the side one';
        tipMessageSide = 'Please upload the side photo.';
      } else if (side === 'Can\'t detect the human body') {
        cannotDetectBodySide = true;
        topMessageSide = 'We can’t detect your body on the side photo';
        tipMessageSide = 'Please retake the side photo. Make sure your whole body is present on the photo.';
      } else if (side === 'The body is not full') {
        bodyIsNotFullSide = true;
        topMessageSide = 'Your full body should be present on the side photo';
        tipMessageSide = 'Please retake the side photo. Make sure your whole body is present and the pose is correct.';
      } else if (side.indexOf('The pose is wrong, check: ') !== -1) {
        wrongSidePose = true;

        wrongPartsSide = side.replace('The pose is wrong, check: ', '');
        wrongPartsSide = wrongPartsSide.replace(/_/g, ' ');
        topMessageSide = `The pose on the side photo is a bit off, we couldn’t detect your ${wrongPartsSide}`;
        tipMessageSide = `Make sure your ${wrongPartsSide} is present on a photo`;
      }
    }

    return (
      <div className="screen active">
        <div className="screen__content hard-validation">
          <h2 className="screen__subtitle">
            <span className="failure">Error</span>
          </h2>

          <h3 className="screen__title hard-validation__title">Oops!</h3>

          {(topMessageFront)
            ? (
              <p className="hard-validation__text">{topMessageFront}</p>
            ) : null }

          {(topMessageSide)
            ? (
              <p className="hard-validation__text">{topMessageSide}</p>
            ) : null }

          <img className="hard-validation__image" src={cryingIcon1x} srcSet={`${cryingIcon1x} 1x, ${cryingIcon2x} 2x`} alt="hard validation errors" />

          {(front && !side)
            ? (
              <h4 className="hard-validation__title-2">
                Retake the front photo.
                <br />
                Here are some tips:
              </h4>
            )
            : null }

          {(side && !front)
            ? (
              <h4 className="hard-validation__title-2">
                Retake the side photo.
                <br />
                Here are some tips:
              </h4>
            )
            : null }

          {(side && front)
            ? (
              <h4 className="hard-validation__title-2">
                Retake the front and the side photos.
                <br />
                Here are some tips:
              </h4>
            )
            : null }

          <ol className="hard-validation__recommendations">
            {(front)
              ? (
                <li>
                  {tipMessageFront}
                  {(sideInTheFront || cannotDetectBodyFront || bodyIsNotFullFront || wrongFrontPose) ? <ImageExample type="front" isMobile={isMobile} /> : null}
                </li>
              )
              : null
            }

            {(side)
              ? (
                <li>
                  {tipMessageSide}
                  {(sideInTheSide || cannotDetectBodySide || bodyIsNotFullSide || wrongSidePose) ? <ImageExample type="side" isMobile={isMobile} /> : null}
                </li>
              )
              : null
            }
          </ol>

        </div>
        <div className="screen__footer hard-validation__footer">
          <button className="button" onClick={this.back} type="button"><span>Retake photo</span></button>
        </div>
      </div>
    );
  }
}

export default connect(state => state, actions)(HardValidation);
