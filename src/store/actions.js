/**
 * CONSTANTS constants
 */
export const CONSTANTS = {
  RESET_STATE: 'RESET_STATE',
  SET_MEASUREMENTS: 'SET_MEASUREMENTS',
  SET_IS_MOBILE: 'SET_IS_MOBILE',
  SET_IS_FROM_DESKTOP_TO_MOBILE: 'SET_IS_FROM_DESKTOP_TO_MOBILE',
  SET_ORIGIN: 'SET_ORIGIN',
  SET_RETURN_URL: 'SET_RETURN_URL',
  SET_TOKEN: 'SET_TOKEN',
  ADD_FRONT_IMAGE: 'ADD_FRONT_IMAGE',
  ADD_SIDE_IMAGE: 'ADD_SIDE_IMAGE',
  ADD_HEIGHT: 'ADD_HEIGHT',
  ADD_GENDER: 'ADD_GENDER',
  ADD_AGREE: 'ADD_AGREE',
  SET_FLOW_ID: 'SET_FLOW_ID',
  SET_PERSON_ID: 'SET_PERSON_ID',
  SET_BRAND: 'SET_BRAND',
  SET_BODY_PART: 'SET_BODY_PART',
  SET_PRODUCT_URL: 'SET_PRODUCT_URL',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_SOFT_VALIDATION: 'SET_SOFT_VALIDATION',
  SET_HARD_VALIDATION: 'SET_HARD_VALIDATION',
};

/**
 * Save measurements
 */
export const setMeasurements = measurements => ({
  type: CONSTANTS.SET_MEASUREMENTS,
  payload: measurements,
});

/**
 * Reset state
 */
export const resetState = () => ({
  type: CONSTANTS.RESET_STATE,
});

/**
 * Set is mobile device
 *
 * @param {boolean} isMobile - is mobile device
 */
export const setIsMobile = isMobile => ({
  type: CONSTANTS.SET_IS_MOBILE,
  payload: isMobile,
});

/**
 * Set if user continue flow from desktop to mobile
 *
 * @param {string} isFromDesktopToMobile - is from desktop to mobile
 */
export const setIsFromDesktopToMobile = isFromDesktopToMobile => ({
  type: CONSTANTS.SET_IS_FROM_DESKTOP_TO_MOBILE,
  payload: isFromDesktopToMobile,
});

/**
 * Set origin
 *
 * @param {string} origin - origin
 */
export const setOrigin = origin => ({
  type: CONSTANTS.SET_ORIGIN,
  payload: origin,
});

/**
 * Set return url
 *
 * @param {string} returnUrl - return url
 */
export const setReturnUrl = returnUrl => ({
  type: CONSTANTS.SET_RETURN_URL,
  payload: returnUrl,
});

/**
 * Set api token action
 *
 * @param {string} token - api token
 */
export const setToken = token => ({
  type: CONSTANTS.SET_TOKEN,
  payload: token,
});

/**
 * Add front image action
 *
 * @param {string} frontImage - base64 encoded front image
 */
export const addFrontImage = frontImage => ({
  type: CONSTANTS.ADD_FRONT_IMAGE,
  payload: frontImage,
});

/**
 * Add side image action
 *
 * @param {string} frontImage - base64 encoded side image
 */
export const addSideImage = sideImage => ({
  type: CONSTANTS.ADD_SIDE_IMAGE,
  payload: sideImage,
});

/**
 * Add height value action
 *
 * @param {number} height - user's height
 */
export const addHeight = height => ({
  type: CONSTANTS.ADD_HEIGHT,
  payload: height,
});

/**
 * Add gender value action
 *
 * @param {string} gender - user's gender
 */
export const addGender = gender => ({
  type: CONSTANTS.ADD_GENDER,
  payload: gender,
});

/**
 * Add agree value action
 *
 * @param {boolean} agree - user's agree value
 */
export const addAgree = agree => ({
  type: CONSTANTS.ADD_AGREE,
  payload: agree,
});

/**
 * Set flow id action
 *
 * @param {boolean} agree - user's agree value
 */
export const setFlowId = flowId => ({
  type: CONSTANTS.SET_FLOW_ID,
  payload: flowId,
});

/**
 * Set person id action
 *
 * @param {number} personId - person id value
 */
export const setPersonId = personId => ({
  type: CONSTANTS.SET_PERSON_ID,
  payload: personId,
});

/**
 * Set brand action
 *
 * @param {string} brand - brand name
 */
export const setBrand = brand => ({
  type: CONSTANTS.SET_BRAND,
  payload: brand,
});

/**
 * Set body part action
 *
 * @param {string} bodyPart - body part
 */
export const setBodyPart = bodyPart => ({
  type: CONSTANTS.SET_BODY_PART,
  payload: bodyPart,
});

/**
 * Set product url
 *
 * @param {string} productUrl - product url
 */
export const setProductUrl = productUrl => ({
  type: CONSTANTS.SET_PRODUCT_URL,
  payload: productUrl,
});

/**
 * Set recommendations
 *
 * @param {Object} recommendations - recommendations
 * @param {string} recommendations.tight - tight size
 * @param {string} recommendations.normal - normal (regular) size
 * @param {string} recommendations.loose - loose size
 */
export const setRecommendations = recommendations => ({
  type: CONSTANTS.SET_RECOMMENDATIONS,
  payload: recommendations,
});

/**
 * Set soft validation
 *
 * @param {Object} softValidation - recommendations
 * @param {Object} softValidation.front - front photo soft validation
 * @param {number} softValidation.front.bodyAreaPercentage - percentage of the body on
 * the front  photo
 * @param {number} softValidation.front.legsDistance - distance between legs on the front photo
 * @param {string[]} softValidation.front.messages - front photo validation messages
 * @param {Object} softValidation.side - side photo soft validation
 * @param {number} softValidation.side.bodyAreaPercentage - percentage of the body on
 * the side  photo
 * @param {string[]} softValidation.side.messages - side photo validation messages
 */
export const setSoftValidation = softValidation => ({
  type: CONSTANTS.SET_SOFT_VALIDATION,
  payload: softValidation,
});

/**
 * Set hard validation
 *
 * @param {Object} hardValidation - recommendations
 * @param {sting} hardValidation.front - front photo hard validation message
 * @param {sting} hardValidation.side - side photo hard validation message
 */
export const setHardValidation = hardValidation => ({
  type: CONSTANTS.SET_HARD_VALIDATION,
  payload: hardValidation,
});

export default {
  setMeasurements,
  resetState,
  setIsMobile,
  setIsFromDesktopToMobile,
  setReturnUrl,
  setOrigin,
  setToken,
  addFrontImage,
  addSideImage,
  addHeight,
  addGender,
  addAgree,
  setFlowId,
  setPersonId,
  setBrand,
  setBodyPart,
  setProductUrl,
  setRecommendations,
  setSoftValidation,
  setHardValidation,
};
