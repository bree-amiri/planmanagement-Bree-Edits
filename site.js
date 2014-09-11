window.onload = function() {

  var canvas = new fabric.Canvas('c');
  canvas.setBackgroundImage('plans.jpg', canvas.renderAll.bind(canvas));

  var lastPoint = null;

  canvas.on({
    'object:selected': onObjectSelected,
    'object:moving': onObjectMoving,
    'before:selection:cleared': onBeforeSelectionCleared
  });

  $(document).ready( function() {
//Bree
$("#update-info").hide();
	$("#footer .sub-menu").hide();
$('input').bind('keyup', function(evt) {
  if (evt.keyCode == 40) {
      // down key
      $('input').elementAfter(this).focus();
  } else if (evt.keyCode == 38) {
      // up key
      $('input').elementBefore(this).focus();
  }
});
//Bree End
    $('#insertPin').click(function(){
      canvas.off('mouse:down');
      $('.active').removeClass('active');
      $(this).addClass('active');
      pointsSelectable(false);
      canvas.isDrawingMode = false;

      var mouse_pos = { x:0 , y:0 };

      canvas.observe('mouse:down', function(e) {
        mouse_pos = canvas.getPointer(e.e);
        fabric.loadSVGFromURL('point.svg', function(objects, options) {
          var obj = fabric.util.groupSVGElements(objects, options);
          canvas.add(obj);
          obj.set({left: mouse_pos.x, top: mouse_pos.y});
          obj.setCoords();
          canvas.off('mouse:down');
          canvas.renderAll();
          canvas.calcOffset();
          pointsSelectable(true);
        });
      })
    })

    $('#convertToLine').click(function(){
      convertToLine();
    })

    $('#convertRadiusLine').click(function(){
      var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();

      var l=0;

      if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        if (objectsInGroup.length == 2){

          objectsInGroup.forEach(function(object) {
            object.pType = 'lineVertex';
          })

          var grpLeft = activeGroup.getLeft(),
            grpTop = activeGroup.getTop()

          var line = new fabric.Path('M 65 0 L 100, 100', { fill: '', stroke: 'green',strokeWidth:2, pType:'line' });

          line.path[0][1] = grpLeft + objectsInGroup[0].left;
          line.path[0][2] = grpTop + objectsInGroup[0].top;

          line.path[1][1] = grpLeft + objectsInGroup[1].left;
          line.path[1][2] = grpTop + objectsInGroup[1].top;

          line.selectable = false;
          canvas.add(line);

          if(!objectsInGroup[0].origin){
            objectsInGroup[0].origin = new Array();
          }

          if(!objectsInGroup[0].destination){
            objectsInGroup[0].destination = new Array();
          }

          if(!objectsInGroup[1].origin){
            objectsInGroup[1].origin = new Array();
          }

          if(!objectsInGroup[1].destination){
            objectsInGroup[1].destination = new Array();
          }

          objectsInGroup[0].origin.push(line);
          objectsInGroup[1].destination.push(line);

          canvas.renderAll();
          canvas.calcOffset();
        } else {
          alert('Please select 2 points');
        }
      }
      else if (activeObject) {
        alert('Please select 2 points');
      }
    })

    $('#convertToCurve').click(function(){
      var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();

      var l=0;

      if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        if (objectsInGroup.length == 2){

          objectsInGroup.forEach(function(object) {
            object.pType = 'lineVertex';
          })

          var grpLeft = activeGroup.getLeft(),
            grpTop = activeGroup.getTop()

          var line = new fabric.Path('M 65 0 Q 100, 100, 200, 0', { fill: '', stroke: 'red', strokeWidth:2, pType:'curvedLine' });

          ilabel = new fabric.Text($('#increment').val().toString(), {
            fontFamily: 'Arial',
            fontSize: '12',
            left: grpLeft,
            top: grpTop,
            textAlign: "center",
            name:'label_' + $('#increment').val(),
            selectable:false,
            lockRotation:true,
            lockScalingX:true,
            lockScalingY:true,
            hasControls: false,
            hasRotatingPoint: false,
            pType:'pointLabel',
            fill:'red'
          })

          handle = new fabric.Circle({
            left: grpLeft,
            top: grpTop,
            radius: 3,
            fill: 'transparent',
            stroke: 'blue',
            strokeWidth: 3,
            hasBorders: true,
            hasControls: false,
            hasRotatingPoint: false,
            lockRotation:true,
            lockScalingX:true,
            lockScalingY:true,
            name:'radiusHandle_' + $('#increment').val(),
            pType:'radiusHandle',
            label:ilabel
          });

          ilabel.point = handle;
          canvas.add(ilabel);
          canvas.add(handle);

          point.label.selectable = false;

          line.path[0][1] = grpLeft + objectsInGroup[0].left;
          line.path[0][2] = grpTop + objectsInGroup[0].top;

          line.path[1][1] = grpLeft;
          line.path[1][2] = grpTop;

          line.path[1][3] = grpLeft + objectsInGroup[1].left;
          line.path[1][4] = grpTop + objectsInGroup[1].top;

          line.selectable = false;
          canvas.add(line);


          if(!objectsInGroup[0].origin){
            objectsInGroup[0].origin = new Array();
          }

          if(!objectsInGroup[0].handle){
            objectsInGroup[0].handle = new Array();
          }

          if(!objectsInGroup[0].destination){
            objectsInGroup[0].destination = new Array();
          }

          if(!objectsInGroup[1].origin){
            objectsInGroup[1].origin = new Array();
          }

          if(!objectsInGroup[1].handle){
            objectsInGroup[1].handle = new Array();
          }

          if(!objectsInGroup[1].destination){
            objectsInGroup[1].destination = new Array();
          }

          objectsInGroup[0].origin.push(line);
          objectsInGroup[0].handle.push(line);
          objectsInGroup[1].destination.push(line);
          objectsInGroup[1].handle.push(line);

          handle.line = line;

          canvas.renderAll();
          canvas.calcOffset();
        } else {
          alert('Please select 2 points');
        }
      }
      else if (activeObject) {
        alert('Please select 2 points');
      }
    })

    $('#arrow').click(function(){
      canvas.off('mouse:down');
      $('.active').removeClass('active');
      $(this).addClass('active');
      lastPoint = null;
      $("#footer .sub-menu").hide();
    })

    $('#assignPoint').click(function(){
      canvas.off('mouse:down');
      $('.active').removeClass('active');
      $(this).addClass('active');
      pointsSelectable(false);
      canvas.isDrawingMode = false;

      var mouse_pos = { x:0 , y:0 };

      canvas.observe('mouse:down', function(e) {
        mouse_pos = canvas.getPointer(e.e);

        newPoint(mouse_pos);

        //canvas.off('mouse:down');
        canvas.renderAll();
        canvas.calcOffset();
        pointsSelectable(true);
      });
    })

    $('#convertDrillPoint').click(function(){
      activeObject = canvas.getActiveObject();

      activeObject.stroke = 'green';
      activeObject.pType = 'drillPoint';
      activeObject.radius = 3;

      canvas.renderAll();
      canvas.calcOffset();
    })

    $('#convertSSM').click(function(){
      pointsSelectable(false);
      activeObject = canvas.getActiveObject();

      activeObject.stroke = 'transparent';
      activeObject.fill = 'black';
      activeObject.pType = 'ssmPoint';
      activeObject.radius = 2;
      var string = activeObject.label.text.toString();
      string.replace('[','');
      string.replace(']','');
      string.replace('(','');
      string.replace(')','');

      activeObject.label.text = '[' + string + ']';

      pointsSelectable(true);
      canvas.renderAll();
      canvas.calcOffset();

    })

    $('#convertEasement').click(function(){
      pointsSelectable(false);
      activeObject = canvas.getActiveObject();

      activeObject.stroke = 'transparent';
      activeObject.fill = 'black';
      activeObject.pType = 'EasementPoint';
      activeObject.radius = 3;
      var string = activeObject.label.text.toString();
      string.replace('[','');
      string.replace(']','');
      string.replace('(','');
      string.replace(')','');

      activeObject.label.text = '(' + string + ')';

      pointsSelectable(true);
      canvas.renderAll();
      canvas.calcOffset();

    })

    $('#remove').click(function() {
      var activeObject = canvas.getActiveObject(),
          activeGroup = canvas.getActiveGroup();

      if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function(object) {
          canvas.remove(object);
        });
      }
      else if (activeObject) {

        if(activeObject.label){
          canvas.remove(activeObject.label);
        }

        if(activeObject.handle){
          canvas.remove(activeObject.handle);
        }

        if(activeObject.origin){
          activeObject.origin.forEach(function(line){
            canvas.remove(line);
          })
        }

        if(activeObject.destination){
          activeObject.destination.forEach(function(line){
            canvas.remove(line);
          })
        }

        canvas.remove(activeObject);
      }
    });

    $("#scaleLine").click(function(){

    })

    $("#text-input").click(function(){
      canvas.off('mouse:down');
      $('.active').removeClass('active');
      $(this).addClass('active');
      pointsSelectable(false);
      canvas.isDrawingMode = false;

      if (canvas.getContext) {
        var context = canvas.getContext('2d');
      }

      var text, size, color;

      var mouse_pos = { x:0 , y:0 };

      text = $('#text').val();
      size = $('#size').val();
      color = $('#color').val();

      canvas.observe('mouse:down', function(e) {

        mouse_pos = canvas.getPointer(e.e);
        size = parseInt(size, 10);

        canvas.add(new fabric.Text(text, {
          fontFamily: 'Arial',
          fontSize: size,
          left: mouse_pos.x,
          top: mouse_pos.y,
          textAlign: "left",
          fontWeight: 'bold'
        }));
        canvas.off('mouse:down');
        canvas.renderAll();
        canvas.calcOffset();
        pointsSelectable(true);
      });

    });
    $("#draw").click(function(){
      canvas.isDrawingMode = true;
      canvas.freeDrawingLineWidth = 5;
      canvas.renderAll();
      canvas.calcOffset();
    });
    $("#rect").click(function(){
      pointsSelectable(false);
      var mouse_pos = { x:0 , y:0 };

      canvas.isDrawingMode = false;

      canvas.observe('mouse:down', function(e) {
        mouse_pos = canvas.getPointer(e.e);

        canvas.add(new fabric.Rect({
          left: mouse_pos.x,
          top: mouse_pos.y,
          width: 75,
          height: 50,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 3,
          padding: 10
        }));

        canvas.off('mouse:down');
        pointsSelectable(true);

      });

    });
    $("#circle").click(function(){
      pointsSelectable(false);
      var mouse_pos = { x:0 , y:0 };

      canvas.isDrawingMode = false;

      canvas.observe('mouse:down', function(e) {
        mouse_pos = canvas.getPointer(e.e);

        canvas.add(new fabric.Circle({
          left: mouse_pos.x,
          top: mouse_pos.y,
          radius: 30,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 3
        }));

        canvas.off('mouse:down');
        pointsSelectable(true);

      });

    });
    $("#ellipse").click(function(){
      pointsSelectable(false);
      var mouse_pos = { x:0 , y:0 };

      canvas.isDrawingMode = false;

      canvas.observe('mouse:down', function(e) {
        mouse_pos = canvas.getPointer(e.e);

        canvas.add(new fabric.Ellipse({
          rx: 45,
          ry: 25,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 8,
          left: mouse_pos.x,
          top: mouse_pos.y
        }));

        canvas.off('mouse:down');
        pointsSelectable(true);

      });

    });
    $("#line").click(function(){
      pointsSelectable(false);
      canvas.isDrawingMode = false;

      if (canvas.getContext) {
        var context = canvas.getContext('2d');
      }

      canvas.observe('mouse:down', function(e) { mousedown(e); });
      canvas.observe('mouse:move', function(e) { mousemove(e); });
      canvas.observe('mouse:up', function(e) { mouseup(e); });

      var started = false;
      var startX = 0;
      var startY = 0;

      /* Mousedown */
      function mousedown(e) {
        var mouse = canvas.getPointer(e.e);
        started = true;
        startX = mouse.x;
        startY = mouse.y;
        canvas.off('mouse:down');
      }

      /* Mousemove */
      function mousemove(e) {

        if(!started) {

          return false;

        }
        canvas.off('mouse:move');

      }

      /* Mouseup */
      function mouseup(e) {

        if(started) {

          var mouse = canvas.getPointer(e.e);

          canvas.add(new fabric.Line([startX, startY, mouse.x, mouse.y],{ stroke: "#000000", strokeWidth: 2 }));
          canvas.renderAll();
          canvas.calcOffset();

          started = false;
          canvas.off('mouse:up');
          pointsSelectable(true);
        }

      }

    });

    $("#showhide").click(function(){
      if($(this).data('mode') == 'hide'){
        $(this).attr('value','Show All');
        $(this).addClass('active');
        $(this).data('mode','show');
        canvas.forEachObject(function(object){
          object.animate('opacity', '0', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas)
          });
        })
      } else if($(this).data('mode') == 'show'){
        $(this).attr('value','Hide All');
        $(this).removeClass('active');
        $(this).data('mode','hide');
        canvas.forEachObject(function(object){
          object.animate('opacity', '1', {
            duration: 200,
            onChange: canvas.renderAll.bind(canvas)
          });
        })
      }
    })

    $("#save").click(function(){
      canvas.isDrawingMode = false;
      if(!window.localStorage){alert("This function is not supported by your browser."); return;}
      // save to localStorage
      var json = JSON.stringify(canvas);
      window.localStorage.setItem("hoge", json);
    });
    $("#load").click(function(){
      canvas.isDrawingMode = false;
      if(!window.localStorage){alert("This function is not supported by your browser."); return;}
      //clear canvas
      canvas.clear();
      //load from localStorage
      canvas.loadFromJSON(window.localStorage.getItem("hoge"));
      // re-render the canvas
      canvas.renderAll();
      // optional
      canvas.calcOffset();
    });
    $("#delete").click(function(){
      canvas.isDrawingMode = false;
      if(!window.localStorage){alert("This function is not supported by your browser."); return;}
      if (confirm('Are you sure?')) {
        window.localStorage.removeItem("hoge");
      }
    });
    $("#clear").click(function(){
      canvas.isDrawingMode = false;
      if (confirm('Are you sure?')) {
        canvas.clear();
        i=1;
      }
    });

    $("#advline").click(function(){
      $('.active').removeClass('active');
      $(this).addClass('active');

      canvas.deactivateAll().renderAll();
      var mouse_pos = { x:0 , y:0 };

      canvas.observe('mouse:down', function(e) {
        mouse_pos = canvas.getPointer(e.e);
        var nPoint = null;

        if(canvas.getActiveObject()){
          nPoint = canvas.getActiveObject();
        } else {
          nPoint = newPoint(mouse_pos);
        }

        if(lastPoint){
          convertToLine(lastPoint,nPoint);
        }

        lastPoint = nPoint;
      })
    });

    $("#remove").click(function(){
      canvas.isDrawingMode = false;

      var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
      if (activeObject) {
        if (confirm('Are you sure?')) {
          canvas.remove(activeObject);
        }
      }
      else if (activeGroup) {
        if (confirm('Are you sure?')) {
          var objectsInGroup = activeGroup.getObjects();
          canvas.discardActiveGroup();
          objectsInGroup.forEach(function(object) {
            canvas.remove(object);
          });
        }
      }

    });
    $("#image_save").click(function(){
      canvas.isDrawingMode = false;
      if(!window.localStorage){alert("This function is not supported by your browser."); return;}
      // save to localStorage
      var base64 = $('canvas').get(0).toDataURL('png');
      window.localStorage.setItem("foo", base64);
    });
    $("#image_load").click(function(){
      canvas.isDrawingMode = false;
      if(!window.localStorage){alert("This function is not supported by your browser."); return;}
      //load from localStorage
      var base64 = window.localStorage.getItem("foo");
      if (base64) {
        if (canvas.getContext) {
          var context = canvas.getContext('2d');
        }
        canvas.clear();
        var image = new Image();
        image.onload = function() {
          fabric.Image.fromURL(image.src, function(img) {
            canvas.add(img);
            img.set('originX', 350);
            img.set('originY', 300);
            img.set('left', 350);
            img.set('top', 300);
            img.set('zindex', 0);
            img.set('selectable', false);
            canvas.bringToFront(img);
          });
          canvas.renderAll();
          canvas.calcOffset();
        };
        image.src = base64;
      }
    });
    $("#image_delete").click(function(){
      canvas.isDrawingMode = false;
      if(!window.localStorage){alert("This function is not supported by your browser."); return;}
      if (confirm('Are you sure?')) {
        window.localStorage.removeItem("foo");
      }
    });
    $("#image_out").click(function(){
      canvas.isDrawingMode = false;

      var json = JSON.stringify(canvas);

      // add the temporary canvas
      tempCanvas = document.createElement('canvas');
      tempCanvas.id = 'tmp_canvas';
      var temp_canvas = new fabric.Canvas('tmp_canvas',{backgroundColor : "#fff"});
      temp_canvas.setWidth(700);
      temp_canvas.setHeight(600);
      wrapperEl = document.createElement('div');
      wrapperEl.className = 'CONTAINER_CLASS';
      fabric.util.makeElementUnselectable(wrapperEl);
      $('body').append(tempCanvas.wrapperEl);

      temp_canvas.loadFromJSON(json);
      temp_canvas.renderAll();
      temp_canvas.calcOffset();

      var base64 = temp_canvas.toDataURL("png");

      var image = new Image();
      image.onload = function() {
        window.open(image.src);
      }
      image.src = base64;

      // remove the temporary canvas
      $("#tmp_canvas").remove();

    });
    $("#pdf_out").click(function(){
      canvas.isDrawingMode = false;

      canvas.backgroundColor = "white";
      canvas.renderAll();

      var base64 = $('canvas').get(0).toDataURL('image/jpeg');

      var doc = new jsPDF('landscape');
      doc.addImage(base64, 'JPEG', 0, 0, 250, 214);

      var data = doc.output();
      var buffer = new ArrayBuffer(data.length);
      var array = new Uint8Array(buffer);

      for (var i = 0; i < data.length; i++) {
        array[i] = data.charCodeAt(i);
      }

      var blob = new Blob(
        [array],
        {type: 'application/pdf', encoding: 'raw'}
      );

      saveAs(blob, 'draft.pdf');
      canvas.backgroundColor = "rgba(0, 0, 0, 0)";
      canvas.renderAll();

    });

    $('#applyLabel').click(function(){
      activeObject = canvas.getActiveObject();
      if (activeObject.label){
        activeObject.label.text = $('#label_text').val();
      } else if (activeObject.text){
        activeObject.text = $('#label_text').val();
      }
      canvas.renderAll();
    })

  //////////////Bree
  
  	$("#job-type").change(function(){

var e = document.getElementById("job-type");
var selectedType = e.options[e.selectedIndex].value;
 
$("#dp-label").text(selectedType);
 	if (selectedType=="I"){
 	$("#interim-div").show();
 	$("#dp").hide();
 	$("#sec").hide();
 	var ee=document.getElementByClass(".dp-sec");
 	ee.hide();
 	}else{
 		$("#interim-div").hide();
 		$("#dp").show();
 	$("#sec").show();
 	}
 	
 	 });

