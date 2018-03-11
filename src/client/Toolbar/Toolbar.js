//@ts-check

import dat from "dat.gui";

const Options = function () {
    this.color = "#000";
    this.xAxis = 'x1';
    this.yAxis = 'x2';
    this.zAxis = 'x3';
    this.dimension = '3D';
};

class Toolbar extends dat.GUI {
    constructor(threeRendererInstance, dataReaderInstance) {
        super();
        this.isView3D = true;
        this.threeRendererInstance = threeRendererInstance;
        this.dataReaderInstance = dataReaderInstance;

        this.options = new Options();
        const renderer = threeRendererInstance.getRenderer();

        //backgroundFolder
        const backgroundFolder = this.addFolder('Background');

        backgroundFolder.addColor(this.options, 'color')
            .onChange(function () {
                renderer.setClearColor(this.options.color);
            });

        //viewFolder
        const viewFolder = this.addFolder('View');

        dataReaderInstance._queryForData().then(response => {
            const axis = response.valueNames;
            axis.splice(-1, 1);
            const xAxis = this._addAxis(viewFolder, 'xAxis', axis);
            const yAxis = this._addAxis(viewFolder, 'yAxis', axis);
            let zAxis = this._addAxis(viewFolder, 'zAxis', axis);

            this.add(this.options, 'dimension', ['2D', '3D']).name('Dimension')
                .onChange((value) => {
                    if (value === '3D') {
                        this.isView3D = true;
                        zAxis = this._addAxis(viewFolder, 'zAxis', axis);
                    } else {
                        this.isView3D = false;
                        viewFolder.remove(zAxis);
                    }
                    this._rerenderAxis();
                });
        });
    }

    _addAxis(folder, name, axisArray) {
        return folder.add(this.options, name, axisArray)
            .onChange(() => {
                this._rerenderAxis();
            });
        ;
    }

    _rerenderAxis() {
        this.threeRendererInstance.removeDataFromScene();
        this.dataReaderInstance.changeAxes(this.options.xAxis, this.options.yAxis, this.isView3D ? this.options.zAxis : null);
    }
}

export default Toolbar;