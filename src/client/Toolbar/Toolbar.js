//@ts-check

import dat from "dat.gui";
import Toggle2DEvent from '../Events/Event';


const Options = function () {
    this.color = "#FFF";
    this.xAxis = 'x1';
    this.yAxis = 'x2';
    this.zAxis = 'x3';
    this.dimension = '3D';
    this.restore = () => {

    };
};

class Toolbar extends dat.GUI {
    constructor(threeRendererInstance, dataHandlerInstance) {
        super();
        this.toggle2DEvent = new Toggle2DEvent(this);

        this.isView3D = true;
        this.threeRenderer = threeRendererInstance;
        this.dataHandlerInstance = dataHandlerInstance;

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
            this._addAxis(viewFolder, 'xAxis', axes);
            this._addAxis(viewFolder, 'yAxis', axes);
            let zAxis = this._addAxis(viewFolder, 'zAxis', axes);

            this.add(this.options, 'dimension', ['2D', '3D']).name('Dimension')
                .onChange((value) => {
                    if (value === '3D') {
                        this.isView3D = true;
                        zAxis = this._addAxis(viewFolder, 'zAxis', axes);
                    } else {
                        this.isView3D = false;
                        viewFolder.remove(zAxis);
                    }
                    this._rerenderAxis();
                    this.toggle2DEvent.notify(!this.isView3D);
                });
            this.add(this.options, 'restore').name('Restore').onChange((value) => {
                this.threeRenderer.centerCameraToData(this.dataHandlerInstance);
            });
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
        return controller;
    }

    restoreView() {
        console.log('aa');
    }

    _rerenderAxis() {
        this.dataHandlerInstance.changeAxes(this.options.xAxis, this.options.yAxis, this.isView3D ? this.options.zAxis : null);
    }

    subscribeToToggle2DEvent(listener){
        this.toggle2DEvent.subscribe(listener);
    }
}

export default Toolbar;