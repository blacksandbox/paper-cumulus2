/* global $ */
/* global jQuery */
// Above line is to prevent cloud9 from thinking 
// '$' is an undefined variable

$(document).ready(function(){
    console.log("ajax_crud.js ---------- * v0.3.9");
    
    // Bind events
    bindEvents_main($(this));
    
    
    
    
    var scenePk = $('#strip_form').find('select#id_scene').val();
    //------------------------------------
    // on strip_form submit
    //------------------------------------
    $('#strip_form').submit(function(event){
        
        // disable default form action
        event.preventDefault();
        
        //prep form data
        var formData = $(this).serialize();

        //ajax call
        $.ajax({
            url: '/api/scene/'+scenePk+'/strip/create/',
            data: formData,
            method: 'POST',
            success: function (data) {
                console.log("sucessfully posted new strip");
                addNewStrip(data);
            },
            error: function (data) {
                console.error(data);
                console.log(data.status);
            }
        });
    });
    
    // //Animation test
    // $('#strip_form').submit(function(event){
    //     event.preventDefault();
        
    //     addNewStrip({'id':0});
        
    // });
    
 
    //------------------------------------
    // on frame_form submit
    //------------------------------------
    $('#frame_form').submit(function(event){
        // disable default form action
        event.preventDefault();
        
        //prep form data
        //var formData = $(this).serialize();
        var formData = new FormData($(this)[0]);
        var stripPk = $(this).find('select#id_strip').val();
        
        console.log($(this))
    
        //ajax call
        $.ajax({
            url: '/api/strip/'+stripPk+'/frame/create/',
            data: formData,
            method: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                console.log("sucessfully created frame strip");
                addNewFrame(data, stripPk);
            },
            error: function (data) {
                console.error(data);
                console.log(data.status);
            }
        });
        
    });
    
    //------------------------------------
    // on frame delete 
    //------------------------------------
    
    // Because this isn't rendered into the template, this will have to be 
    // binded upon append. Delete button/link is appended at bind_miniMenu().
    // See list of binding functions below.
    
    
    
});









/*-----------------------------------------------------------------
----------------------- binding functions -------------------------
-------------------------------------------------------------------*/

// -----------------------------
// Basic button binding function
// -----------------------------
function bindEvents_main($doc){
    
    $doc.find('.strip_flex_container').each(function(){
        
        // 1. Button that open new frame form ----------- 
        $(this).find(".frame_form").click(function(){
            // In the template, the dynamic form for frame-create should exist.
            // Relocate the form into the appropriate strip container
            
            $doc.find('.frame_form').show();
            $(this).toggle();
            
            // Warning: this assumes the button is located only a single depth into the 
            //          .strip_flex_container, but it may not be the case in the future. 
            var currStripContainer = $(this).parent();
            var targetForm = $doc.find("#frame_form").eq(0);
            targetForm.hide()
            targetForm.slideToggle();
            targetForm.appendTo(currStripContainer);
            
            //auto-fill the form
            var currStripId = $(this).attr("for").split("strip_")[1]; 
            console.log("curr strip id: " + currStripId);
            targetForm.find('#id_strip').val(currStripId);
            
        });
        
        
        //test
        // $(this).find(".frame_form").click(function(){
            
        //     var data = {'id': 12, 'frame_image_native':"/media/frame_images/scene_4_/strip_1-1.png.300x300_q85_autocrop.png"};
        //     addNewFrame(data, 33);
            
        // });
        
    }); 
    
    // 2. Bind mini menu
    bind_miniMenu($doc);
}


function bind_miniMenu($doc, $targetOptional){
    var $target = $targetOptional
    
    if ($target == null){
        //do for all mini menus if target not specified
        $target = $doc.find('.thumb .mini_menu.edit');
    } else if ($targetOptional instanceof jQuery == false){
        console.error("Cannot bind mini menu even to non-Jquery object.");
        return false;
    }
    
    $target.click(function(event){
        event.preventDefault();
        
        //append menu if there isn't one
        if ($(this).parent().find('.popup_menu').length < 1){
            
            var $popupEditMenu = $(popupEditMenuTemplate);
            $popupEditMenu.appendTo($(this).parent());
            
            var popupHeader = $popupEditMenu.find("ul li.header");
            var headerSegs = popupHeader.text().split('{{frame.id}}');
            var frameid = $(this).parent().attr("frameid");
            popupHeader.text(headerSegs[0] + frameid + headerSegs[1]);
            
            // append done. Bind events to the buttons and elements 
            
            // a. Bind close event. The popup menu closes when you are out of focus. 
            $popupEditMenu.focusout(function(){
                console.error("out");
                $(this).hide();
            });
            
            // b. Bind 'delete' action
            $popupEditMenu.find('.action.delete').click(function(){
                event.preventDefault();
                
                //ajax call
                $.ajax({
                    url: '/flipbooks/frame/'+ frameid +'/delete/',
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: function () {
                        console.log("DELETE");
                    },
                    success: function (data) {
                        //show form
                        addDeleteConfirmForm(data, $popupEditMenu);
                        $popupEditMenu.find('#delete-confirm-button').click(function(event){
                            // Note: #delete-confirm-button is a <a> that acts
                            //       like a submit() for the form 
                            //       #delete-confirm.
                            
                            event.preventDefault();
                            var $deleteForm = $popupEditMenu.find('#delete-confirm');
                            return ajax_frame_delete($deleteForm, frameid);
                        });
                    },
                    error: function (data) {
                        console.error(data);
                        console.log(data.status);
                    }
                });
                        
            }); //end: bind 'delete'
            
            // c. Bind 'delete CONFIRM' button
            // Sepatate function because this button is dynamically generated
            // $popupEditMenu.find('.action.delete-confirm').click(function(){
            //     return ajax_frame_delete_test(frameid);
            // });
            

            
        } else {
            //event.stopPropagation();
            var $popupEditMenu = $(this).parent().find('.popup_menu');
            $popupEditMenu.show();
        }
        
        $popupEditMenu.focus();
    });
    
}



