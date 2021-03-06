import { h, Component } from 'preact';
import { route } from 'preact-router';
import API from '@3dlook/saia-sdk/lib/api';
import { connect } from 'preact-redux';
import classNames from 'classnames';

import UploadBlock from '../../components/upload-block/UploadBlock';
import QRCodeBlock from '../../components/qrcode/QRCode';
import Preloader from '../../components/preloader/Preloader';
import { send, transformRecomendations } from '../../utils';
import {
  gaUploadOnContinue,
  gaTutorialDesktop,
  gaCopyUrl,
  gaOpenCameraFrontPhoto,
  gaOpenCameraSidePhoto,
} from '../../ga';
import actions from '../../store/actions';
import FlowService from '../../services/flowService';
import store from '../../store';

// assets
const playIcon = require('../../images/play.svg');

/**
 * Upload page component.
 */
class Upload extends Component {
  constructor(props) {
    super(props);

    this.init(props);

    this.state = {
      isFrontImageValid: true,
      isSideImageValid: true,

      // image errors
      frontImagePose: null,
      sideImagePose: null,

      isPending: false,

      qrCodeUrl: null,
    };
  }

  componentDidMount() {
    const { flowId, token } = this.props;

    this.setState({
      qrCodeUrl: `${window.location.origin}${window.location.pathname}?key=${token}#/mobile/${flowId}`,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    clearInterval(this.timer);
  }

  init(props) {
    const {
      token,
      flowId,
      isMobile,
      setRecommendations,
      origin,
    } = props;

    if (token && flowId && !this.api && !this.flow) {
      this.api = new API({
        host: `${API_HOST}/api/v2/`,
        key: token,
      });

      this.flow = new FlowService(token);
      this.flow.setFlowId(flowId);

      if (!isMobile) {
        this.timer = setInterval(() => {
          this.flow.get()
            .then((flowState) => {
              if (flowState.state.status === 'opened-on-mobile') {
                this.setState({
                  isPending: true,
                });
              }

              if (flowState.state.status === 'finished') {
                const { recommendations } = flowState.state;
                setRecommendations(recommendations);

                send('recommendations', recommendations, origin);

                if (!recommendations.normal
                  && !recommendations.tight
                  && !recommendations.loose) {
                  route('/not-found', true);
                } else {
                  route('/results', true);
                }
              }
            })
            .catch(err => console.log(err));
        }, 3000);
      }
    }
  }

  /**
   * Save front image to state
   */
  saveFrontFile = (params) => {
    const { addFrontImage } = this.props;

    addFrontImage(params.file);
  }

  /**
   * Save side image to state
   */
  saveSideFile = (params) => {
    const { addSideImage, isMobile } = this.props;

    if (isMobile) {
      this.unsubscribe = store.subscribe(() => {
        const state = store.getState();

        if (state.frontImage && state.sideImage) {
          this.unsubscribe();
          this.onNextButtonClick(null, state);
        }
      });
    }

    addSideImage(params.file);
  }

  /**
   * On next button click handler
   *
   * @async
   */
  onNextButtonClick = async (e, props = this.props) => {
    if (e) {
      e.preventDefault();
    }

    const {
      frontImage,
      sideImage,
      height,
      gender,
      brand,
      bodyPart,
      productUrl,
      personId,
      isFromDesktopToMobile,
    } = props;

    const {
      setRecommendations,
      setSoftValidation,
      setHardValidation,
      addFrontImage,
      addSideImage,
      setPersonId,
      setMeasurements,
      origin,
    } = this.props;

    try {
      if (!frontImage) {
        this.setState({
          isFrontImageValid: false,
        });
      }

      if (!sideImage) {
        this.setState({
          isSideImageValid: false,
        });
      }

      if (!frontImage || !sideImage) {
        return;
      }

      this.setState({
        isFrontImageValid: !!frontImage,
        isSideImageValid: !!sideImage,
        isPending: true,
      });

      let taskSetId;

      // use only real images
      // ignore booleans for mobile flow
      const images = {};

      if (frontImage !== true) {
        images.frontImage = frontImage;
      }

      if (sideImage !== true) {
        images.sideImage = sideImage;
      }

      if (!personId) {
        const createdPersonId = await this.api.person.create({
          gender,
          height,
        });

        setPersonId(createdPersonId);

        await this.flow.update({
          person: createdPersonId,
        });

        taskSetId = await this.api.person.updateAndCalculate(createdPersonId, images);
      } else {
        await this.api.person.update(personId, images);

        taskSetId = await this.api.person.calculate(personId);
      }

      const r = await this.api.queue.getResults(taskSetId);

      const measurements = {
        hips: r.volume_params.high_hips,
        chest: r.volume_params.chest,
        waist: r.volume_params.waist,
        gender,
        height,
      };

      send('data', measurements, origin);
      setMeasurements(measurements);

      if (isFromDesktopToMobile) {
        localStorage.setItem('saia-pf-widget-data', JSON.stringify(measurements));
      }

      const softValidation = {
        front: {
          bodyAreaPercentage: r.front_params.body_area_percentage,
          legsDistance: r.front_params.legs_distance,
          messages: [...r.front_params.soft_validation.messages],
        },
        side: {
          bodyAreaPercentage: r.side_params.body_area_percentage,
          legsDistance: r.side_params.legs_distance,
          messages: [...r.side_params.soft_validation.messages],
        },
      };

      setSoftValidation(softValidation);

      let recommendations;

      if (brand && bodyPart) {
        recommendations = await this.api.sizechart.getSize({
          gender,
          hips: r.volume_params.high_hips,
          chest: r.volume_params.chest,
          waist: r.volume_params.waist,
          brand,
          body_part: bodyPart,
        });
      } else {
        recommendations = await this.api.product.getRecommendations({
          gender,
          hips: r.volume_params.high_hips,
          chest: r.volume_params.chest,
          waist: r.volume_params.waist,
          url: productUrl,
        });
      }

      if (recommendations) {
        recommendations = transformRecomendations(recommendations);
        setRecommendations(recommendations);
      }

      send('recommendations', recommendations, origin);

      gaUploadOnContinue();

      // check if there is any soft validation message
      // const isFrontImageHasSoftValidationError = softValidation.front.bodyAreaPercentage < 0.7
      //   || softValidation.front.legsDistance < 2
      //   || softValidation.front.legsDistance > 15
      //   || softValidation.front.messages.length;
      // const isSideImageHasSoftValidationError = softValidation.side.bodyAreaPercentage < 0.7
      // || softValidation.side.messages.length;

      // if ((isFrontImageHasSoftValidationError || isSideImageHasSoftValidationError)
      //     && (recommendations && (recommendations.normal
      //       || recommendations.tight
      //       || recommendations.loose))) {
      //   // reset front image if there is soft validation error
      //   // in the front image
      //   if (isFrontImageHasSoftValidationError) {
      //     addFrontImage(null);
      //   }

      //   // reset side image if there is soft validation error
      //   // in the side image
      //   if (isSideImageHasSoftValidationError) {
      //     addSideImage(null);
      //   }

      //   route('/soft-validation', true);
      // // check if there is any size recommendation
      // } else
      if (!recommendations || (!recommendations.normal
        && !recommendations.tight
        && !recommendations.loose)) {
        route('/not-found', true);
      // ok, show just recommendations
      } else {
        route('/results', true);
      }
    } catch (error) {
      this.setState({
        isPending: false,
      });

      // hard validation part
      if (error && error.response && error.response.data && error.response.data.sub_tasks) {
        const subTasks = error.response.data.sub_tasks;

        const frontTask = subTasks.filter(item => item.name.indexOf('front_') !== -1)[0];
        const sideTask = subTasks.filter(item => item.name.indexOf('side_') !== -1)[0];

        setHardValidation({
          front: frontTask.message,
          side: sideTask.message,
        });

        // reset front image if there is hard validation error
        // in the front image
        if (frontTask.message) {
          addFrontImage(null);
        }

        // reset side image if there is hard validation error
        // in the side image
        if (sideTask.message) {
          addSideImage(null);
        }

        route('/hard-validation', true);
      } else if (error && error.response && error.response.status === 400) {
        route('/not-found', true);
      } else if (error && error.response && error.response.data) {
        const { detail, brand: brandError, body_part: bodyPartError } = error.response.data;
        alert(detail || brandError || bodyPartError);
        route('/not-found', true);
      } else {
        alert(error);
        route('/not-found', true);
      }
    }
  }

  openVideo = () => {
    gaTutorialDesktop();

    route('/tutorial', true);
  }

  copyUrl = () => {
    gaCopyUrl();
  }

  triggerFrontImage = () => {
    const frontFile = document.getElementById('front');
    frontFile.click();

    gaOpenCameraFrontPhoto();
  }

  triggerSideImage = () => {
    const sideFile = document.getElementById('side');
    sideFile.click();

    gaOpenCameraSidePhoto();
  }

  render() {
    const {
      qrCodeUrl,
      isPending,
      isFrontImageValid,
      isSideImageValid,
      frontImagePose,
      frontImageBody,
      sideImagePose,
      sideImageBody,
    } = this.state;

    const {
      frontImage,
      sideImage,
      gender,
      isMobile,
    } = this.props;

    let title = 'SCAN THIS QR CODE';

    if (isMobile && ((!frontImage && !sideImage) || (!frontImage && sideImage))) {
      title = 'Take Front photo';
    } else if (isMobile && frontImage && !sideImage) {
      title = 'Take Side photo';
    }

    return (
      <div className="screen active">
        <div className={classNames('screen__content', 'upload', { 'upload--is-mobile': isMobile })}>
          <h2 className="screen__subtitle">
            <span className="success">STEP 1</span>
            <span className="screen__subtitle-separ success" />
            <span className="success">STEP 2</span>
          </h2>

          <h3 className="screen__title upload__title">{title}</h3>
          <p>and proceed on your mobile device</p>

          {(!isMobile)
            ? (
              <QRCodeBlock className="upload__qrcode" data={qrCodeUrl} onCopy={this.copyUrl} />
            ) : null }

          <h3 className="screen__title upload__title-2">OR UPLOAD PHOTOS FROM YOUR PC</h3>

          <div className="upload__block">
            <div className="upload__video">
              <button className="upload__video-btn" type="button" onClick={this.openVideo}>
                <img src={playIcon} alt="Play icon" />
                <span>Play</span>
              </button>
              <p>View tutorial</p>
            </div>
            <div className="upload__files">
              <UploadBlock
                className={classNames({
                  active: isMobile && ((!frontImage && !sideImage) || (!frontImage && sideImage)),
                })}
                gender={gender}
                type="front"
                validation={{ pose: frontImagePose, body: frontImageBody }}
                change={this.saveFrontFile}
                isValid={isFrontImageValid}
                value={frontImage}
              />
              <UploadBlock
                className={classNames({
                  active: isMobile && frontImage && !sideImage,
                })}
                gender={gender}
                type="side"
                validation={{ pose: sideImagePose, body: sideImageBody }}
                change={this.saveSideFile}
                isValid={isSideImageValid}
                value={sideImage}
              />
            </div>
          </div>

        </div>
        <div className="screen__footer">
          <button
            className={classNames('button', 'upload__front-image-btn', {
              active: isMobile && ((!frontImage && !sideImage) || (!frontImage && sideImage)),
            })}
            onClick={this.triggerFrontImage}
            type="button"
          >
            Take a photo
          </button>

          <button
            className={classNames('button', 'upload__side-image-btn', {
              active: isMobile && frontImage && !sideImage,
            })}
            onClick={this.triggerSideImage}
            type="button"
          >
            Take a photo
          </button>

          {(!isMobile)
            ? (
              <button
                className="button"
                onClick={this.onNextButtonClick}
                type="button"
                disabled={!frontImage || !sideImage}
              >
                next
              </button>
            ) : null }
        </div>

        <Preloader isActive={isPending} />
      </div>

    );
  }
}

export default connect(state => state, actions)(Upload);
