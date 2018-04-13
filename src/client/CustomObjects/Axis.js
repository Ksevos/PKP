import * as THREE from 'three';
import {Axis, AxisColor} from "../CustomObjects/Enum";

export default class Axis {

    constructor(size, alignment) {
        this.line = null;
        this.dashes = [];
        this.sprites = [];
    }
}