var ajax_frame_delete = function($form, frameid){ 
    
    $.ajax({
        url: '/flipbooks/frame/'+ frameid +'/delete/',
        method: 'POST',
        data: $form.serialize(),
        dataType: 'json',
        beforeSend: function () {
            console.log("Actual Deletion in progress");
        },
        success: function (data) {
            //show animation of deletion
            $(document).find('.thumb[frameid='+ frameid +']').animate({
                opacity: 0,
            }, 300, function() {
                //actually delete
                $(this).remove();
            });
        },
        error: function (data) {
            console.error(data);
            console.log(data.status);
        }
    });
}

var ajax_frame_delete_test = function(frameid){
    //animation test
    console.log("actual deletion");
    $(document).find('.thumb[frameid='+ frameid +']').animate({
        opacity: 0,
    }, 300, function() {
        //actually delete
        $(this).remove();
    });
}





/*-----------------------------------------------------------------
---------------------- rendering functions ------------------------
-------------------------------------------------------------------*/


var popupEditMenuTemplate = `
<div href="" class="popup_menu edit" tabindex="2">
    <span class="tickmark"></span>
    <ul>
        <li class="header">Frame: {{frame.id}}</li>
        <li><a class="action delete">Delete</a></li>
    </ul>
</div>
`

var stripTemplate = `
<div class="strip_flex_container" stripid="{{strip.id}}">
    <div class="header">
        <span class="bigtext-1">{{forloop.counter}}</span>
        <br>
        <span>id: {{strip.id}}</span>
        </div>
        
    <!-- open frame_form -->
    <div class="tile frame_form" displaytype="add" for="strip_{{strip.id}}">
        <span style="font-size:4em">+</span>
        Add Frames
    </div>
</div>
`

function addNewStrip(data){
  
    
    var stripObj = data
    
    var stripList = $('ul.list_strips');
    
    //var stripTemplate = stripList.children('li').last().clone();
    //Grab template, fill in {{strip.id}}
    var templateSegments = stripTemplate.split("{{strip.id}}");
    var templateConcated = templateSegments[0];
    for (var i=1;i<templateSegments.length;i++){
        templateConcated += stripObj.id + templateSegments[i];
    }

    var newStrip = $(templateConcated)
    
    newStrip.appendTo(stripList);
    newStrip.toggle();
    
    //update index
    var last_index = $(document).find("ul.list_strips").find(".strip_flex_container").length;
    newStrip.find(".header").children('span').eq(0).text(Number(last_index)+1);
    
    // Show
    newStrip.slideToggle( "slow" );
    
}


var thumbTemplate_ = `
<div class='thumb'>
    <img src="" width='200px'/>
    <a href="" class="mini_menu edit">frame[{}]</a>
</div>
`

function addNewFrame(data, stripId){
    
    var frameObj = data;
    
    //need to add it in the right place
    var newFrameThumb = $(thumbTemplate_);
   
    
    //fill in id
    var id_label = newFrameThumb.children('a').text();
    id_label = id_label.split("{}")[0] + frameObj.id + id_label.split("{}")[1]
    newFrameThumb.children('a').text(id_label);
    //fill in image
    newFrameThumb.children("img").attr("src", frameObj.frame_image_native);
    
    var targetStripContainer = $('.strip_flex_container[stripid='+stripId+']');
    newFrameThumb.insertBefore(targetStripContainer.find('.frame_form'));
    
    //animate
    newFrameThumb.toggle();
    newFrameThumb.slideToggle( "fast" );
}


function addDeleteConfirmForm(data, $container){
    //the data should be already-rendered form
    console.log(data);
    $container.html(data['html_form']);
   
}