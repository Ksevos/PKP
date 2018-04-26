//@ts-check
/**
 * Enum of dimension types: none, 2D, 3D
 */
const DimensionType = Object.freeze(
{
    NONE:0,
    TWO_D:1,
    THREE_D:2
});

/**
 * Enum of axes: x, y, z
 */
const Axis = Object.freeze(
{
    'X': 0, 
    'Y': 1, 
    'Z': 2
});

/**
 * Enum of x,y,z axis colors
 */
const AxisColor = Object.freeze(
{
    X_AXIS: '#ff0000',
    Y_AXIS: '#00ff00',
    Z_AXIS: '#0000ff'
});

/**
 * Enum of default colors for React components
 */
const Theme = Object.freeze(
{
    /** #429ef4 */
    BUTTON_TOGGLED_BACKGROUND: '#429ef4',
    /** #ffffff */
    BUTTON_DEFAULT_BACKGROUND: "#ffffff",
    /** #4d7886 */
    BUTTON_TOGGLED_BORDER: 'rgba(77, 120, 134, 0.781)',
    /** #a1c7d4 */
    BUTTON_DEFAULT_BORDER: 'rgba(161, 199, 212, 0.781)'
});

module.exports = { DimensionType, Axis, AxisColor, Theme };