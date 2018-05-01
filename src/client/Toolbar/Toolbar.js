//@ts-check

import dat from "dat.gui";
import Toggle2DEvent from '../Events/Event';
import colorGenerator from "../shared/ColorGenerator";
import {AxisColor} from "../CustomObjects/Enum";
import Renderer from "../Renderer/Renderer";
import DataHandler from "../DataHandler";

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

/**
 * Used to modify settings and for axis selection
 */
class Toolbar extends dat.GUI {
    /**
     * @param {Renderer} threeRenderer
     * @param {DataHandler} dataHandler
     */
    constructor(threeRenderer, dataHandler) {
        super();
        this.colorGenerator = colorGenerator;

        this.isView3D = true;
        this.threeRenderer = threeRenderer;
        this.dataHandler = dataHandler;
        this.sceneConfigurator = threeRenderer.getSceneConfigurator();

        this.options = new Options();

        this.controllers = {
            xAxis: null,
            yAxis: null,
            zAxis: null,
            axesFolder: null,
            backgroundFolder: null
        };

        /**@type {string[]} */
        this.axesNames = [];

        this._addBackgroundSelection();
        this._addAxisSelectionFolder();
        this._addClassSelectionFolder();
        this._addRestoreButton();
    }

    /**
     * Add a section for Background color customization
     * @private
     */
    _addBackgroundSelection(){
        const renderer = this.threeRenderer.getRenderer();

        this.backgroundFolder = this.addFolder('Background');

        this.backgroundFolder.addColor(this.options, 'color').name('Color')
            .onChange((value) => {
                renderer.setClearColor(value);
            });
    }

    /**
     * Add a section for Axis selection
     * @private
     */
    _addAxisSelectionFolder(){

        this.controllers.axesFolder = this.addFolder('Data Axes');

        this.dataHandler.getAxesNames().subscribe((axes) => {
            this.axesNames = axes;
            this.setDefaultAxes();
            this.controllers.xAxis = this._addAxisSelectList(this.controllers.axesFolder, AxesConstants.X_AXIS, "X Axis", axes);
            this.controllers.yAxis = this._addAxisSelectList(this.controllers.axesFolder, AxesConstants.Y_AXIS, "Y Axis", axes);
            this.controllers.zAxis = this._addAxisSelectList(this.controllers.axesFolder, AxesConstants.Z_AXIS, "Z Axis", axes);
        });
    }

    /**
     * Add a section for class color customization
     * @private
     */
    _addClassSelectionFolder(){
        //classesFolder
        const classesFolder = this.addFolder('Classes');
        let classesFolderControllers = [];
        let sceneConfigurator = this.threeRenderer.getSceneConfigurator();

        this.dataHandler.getClasses().subscribe((dataClasses) => {
            sceneConfigurator.getSceneCreated().subscribe((e) => {
                classesFolderControllers.forEach((controller) => {
                    classesFolder.remove(controller);
                });
                classesFolderControllers = [];
                this.options.classes = this.colorGenerator.generatedColors;
                dataClasses.map((dataClass) => {
                    const pointsObject = sceneConfigurator.getSceneObjectByName('name__' + dataClass);
                    if (pointsObject) {
                        let controller = classesFolder.addColor({classes: this.options.classes.get(dataClass)}, 'classes')
                            .name(dataClass).onChange((colorValue) => {
                            //@ts-ignore
                            pointsObject.material.color.setHex(colorValue.replace('#', '0x'));
                            this.colorGenerator.changeGeneratedColor(dataClass, colorValue);
                        });
                        classesFolderControllers.push(controller);
                    }
                });
            })

        });
    }

    /**
     * Add a restore button
     * @private
     */
    _addRestoreButton(){
        this.add(this.options, 'restore').name('Restore').onChange((value) => {
            if (this.isView3D) {
                this.threeRenderer.center3DCameraToData(this.dataHandler);
            }else{
                this.threeRenderer.center2DCameraToData(this.dataHandler);
            }
        });
    }

    /**
     * Creates axes select list
     * @param {dat.GUI} folder Container to add to
     * @param {string} optionName Axis object name in controller
     * @param {string} axisName Axis select list title
     * @param {string[]} axisNames List of currently selected axes
     * @returns {dat.GUIController}
     * @private
     */
    _addAxisSelectList(folder, optionName, axisName, axisNames) {
        let controller = folder.add(this.options, optionName, axisNames).name(axisName);
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
        //@ts-ignore
        controller.domElement.setAttribute('style', `background-color: ${color}`);
        return controller;
    }

    /**
     * Change currently selected axes, which should also rerender them
     * @private
     */
    _rerenderAxis() {
        this.dataHandler.changeAxes(this.options.xAxis, this.options.yAxis, this.isView3D ? this.options.zAxis : null);
    }

    /**
     * Set default selected axes
     */
    setDefaultAxes() {
        let defaultAxes = this.dataHandler._getDefaultAxes();
        this.options.xAxis = defaultAxes.x;
        this.options.yAxis = defaultAxes.y;
        this.options.zAxis = defaultAxes.z;
    }

    /**
     * Callback for 2D toggle event
     * @param {boolean} status true if 2D mode is toggled on
     */
    onToggle2D(status){
        if (status) {
            this.isView3D = false;
            this.controllers.axesFolder.remove(this.controllers.zAxis);
        } 
        else {
            this.isView3D = true;
            this.controllers.zAxis = this._addAxisSelectList(this.controllers.axesFolder, AxesConstants.Z_AXIS, "Z Axis", this.axesNames);
        }
        this._rerenderAxis();
    }
}

export default Toolbar;