//@ts-check
// WARNING: Put Object.freeze() after definition so that JSDoc can read it properly.

/**
 * @module Enum
 * @description Contains various enum-like objects
 */

/**
 * @enum DimensionType
 * @description Enum for dimension types
 * @readonly
 */
const DimensionType = {
    /** @type {Number}
     *  @description No dimensions. Equals to 0*/
    NONE:0,

    /** @type {Number}
     *  @description 2D. Equals to 1*/
    TWO_D:1,

    /** @type {Number}
     *  @description 3D. Equals to 2*/
    THREE_D:2
};
Object.freeze(DimensionType);

/**
 * @enum Axis
 * @description Enum describing axes
 * @readonly
 */
const Axis = {
    /** @type {Number}
     *  @description X axis. Equals to 0*/
    'X': 0,

    /** @type {Number}
     *  @description Y axis. Equals to 1*/
    'Y': 1,

    /** @type {Number}
     *  @description Z axis. Equals to 2*/
    'Z': 2
};
Object.freeze(Axis);

/**
 * @enum AxisColor
 * @description Enum for axis colours
 * @readonly
 */
const AxisColor = {
    /** @type {String}
     *  @description Colour code of X axis (red)*/
    X_AXIS: '#ff0000',

    /** @type {String}
     *  @description Colour code of Y axis (green)*/
    Y_AXIS: '#00ff00',

    /** @type {String}
     *  @description Colour code of Z axis (blue)*/
    Z_AXIS: '#0000ff'
};
Object.freeze(AxisColor);

/**
 * @enum Theme
 * @description Enum for default colours of React components
 * @readonly
 */
const Theme = {
    /** @type {String}
     *  @description Colour code of button background (when toggled)*/
    BUTTON_TOGGLED_BACKGROUND: '#429ef4',

    /** @type {String}
     *  @description Colour code of button background*/
    BUTTON_DEFAULT_BACKGROUND: "#ffffff",

    /** @type {String}
     *  @description Colour code of button border (when toggled)*/
    BUTTON_TOGGLED_BORDER: 'rgba(77, 120, 134, 0.781)',

    /** @type {String}
     *  @description Colour code of button border*/
    BUTTON_DEFAULT_BORDER: 'rgba(161, 199, 212, 0.781)'
};
Object.freeze(Theme);

module.exports = { DimensionType, Axis, AxisColor, Theme };