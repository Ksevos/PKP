//@ts-check

import dat from "dat.gui";

const Options = function () {
    this.color = "#FFF";
    this.xAxis = 'x1';
    this.yAxis = 'x2';
    this.zAxis = 'x3';
    this.dimension = '3D';
};

class Toolbar extends dat.GUI {
    constructor(threeRendererInstance, dataHandlerInstance) {
        super();
        this.isView3D = true;
        this.threeRendererInstance = threeRendererInstance;
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
        let controller =  folder.add(this.options, optionName, axisNames);
        controller.onChange(() => {
                this._rerenderAxis();
            });
        return controller;
    }

    _rerenderAxis() {
        this.dataHandlerInstance.changeAxes(this.options.xAxis, this.options.yAxis, this.isView3D ? this.options.zAxis : null);
    }
}

export default Toolbar;