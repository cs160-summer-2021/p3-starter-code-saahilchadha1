let pour = true;
		let pencil = false;
		let redo = false;
		let undo = false;
		let undoArray = []; 
		let redoArray = [];
		let colorPast = [];

		window.onload = function() {
			var canvas = document.getElementById('myCanvas');

			// coloring page
			var mandala = {
				item: null,
				lastClicked: null,
				filePath: '/static/coloring/images/mandala-freepik.svg'
			};

			// color palette
			var cp = {
				history: ["#000000"], // black selected by default
				options: [],
				$container: $('#color-palette')
			}


			function myCustomInteraction() {
				var tool = new paper.Tool();

				tool.onMouseDown = function (event) {
				    var hit = mandala.item.hitTest(event.point, { tolerance: 10, fill: true });
				    if (hit) {
				    		// Color pallette keeps track of the full history of colors, though we
				    		// only color in with the most-recent color.
					 	undoArray.push(hit.item);
						redoArray = [];
						$("#redo svg").css({
							"color": "gray"
						})
				        hit.item.fillColor = cp.history[cp.history.length - 1];
						colorPast.push(hit.item.fillColor);
						$("#undo svg").css({
							"color": "black"
						})
				    }
				}
			}

			// create a color palette with the given colors
			function createColorPalette(colors){

				// create a swatch for each color
				for (var i = colors.length - 1; i >= 0; i--) {
					var $swatch = $("<div>").css("background-color", colors[i])
									   .addClass("swatch");
					$swatch.click(function(){
						// add color to the color palette history
					  	cp.history.push($(this).css("background-color"));
					});
					cp.$container.append($swatch);
				}
			}

			// loads a set of colors from a json to create a color palette
			function getColorsCreatePalette(){
				cp.$container.html(" ");
				$.getJSON('/static/coloring/vendors/material/material-colors.json', function(colors){
					var keys = Object.keys(colors);
					for (var i = keys.length - 1; i >= 0; i--) {
						cp.options.push(colors[keys[i]][500]);
					}
					createColorPalette(cp.options);
				});
			}

			function init(custom){
				paper.setup(canvas);
				getColorsCreatePalette();

				paper.project.importSVG(mandala.filePath, function(item) {
					mandala.item = item._children["design-freepik"];
				    paper.project.insertLayer(0,mandala.item);

				    if (custom) {
				    	myCustomInteraction();
				    } else {
				    	myGradientInteraction();
				    }

				});

			}

			// Set up the mandala interactivity.
			init(true);


//-------------Modification by Yi Zhao-------------------


			// Mouse click bucket icon
			$("#bucket svg").click(function() {
				$("#bucket svg").css({
					"color": "black"
				})
				$("#pencil svg").css({
					"color": "gray"
				})
				pour = true;
				pencil = false;
			});

			// Mouse click pencil icon
			$("#pencil svg").click(function() {
				$("#pencil svg").css({
					"color": "black"
				})
				$("#bucket svg").css({
					"color": "gray"
				})
				pour = false;
				pencil = true;
			});

			//Mouse click Undo: 
			//TODO: when we repeatedly color one part, click undo once can bring it last color
			$("#undo svg").click(function() {
				if  (undoArray.length >= 1) {
					undoItem = undoArray.pop();
					undoItem.fillColor = "white";
					redoArray.push(undoItem);
					if (redoArray.length >= 1) {
						$("#redo svg").css({
							"color": "black"
						})							
					}
					if  (undoArray.length === 0) {	
						$("#undo svg").css({
							"color": "gray"
						})	
					} else {
						$("#undo svg").css({
							"color": "black"
						})	
					}
				} 
			});

			//Redo
			$("#redo svg").click(function() {
				if  (redoArray.length >= 1) {
					redoItem = redoArray.pop();
					redoItem.fillColor = colorPast[undoArray.length];
					undoArray.push(redoItem);
					if (undoArray.length >= 1) {
						$("#undo svg").css({
							"color": "black"
						})							
					}
					if  (redoArray.length === 0) {	
						$("#redo svg").css({
							"color": "gray"
						})	
					} else {
						$("#redo svg").css({
							"color": "black"
						})	
					}
				}


			});

		}