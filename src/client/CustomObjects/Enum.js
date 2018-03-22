//@ts-check
/**
 * Enum of dimension types: none, 2D, 3D
 */
const DimensionType = Object.freeze({NONE:0,TWO_D:1,THREE_D:2});

/**
 * Enum of axes: x, y, z
 */
const Axis = Object.freeze({'X': 0, 'Y': 1, 'Z': 2});

export default {DimensionType, Axis};
export {DimensionType, Axis};