$("#new-info").click(function(){

	$("#new-job").show();
	
});
$("#new-cancel").click(function(){

	$("#new-job").hide();
	
});
$("#edit-info").click(function(){

	$("#info").hide();
	$("#update-info").show();
});

$("#update-details").click(function(){

	$("#info").show();
	$("#update-info").hide();
});

$("#add-dp").click(function(){
	$("#footer .sub-menu").hide();
	$("#menu-dp").show();
	 $('.active').removeClass('active');
      $(this).addClass('active');
});
$("#add-Point").click(function(){
	$("#footer .sub-menu").hide();
	$("#menu-bd").show();
	 $('.active').removeClass('active');
      $(this).addClass('active');
});
$("#add-text").click(function(){
	$("#footer .sub-menu").hide();
	$("#menu-text").show();
	 $('.active').removeClass('active');
      $(this).addClass('active');
        canvas.off('mouse:down');
});
$("#add-boundary").click(function(){
	$("#footer .sub-menu").hide();
	$("#menu-parcel").show();
	 $('.active').removeClass('active');
      $(this).addClass('active');
});

$("#first-point").keyup(function (enter) {
	
	if (enter.keyCode == 13) {
		 var point = $(this).val();
	//	alert(point);
	$(this).val("");
		var dpoint=$('<input class="point-nums" style= "width:40px;background-color:#545454;text-align:center;border-radius:30px;color:#d4d4d4;"type="text" name="point No." value="'+point+'">');
		
		dpoint.appendTo($(".rising").find("li"));
		
		var i=($(".rising input").length);
		if (i > 10){$(".rising").find("input").eq(i-11).fadeOut("slow");}
	}
		if (enter.keyCode == 38) {
			
			var inputs = $(".rising").find('input');
			 inputs.eq(inputs.index(this) ).focus();
				}
		if (enter.keyCode == 40) {
			
			
		}
	});
