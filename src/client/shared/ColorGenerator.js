class ColorGenerator {
    defaultColors = ["#FF0000", "#00FFFF", "#FF00FF"];
    generatedColors = new Map();

    /**
     * Creates ColorGenerator instance if not exist
     * @returns {ColorGenerator}
     */
    constructor() {
        if (!ColorGenerator.instance) {
            ColorGenerator.instance = this;
        }
        return ColorGenerator.instance;
    }

    /**
     * @param dataClass: string
     * @returns {string}
     */
    getColor(dataClass) {
        if (this.generatedColors.has(dataClass)){
            return this.generatedColors.get(dataClass);
        }
        let [color] = this.defaultColors;
        if (color) {
            this.defaultColors.shift();
        } else {
            color = this.getRandomColor();
        }
        this.generatedColors.set(dataClass, color);
        return color;
    }

    changeGeneratedColor(dataClass, color) {
        this.generatedColors.set(dataClass, color);
    }

    /**
     * @returns {string}
     */
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

const ColorGeneratorInstance = new ColorGenerator();
Object.freeze(ColorGeneratorInstance);

export default ColorGeneratorInstance;