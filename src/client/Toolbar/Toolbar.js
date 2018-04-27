//@ts-check

import dat from "dat.gui";
import Toggle2DEvent from '../Events/Event';
import ColorGeneratorInstance from "../shared/ColorGenerator";
import {AxisColor} from "../CustomObjects/Enum";

const AxesConstants = {
    X_AXIS: "xAxis",
    Y_AXIS: "yAxis",
    Z_AXIS: "zAxis",
};

const Options = function () {
    this.color = "#FFF";
    this.xAxis = null;
    this.yAxis = null;
    this.zAxis = null;
    this.dimension = '3D';
    this.restore = () => {
    };
    this.classes = new Map();
};

class Toolbar extends dat.GUI {
    constructor(threeRendererInstance, dataHandlerInstance) {
        super();
        this.colorGeneratorInstance = ColorGeneratorInstance;
        this.toggle2DEvent = new Toggle2DEvent(this);

        this.isView3D = true;
        this.threeRenderer = threeRendererInstance;
        this.dataHandlerInstance = dataHandlerInstance;
        let sceneConfiguratorInstance = threeRendererInstance.getSceneConfigurator();

        this.options = new Options();

        const renderer = threeRendererInstance.getRenderer();

        //backgroundFolder
        const backgroundFolder = this.addFolder('Background');

        backgroundFolder.addColor(this.options, 'color')
            .onChange((value) => {
                renderer.setClearColor(value);
            });

        //viewFolder
        const viewFolder = this.addFolder('View');


        dataHandlerInstance.getAxesNames().subscribe((axes) => {
            this.setDefaultAxes();
            let xAxis = this._addAxis(viewFolder, AxesConstants.X_AXIS, axes);
            let yAxis = this._addAxis(viewFolder, AxesConstants.Y_AXIS, axes);
            let zAxis = this._addAxis(viewFolder, AxesConstants.Z_AXIS, axes);

            this.add(this.options, 'dimension', ['2D', '3D']).name('Dimension')
                .onChange((value) => {
                    if (value === '3D') {
                        this.isView3D = true;
                        zAxis = this._addAxis(viewFolder, AxesConstants.Z_AXIS, axes);
                    } else {
                        this.isView3D = false;
                        viewFolder.remove(zAxis);
                    }
                    this._rerenderAxis();
                    this.toggle2DEvent.notify(!this.isView3D);
                });
            this.add(this.options, 'restore').name('Restore').onChange((value) => {
                if (this.isView3D) {
                    this.threeRenderer.center3DCameraToData(this.dataHandlerInstance);
                }else{
                    this.threeRenderer.center2DCameraToData(this.dataHandlerInstance);
                }
            });
        });

        //classesFolder
        const classesFolder = this.addFolder('Classes');
        let classesFolderControllers = [];

        dataHandlerInstance.getClasses().subscribe((dataClasses) => {
            sceneConfiguratorInstance.getSceneCreated().subscribe((e) => {
                classesFolderControllers.forEach((controller) => {
                    classesFolder.remove(controller);
                });
                classesFolderControllers = [];
                this.options.classes = this.colorGeneratorInstance.generatedColors;
                dataClasses.map((dataClass) => {
                    const pointsObject = sceneConfiguratorInstance.getSceneObjectByName('name__' + dataClass);
                    if (pointsObject) {
                        let controller = classesFolder.addColor({classes: this.options.classes.get(dataClass)}, 'classes')
                            .name(dataClass).onChange((colorValue) => {
                            pointsObject.material.color.setHex(colorValue.replace('#', '0x'));
                            this.colorGeneratorInstance.changeGeneratedColor(dataClass, colorValue);
                        });
                        classesFolderControllers.push(controller);
                    }
                });
            })

        });
    }

    /**
     * Creates axes select list
     * @param {dat.GUI} folder
     * @param {string} optionName
     * @param {string[]} axisNames
     * @returns {dat.GUIController}
     * @private
     */
    _addAxis(folder, optionName, axisNames) {
        let controller = folder.add(this.options, optionName, axisNames);
        controller.onChange(() => {
            this._rerenderAxis();
        });
        let color = null;
        switch (optionName) {
            case AxesConstants.X_AXIS: {
                color = AxisColor.X_AXIS;
                break;
            }
            case AxesConstants.Y_AXIS: {
                color = AxisColor.Y_AXIS;
                break;
            }
            case AxesConstants.Z_AXIS: {
                color = AxisColor.Z_AXIS;
                break;
            }
        }
        controller.domElement.setAttribute('style', `background-color: ${color}`);
        return controller;
    }

    _rerenderAxis() {
        this.dataHandlerInstance.changeAxes(this.options.xAxis, this.options.yAxis, this.isView3D ? this.options.zAxis : null);
    }

    setDefaultAxes() {
        let defaultAxes = this.dataHandlerInstance._getDefaultAxes();
        this.options.xAxis = defaultAxes.x;
        this.options.yAxis = defaultAxes.y;
        this.options.zAxis = defaultAxes.z;
    }

    subscribeToToggle2DEvent(listener) {
        this.toggle2DEvent.subscribe(listener);
    }
}

export default Toolbar;