$('.rising').keyup(function (enter) {
 index = $(this).find('input').index($('input').filter(':focus'));
	
	
	if (enter.keyCode == 40||enter.keyCode == 13 ) {
      // down key
  var inputs = $(".rising").find('input');
      if (inputs.length-index >10 ){
       inputs.eq(index ).fadeOut();
      	
      }
      inputs.eq(index+1).focus();
    
  } 
   if (enter.keyCode == 38  ) {
    
      // up key
    var inputs = $(".rising").find('input');
    inputs.eq(index-1 ).fadeIn();
     inputs.eq(index-1 ).focus();
  
     
  }
		
});

 /////////////////Bree
  jQuery.fn.elementAfter = function(other) {
    for(i = 0; i < this.length - 1; i++) {
        if (this[i] == other) {
            return jQuery(this[i + 1]);
        }
    }
    return jQuery;
};

jQuery.fn.elementBefore = function(other) {
    if (this.length > 0) {               
        for(i = 1;  this.length; i++) {
            if (this[i] == other) {
                return jQuery(this[i - 1]);
            }
        }
    }
    return jQuery;
};
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  });

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
  function onObjectSelected(e) {
    var activeObject = e.target;

    if(activeObject.pType == "pointLabel"){
      canvas.setActiveObject(activeObject.point);
      activeObject = activeObject.point;
    }

    if(activeObject.label){
      $('.changeLabel').show();
      $('#label_text').val(activeObject.label.text);
    } else if (activeObject.text){
      $('.changeLabel').show();
      $('#label_text').val(activeObject.text);
    }
  }

  function onBeforeSelectionCleared(e) {
    var activeObject = e.target;

    $('.changeLabel').hide();
  }

  function onObjectMoving(e) {
    var p = e.target;

    if(p.pType == "pointLabel"){
      p.top = p.point.top;
      p.left = p.point.left;
      canvas.setActiveObject(p.point);
      activeObject = p.point;
    }

    if (p.label){
      p.label.top = p.top,
        p.label.left = p.left
    }

    if (p.pType == "lineVertex") {

      if(p.origin){
        p.origin.forEach(function(line){
          if(line){
            line.path[0][1] = p.left;
            line.path[0][2] = p.top;
          }
        });
      }

      if (p.destination){
        p.destination.forEach(function(line){
          if(line.pType == "curvedLine"){
            line.path[1][3] = p.left;
            line.path[1][4] = p.top;
          }

          if (line.pType == "line") {
            line.path[1][1] = p.left;
            line.path[1][2] = p.top;
          }
        });
      }
    }

    if (p.pType == "radiusHandle") {

      if (p.line) {
        p.line.path[1][1] = p.left;
        p.line.path[1][2] = p.top;
      }
    }
  }

  function pointsSelectable(value){
    var ignore = ['line', 'curvedLine','pointLabel'];
    canvas.forEachObject(function(object){
      if ($.inArray(object.pType,ignore)){
        object.selectable = value;
      } else if(object.pType = 'pointLabel'){
        object.selectable = false;
      }
    })
  }

  function newPoint(mouse_pos){
    ilabel = new fabric.Text($('#increment').val().toString(), {
      fontFamily: 'Arial',
      fontSize: '12',
      left: mouse_pos.x,
      top: mouse_pos.y,
      textAlign: "center",
      name:'label_' + $('#increment').val(),
      selectable:false,
      lockRotation:true,
      lockScalingX:true,
      lockScalingY:true,
      hasControls: false,
      hasRotatingPoint: false,
      //fontWeight: 'normal'
      pType:'pointLabel',
      fill:'red'
    })

    point = new fabric.Circle({
      left: mouse_pos.x,
      top: mouse_pos.y,
      radius: 3,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      hasBorders: true,
      hasControls: false,
      hasRotatingPoint: false,
      lockRotation:true,
      lockScalingX:true,
      lockScalingY:true,
      name:'point_' + $('#increment').val(),
      pType:'point',
      label:ilabel
    });

    ilabel.point = point;
    canvas.add(ilabel);
    canvas.add(point);

    point.label.selectable = false;

    $('#increment').val(parseInt($('#increment').val()) + 1);

    return point;
  }

  function convertToLine(point1, point2){

    if(point1 && point2){
      var group = new fabric.Group([
        point1,point2
      ]);
      //canvas.setActiveObject(point1,point2);
      canvas.setActiveGroup(group);
    }


    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();

    var l=0;

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();

      if (objectsInGroup.length == 2){

        objectsInGroup.forEach(function(object) {
          object.pType = 'lineVertex';
        })

        var grpLeft = activeGroup.getLeft(),
          grpTop = activeGroup.getTop()

        var line = new fabric.Path('M 65 0 L 100, 100', { fill: '', stroke: 'red', strokeWidth:2, pType:'line' });

        line.path[0][1] = grpLeft + objectsInGroup[0].left;
        line.path[0][2] = grpTop + objectsInGroup[0].top;

        line.path[1][1] = grpLeft + objectsInGroup[1].left;
        line.path[1][2] = grpTop + objectsInGroup[1].top;

        line.selectable = false;
        canvas.add(line);

        if(!objectsInGroup[0].origin){
          objectsInGroup[0].origin = new Array();
        }

        if(!objectsInGroup[0].destination){
          objectsInGroup[0].destination = new Array();
        }

        if(!objectsInGroup[1].origin){
          objectsInGroup[1].origin = new Array();
        }

        if(!objectsInGroup[1].destination){
          objectsInGroup[1].destination = new Array();
        }

        objectsInGroup[0].origin.push(line);
        objectsInGroup[1].destination.push(line);

        canvas.renderAll();
        canvas.calcOffset();
      } else {
        alert('Please select 2 points');
      }
    }
    else if (activeObject) {
      alert('Please select 2 points');
    }

    canvas.deactivateAll().renderAll();
  }

  var rx = /INPUT|SELECT|TEXTAREA/i;

  $(document).bind("keydown keypress", function(e){
    if( e.which == 8 ){ // 8 == backspace
      if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
        e.preventDefault();
      }
    }
  });

  canvas.calcOffset();

  document.onkeyup = function(e) {
    canvas.renderAll();
  };

  setTimeout(function() {
    canvas.calcOffset();
  }, 100);
  
  $("#save").click(function(){
    $("#savediv").html(JSON.stringify(canvas));
  })

};