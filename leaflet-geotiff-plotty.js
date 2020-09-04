// Depends on:
// https://github.com/santilland/plotty

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	var L = require('leaflet-geotiff');
	var plotty = require('plotty');
}

L.LeafletGeotiff.Plotty = L.LeafletGeotiffRenderer.extend({

	options: {
		colorScale: 'viridis',
		clampLow: true,
		clampHigh: true,
		displayMin: 0,
		displayMax: 1
	},

	initialize: function(options) {
		if (typeof (plotty) === 'undefined') {
			throw new Error("plotty not defined");
		}
		this.name = "Plotty";
	plotty.addColorScale("ndvi-color-scale", ['#FF0000', '#CE7E45', '#DF923D', '#F1B555', '#FCD163', '#99B718', '#74A901','#66A000', '#529400', '#3E8601', '#207401', '#056201', '#004C00', '#023B01','#012E01', '#011D01', '#011301'], [0.000, 0.100, 0.150, 0.200, 0.250, 0.300, 0.350, 0.400, 0.450, 0.500, 0.550, 0.600, 0.650, 0.750, 0.800, 0.850, 0.900]);
	plotty.addColorScale("fertilizer-color-scale",['#EBEC8B','#9EC573','#55A05C'],[0,0.333,0.666,1]
        L.setOptions(this, options);
		
		this._preLoadColorScale();
	},

    setColorScale: function (colorScale) {
        this.options.colorScale = colorScale;
        this.parent._reset();
    },

    setDisplayRange: function (min,max) {
        this.options.displayMin = min;
        this.options.displayMax = max;
        this.parent._reset();
    },

    _preLoadColorScale: function () {
        var canvas = document.createElement('canvas');
        var plot = new plotty.plot({
            canvas: canvas,
			data: [0],
            width: 1, height: 1,
            domain: [this.options.displayMin, this.options.displayMax], 
            colorScale: this.options.colorScale,
            clampLow: this.options.clampLow,
            clampHigh: this.options.clampHigh,
        });
        this.colorScaleData = plot.colorScaleCanvas.toDataURL();            
    },
	
	render: function(raster, canvas, ctx, args) {
		var plottyCanvas = document.createElement("canvas");
		var plot = new plotty.plot({
			data: raster.data,
			width: raster.width, height: raster.height,
			domain: [this.options.displayMin, this.options.displayMax], 
			colorScale: this.options.colorScale,
			clampLow: this.options.clampLow,
			clampHigh: this.options.clampHigh,
			canvas: plottyCanvas,
			useWebGL: false
		});
		plot.setNoDataValue(-9999); 
		plot.render();

		this.colorScaleData = plot.colorScaleCanvas.toDataURL();

		var rasterImageData = plottyCanvas.getContext("2d").getImageData(0, 0, plottyCanvas.width, plottyCanvas.height);
		var imageData = this.parent.transform(rasterImageData, args);
		ctx.putImageData(imageData, args.xStart, args.yStart); 
	}

});

L.LeafletGeotiff.plotty = function (options) {
    return new L.LeafletGeotiff.Plotty(options);
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = L.LeafletGeotiff;
}
