/**
 * Created by Alexey Ostrovsky.
 * Date: 02.12.13
 * Time: 1:53
 */




var graphJs = function (data, containerId) {

    createScene();


    function createScene() {
        var containerEl = document.getElementById(containerId);
        var canvas = document.createElement("canvas");
        canvas.id = containerId + "Canvas";

        containerEl.innerHTML = "";
        containerEl.appendChild(canvas);
    };

    var example = document.getElementById("exampleCanvas"),
            decorationsCtx = example.getContext('2d'),
            axisCtx = example.getContext('2d'),
            rullerCtx = example.getContext('2d'),
            ctx = example.getContext('2d');


    // sort initial data
    data = sortData(data);


    var MAX_ARGUMENT = getMax(data, 0),
            MIN_ARGUMENT = getMin(data, 0);

    var MAX_VALUE = getMax(data, 1),
            MIN_VALUE = getMin(data, 1);

    var VALUE_LEGEND_BOUNDS = getMeasures(MAX_VALUE, MIN_VALUE);

    var PADDING = 30;

    var CANVAS_HEIGHT = 480,
            CANVAS_WIDTH = 640;

    var X0 = PADDING,
            Y0 = CANVAS_HEIGHT - PADDING;

    var XMAX = CANVAS_WIDTH - PADDING,
            YMAX = PADDING;

    var DATA_HEIGHT = Y0 - YMAX,
            DATA_WIDTH = XMAX - X0;

    var LENGTH = data.length;

// draw border
    function drawStroke() {
        decorationsCtx.strokeStyle = "#ccc";
        decorationsCtx.strokeRect(0, 0, example.width, example.height);
    }

// draw X, Y axis
    function drawAxis() {
        var x = example.width - PADDING;
        var y = PADDING;
        axisCtx.beginPath();
        axisCtx.moveTo(X0, y);
        axisCtx.lineTo(X0, Y0);
        axisCtx.lineTo(x, Y0);

        axisCtx.strokeStyle = "#777";
        axisCtx.stroke();
    }

    function initCanvas() {
        example.height = CANVAS_HEIGHT;
        example.width = CANVAS_WIDTH;
    }

    function drawData() {
        ctx.beginPath();

        for (var i = 0; i < LENGTH; i++) {
            var coordinate = getCoordinatesByValue(data[i][0], data[i][1]);
            x = coordinate.x;
            y = coordinate.y;

            // потенциально узкое место
            if (i == 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.strokeStyle = "green";
        ctx.stroke();
    }

    function getCoordinatesByValue(x, fx) {
        var x = X0 + x * DATA_WIDTH / MAX_ARGUMENT;
        var y = Y0 - fx * DATA_HEIGHT / VALUE_LEGEND_BOUNDS.max;

        return {
            "x": x,
            "y": y
        }
    }

    function drawVerticalRuller(x) {
        rullerCtx.beginPath();
        rullerCtx.moveTo(x, Y0);
        rullerCtx.lineTo(x, YMAX);

        rullerCtx.strokeStyle = "#eeeeee";
        rullerCtx.stroke();
    }

    function drawHorizontalRuller(y) {
        rullerCtx.beginPath();
        rullerCtx.moveTo(X0, y);
        rullerCtx.lineTo(XMAX, y);

        rullerCtx.strokeStyle = "#eeeeee";
        rullerCtx.stroke();
    }

    function getMax(array, index) {
        return result = array.reduce(function (max, arr) {
            return max >= arr[index] ? max : arr[index];
        }, -Infinity);
    }

    function getMin(array, index) {
        return result = array.reduce(function (min, arr) {
            return min <= arr[index] ? min : arr[index];
        }, Infinity);
    }

    function sortData(array) {
        return array.sort(function (a, b) {
                    return (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
                }
        );
    }

    function getMeasures(max, min) {
        var step = Math.round(Math.pow(10, (Math.log(max - min) / Math.LN10) - 1));
        var N = Math.ceil((max - min) / step);

        return {
            step: step,
            N: N,
            max: min + step * N,
            min: min
        };
    }


    function drawLegend(minx, maxx, miny, maxy) {

        axisCtx.textBaseline = "top";
        axisCtx.textAlign = "right";

        maxy = getMeasures(maxy, miny).max;

        var step = (maxx - minx) / LENGTH;
        for (var i = minx; i < maxx; i += step) {
            x = getCoordinatesByValue(i, i).x;
            drawVerticalRuller(x);
            axisCtx.fillText(i.toFixed(1), x, Y0 + 5)
        }

        axisCtx.textBaseline = "middle";
        step = (maxy - miny) / LENGTH;
        for (var i = miny; i < maxy; i += step) {
            y = getCoordinatesByValue(i, i).y;

            drawHorizontalRuller(y);
            axisCtx.fillText(i.toFixed(1), X0 - 5, y);
        }
    }

    function clearContext(ctx) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    function drawAll() {
        initCanvas();
        drawStroke();
        drawAxis();
        drawLegend(MIN_ARGUMENT, MAX_ARGUMENT, MIN_VALUE, MAX_VALUE);
        drawData();
    }

    drawAll();

};
