import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { Sortable } from '@shopify/draggable';
// import Sortable from 'sortablejs';
import Spinner from "./../Spinner";
import { FrameCard, FramePreviewCard } from "./FrameCard";
import { playFrameStage } from "./../FlipbookPlayer";
import { CardCover2 } from "./CardCover"
import key from "weak-key";

// Custom helpers
import Helper from "./../Helper"
const h = new Helper();
import XhrHandler from "./XHRHandler"
const axh = new XhrHandler(); //axios helper




// http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow&t=Frame

// ███╗   ███╗ ██████╗ ██████╗  █████╗ ██╗     ███████╗
// ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝
// ██╔████╔██║██║   ██║██║  ██║███████║██║     ███████╗
// ██║╚██╔╝██║██║   ██║██║  ██║██╔══██║██║     ╚════██║
// ██║ ╚═╝ ██║╚██████╔╝██████╔╝██║  ██║███████╗███████║
// ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
                                                                                                 

class MenuButton extends Component {
    constructor(props){
        super(props);
    }

    render (){
        return (
            <a className={this.props.iconClass} onClick={this.props.action}></a>
        )
    }
}


// http://patorjk.com/software/taag/#p=display&f=Cyberlarge&t=PopupMenu
// ---------------------------------------------------------------------------
//  _____   _____   _____  _     _  _____  _______ _______ __   _ _     _
// |_____] |     | |_____] |     | |_____] |  |  | |______ | \  | |     |
// |       |_____| |       |_____| |       |  |  | |______ |  \_| |_____|

// ---------------------------------------------------------------------------
                                                                       
class StripMenu extends Component {
    /* behaves similarly to CardCover */

    constructor(props){
        super(props);
        this.r = React.createRef();

        this.ignoreBlur = false;
        this.refocus = this.refocus.bind(this);
        this.blurAndAction = this.blurAndAction.bind(this);
    }

    componentDidMount(){
            
        this.r.current.onblur = (e) => {
            if(this.props.on){
                if (this.ignoreBlur){
                    this.ignoreBlur = false; 
                    this.r.current.focus();
                    //blur will potentially not be ignored the next click
                } else {
                    this.props.off();
                }
            }
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.props.on){ this.r.current.focus() } //focus on
    }
    
    // if any element inside the menu is clicked focus on
    refocus(e){
        // any focuses immediately blurred out. See .focus() line in r.current.onblur
            //this.r.current.focus(); 
        this.ignoreBlur = true; // will briefly protect from being blurred
    }

    //blur out to close the menu, and then execute whatever action 
    blurAndAction(actionFunc){
        this.r.current.blur();
        actionFunc();
    }

    render (){
        return (
            <div className={"popup_menu " + (this.props.on ? "active" : "")}>
                <input className="untouchable" type="text" 
                       ref={this.r} 
                       readOnly  />
                <ul onMouseDown={this.refocus}>   
                    <li onClick={()=>console.log("Upload Image!")}>Upload Frames</li>
                    <li>Batch Frame Edit</li>
                    <li>Edit</li>
                    <li>Copy</li>
                    <li onClick={()=>{this.blurAndAction(this.props.actionDelete)}}>Delete</li>
                </ul>
            </div>
        )
    }
}





// NOTE: this is an old version of CardCover2 component
//       might want to absorb this in.

class CardCover_old extends Component {
    constructor(props){
        super(props);
        this.r = React.createRef();
    }

    componentDidUpdate(prevProps, prevState, snapshot){

    }

    render(){
        return (
            <div className={"cover light delete_confirm " + (this.props.on ? "active" : "")}>

                <div className="cover_message">
                    <p>
                    <span className="bigtext 2">Are you sure you want to delete this scene?</span>
                    </p>
                    <p>
                        <span>
                            <button className='warning'>DELETE</button>
                            <button onClick={this.props.off}>Cancel</button></span>
                    </p>
                </div>           
            </div>
        )
    }
}







                                    
// ███████╗ ██████╗ ██████╗ ████████╗ █████╗ ██████╗ ██╗     ███████╗
// ██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝
// ███████╗██║   ██║██████╔╝   ██║   ███████║██████╔╝██║     █████╗  
// ╚════██║██║   ██║██╔══██╗   ██║   ██╔══██║██╔══██╗██║     ██╔══╝  
// ███████║╚██████╔╝██║  ██║   ██║   ██║  ██║██████╔╝███████╗███████╗
// ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
                                                                  
     
function initializeSortable($container, name, callback){
    if ($container == null) {return false;}

    const frameSortable = new Sortable($container, {
        draggable: '.thumb',
        delay: 200,
        mirror: {
            appendTo: document.querySelector('body'),
            //appendTo: $container.getAttribute("class"),
            constrainDimensions: true,
        },
    });

    frameSortable.on('sortable:start', () => {
        //tilt the chosen
        const pickedUp = document.querySelector('.thumb.draggable-mirror');
    });
    frameSortable.on('sortable:stop', () => {
        //get new order
        let thOrder = [];
        $container.querySelectorAll(".thumb").forEach(th=>{
            let thclass = th.getAttribute("class");
            let id = th.getAttribute("frameid");

            if (!thclass.includes("draggable")){
                thOrder.push(id);
            } else if (thclass.includes("draggable-source")){
                thOrder.push(id);
            }
        });

        console.log(thOrder.join(","));
        callback(thOrder);

    });
}




// ███████╗ ██████╗███████╗███╗   ██╗███████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗  
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  
// ███████║╚██████╗███████╗██║ ╚████║███████╗
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝


class StripCard extends PureComponent {

    constructor(props){
        super(props);

        this.$node = React.createRef();
        this.$frameForm = document.querySelector("#frame_create_form");
        this.$lb = document.querySelector("#lightbox_bg"); //lightbox
        
        // Props note:
        // this.props.stripObj
        // this.props.index
        // this.setSceneDataState

        this.state={
            loadingFrames: false,

            cardCoverOn: false,
            menuOn: false,
            dragAndDropOn: false,
            previewOn: false,

            cardCover_messageType: "default"
        }

        // List of state name that is related to modal. 
        // This roster used when turning all of them off
        this.modalStateKeys = ['cardCoverOn', 'menuOn', 'dragAndDropOn'];

        this.selfSpotlighted = false; // as opposed to this.props.spotlightedAll

        this.handle_deleteSceneConfirm = this.handle_deleteSceneConfirm.bind(this);
        this.handle_deleteScene = this.handle_deleteScene.bind(this);
        this.handle_frameSort = this.handle_frameSort.bind(this);
        this.handle_dragMessageToggle = this.handle_dragMessageToggle.bind(this);
        this.handle_dragAndDrop = this.handle_dragAndDrop.bind(this);

        this.openMenu = this.openMenu.bind(this);
        this.openPreview = this.openPreview.bind(this);

        this.endModalState = this.endModalState.bind(this); // more generic version of 'removeCardCover'
        this.setSpotlight = this.setSpotlight.bind(this);

    }




    componentDidMount(){
        const delay = this.props.delay;
        const $node = this.$node.current

        var mountAnim = anime.timeline();
            mountAnim
                .add({
                    targets: $node, scale: 0, duration: 0
                }) 
                .add({
                    targets: $node, scale: 0.5, duration: 0,
                    delay: delay*80
                }) 
                .add({
                    targets: $node, scale: 1, duration: 600,
                    elasticity: 200
                });  

        // Sortable magic
        initializeSortable(this.$node.current.querySelector('.strip_flex_container'), 
                           this.props.index,
                           this.handle_frameSort);
    }


    // componentDidUpdate(prevProps, prevState, snapshot){
    // }

    setSpotlight(on){
        // Set this component in spotlight against lightbox.
        // Due to the nature of this container, only .strip_card can do this

        // modify click event to the LightBox!
        this.props.setState_LightBox({addToOnClick: ()=>{ this.setSpotlight(false); }})

        
        if (on){
            // console.log("setSpotlight " + on);
            this.props.setState_LightBox({active: true});
            this.setState({selfSpotlighted: true});
        } else {
            // console.log("setSpotlight " + on);
            this.props.setState_LightBox({active: false});

            //remove ALL modals or any callouts
            // TODO: isn't this similar to endModalState()?

            this.setState(()=>{
                let st = {};
                const keys = this.modalStateKeys;
                for (var i=0; i<keys.length; i++) {
                    if (this.state.hasOwnProperty(keys[i])) {
                        st[keys[i]] = false;
                    }
                }
                //also remove selfSpotlight
                st.selfSpotlighted = false;
                console.warn("Ready to set state?: " + JSON.stringify(st));
                
                return st;
            });
        }

        
    }




    

    
    // ---------------------------------------------------------------------------
    // _______ _    _ _______ __   _ _______                        
    // |______  \  /  |______ | \  |    |                           
    // |______   \/   |______ |  \_|    |                           
                                                              
    // _     _ _______ __   _ ______         _______  ______ _______
    // |_____| |_____| | \  | |     \ |      |______ |_____/ |______
    // |     | |     | |  \_| |_____/ |_____ |______ |    \_ ______|

    // ---------------------------------------------------------------------------
                                        
                                                                                                       
    handle_deleteSceneConfirm(){
        console.log("handle_deleteSceneCONFIRM");

        //turn on cover
        this.setState({cardCoverOn: true});
    
    }

    handle_deleteScene(){
        // DANGER ZONE!

        const strip = this.props.stripObj;

        console.log("handle_deleteScene");

        // TODO: this returns "forbidden" error
        // axios({
        //     method: 'get',
        //     url: `/api/strip/${strip.id}/delete/`,
        // })
        // .then(response => {
        //     console.log("Delete Request made");
        // })
        // .catch(error => {
        //     console.log(error);
        // })
    }

    handle_frameSort(idArr){

        const strip = this.props.stripObj;
        const sortableData = {frame_ids: idArr.join(",")}
        console.log("ready to send: " +JSON.stringify(sortableData));

        axios({
            method: "get",
            params: sortableData,
            url: `/flipbooks/ajax/strips/${strip.id}/sort-children/`
 
        })
        .then(response =>{
            console.log("sucessfully came back: " + response.data["frame_ids"]);
        })
        .catch(err => {
            console.error(JSON.stringify(err));
            console.error(err.data);
            console.log(data.status);
        })
    }

    handle_dragMessageToggle(e, on){
        // probably already true'd by setSpotlightALL, but just in case
        e.stopPropagation();

        if (on){
            this.setState({
                selfSpotlighted: true,
                dragAndDropOn: true
            });  
       } else {
            this.setState({
                selfSpotlighted: false, //selfSpotlightAll should keep it on
                 dragAndDropOn: false
            }); 
       }
    }

    handle_dragAndDrop(e){
        // parse data?
        e.preventDefault();

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file.

            // Because the backend cannot hande multiple files yet, use just the FIRST file.
            if (e.dataTransfer.items[0].kind === 'file') { // check if file 

                var file = e.dataTransfer.items[0].getAsFile();
                console.log('>> file[' + 0 + '].name = ' + file.name + " : type = " + file.type);

                // CHECKPOINT 1: image only
                const allowedImageTypes = ['image/png', 'image/gif', 'image/jpg'];
                if (!allowedImageTypes.includes(file.type)){
                    // exit abruptly. This causes this component to remain in dragAndDrop state
                    this.setState({cardCover_messageType: "wrongFileType"});
                    return false;
                }

                // Frameform does not actually hold any useful information.
                // Just extract csrfToken from it
                const frameFormData = h.serializeForm(this.$frameForm);
                const csrfToken = frameFormData ? (frameFormData.hasOwnProperty("csrfmiddlewaretoken") ? frameFormData.csrfmiddlewaretoken : null) : null;

                // CHECKPOINT 2: valid CSRF token
                if (!csrfToken){
                    // exit abruptly. This causes this component to remain in dragAndDrop state.
                    this.setState({cardCover_messageType: "invalidForm"});
                    return false;
                }

                // Build formData
                //let formData = new FormData(); //decided not to use this until I actually understand
                frameFormData.strip = this.props.stripObj.id;
                frameFormData.frame_image = file;
                
                console.log("Formdata done: " + JSON.stringify(frameFormData));
                
                let fd = new FormData();
                fd.append("strip", this.props.stripObj.id);
                fd.append("frame_image", file)
    
                // Ship it off
                axios({
                    method: 'post',
                    url: `/api/strip/${this.props.stripObj.id}/frame/create/`,
                    data: fd,
                    headers: {
                                "X-CSRFToken": frameFormData.csrfmiddlewaretoken,
                                //"Content-Type": 'multipart/form-data' // don't need it
                             }
                })
                .then(response => {
                    console.log("FrameCreate successful: " + JSON.stringify(response.data));
                    console.log("Congrats!!!");

                    // stop loading state
                    // TODO: In the future, it may not be just one request
                    this.setState({loadingFrames: false}); 

                    //RE-fetch. God, how do I do that.
                    // This is a function in SceneCardList 
                    this.props.handle_fetchScene();

                })
                .catch(error => {
                    console.log(error);
                    // Well that didn't work!
                    this.setState({cardCover_messageType: "frameCreateError"});

                });

            }

        
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
            }
        } 

        // TODO: Pass event to removeDragData for cleanup
        // removeDragData(e)

        // If you reached this point, then you avoided all errors from user side.
        this.setState({loadingFrames: true});
        // crap...I thought any kind of setState is async? if I don't put this
        // here, anything that happens afterward may or may not happen
        console.warn("Request send success. Escape dragAndDrop state.");
        this.endModalState("dragAndDropOn", true);


    }





    // ---------------------------------------------------------------------------
    // _______ _______ __   _ _     _    /  _____  _______ __   _ _______       
    // |  |  | |______ | \  | |     |   /  |_____] |_____| | \  | |______ |     
    // |  |  | |______ |  \_| |_____|  /   |       |     | |  \_| |______ |_____
    //                                /                                         
    // _______ _  _  _ _____ _______ _______ _     _ _______ _______            
    // |______ |  |  |   |      |    |       |_____| |______ |______            
    // ______| |__|__| __|__    |    |_____  |     | |______ ______|            
                                                                          
    // ---------------------------------------------------------------------------
                                                              
    openMenu(){
        this.setState({menuOn: true});
        // Note: because Strip Menu is nested inside this container
        //       it appear behind the next Strip container. 
        //       By toggling the z-index, it is propped up to the top.
        this.$node.current.setAttribute('style', 'z-index:1000;');
        this.$node.current.setAttribute('style', '');
    }

    // openPreview(){
    // too simple. added as arrow function on onClick        
    // }

    openPreview(){

        // Play if preview already opened
        if (this.state.previewOn){
            playFrameStage();
        } else {
            this.setState({previewOn: true});
            // FrameStage component is set to autoplay upon mount, only when standlone
        }
        
    }

    // Generic function for hiding any modal or callouts
    // Use this function to end spotlighted sessions like 'cardCoverOn' or 'dragAndDropOn'
    endModalState(stateName, spotlighted){
        if (stateName){
            console.log("Hiding component by state: " + stateName);
            this.setState(()=>{
                let s={};
                s[stateName] = false; 
                return s;
            });

            if (spotlighted){
                //remove spotlight
                this.setSpotlight(false);
            }
        }
        return;
    }

    // returns list of frame objects in order referencing children_li
    reorderFrames(strip){
        const frameIdList = strip.children_li.split(",");
        if (frameIdList==null || frameIdList==='') {return null;}

        let frameOrderedArr = Array.apply(null, Array(frameIdList.length));
        let frameLeftOver = [];

        strip.frames.forEach((f)=>{
            const insertAt = frameIdList.indexOf(String(f.id));
            if (insertAt>=0 && insertAt<frameOrderedArr.length){
                frameOrderedArr[insertAt] = f; 
            } else if (insertAt==-1){
                // children not ref'd in children_li is just placed at the end
                frameLeftOver.push(f);
            }
            
        });

        if (frameLeftOver.length>0){
            frameOrderedArr.push(...frameLeftOver);
        }

        return frameOrderedArr;

    }





    // ---------------------------------------------------------------------------
    //  ______ _______ __   _ ______  _______  ______
    // |_____/ |______ | \  | |     \ |______ |_____/
    // |    \_ |______ |  \_| |_____/ |______ |    \_

    // ---------------------------------------------------------------------------
                                               
    render(){
        const strip = this.props.stripObj;
        const index = this.props.index;
        const reorderedFrames = this.reorderFrames(strip);
        
        return (
            <li className={"strip_card " +
                           (this.props.spotlightedAll || this.state.selfSpotlighted ? "spotlighted" : "")} 
                onDragOver={(e)=>(this.handle_dragMessageToggle(e, true))}
                onDragLeave={(e)=>(this.handle_dragMessageToggle(e, false))}
                onDrop={this.handle_dragAndDrop}
                ref={this.$node}>
                {/* Keep strip_card position:relative to allow being "highlightable"
                    as well as allowing popups and callouts to appear around it */}
   
                <div className="strip_flex_toolbar">
                    <div className="header">
                        <span className="bigtext-2">{index}</span>
                        <span>id: {strip.id}</span>
                    </div>
                    <div className="tools">
                        <MenuButton iconClass="tool_btn fas fa-play-circle" action={this.openPreview}/>
                        <a className="tool_btn fas fa-file-upload"></a>
                        <a className="tool_btn fas fa-pen"></a>
                        <MenuButton iconClass="tool_btn fas fa-trash" action={this.handle_deleteSceneConfirm}/>
                        <MenuButton iconClass="tool_btn fas fa-ellipsis-h" action={this.openMenu}/>
                    </div>
                    
                </div>

                {/* List of frames in this strip*/}
                <div className="strip_content">

                    {/* panel for frame animation preview */}
                    <FramePreviewCard on={this.state.previewOn} off={()=>{this.endModalState("previewOn", true)}}
                                      stripObj={strip}/>

                    {strip.frames == null || strip.frames.length === 0 || Object.keys(strip.frames).length === 0 ? 
                        (
                            <div className="strip_flex_container" stripid={strip.id}>
                                <div className="tile empty-strip ui-state-disabled">
                                    <span>No frames in this strip. Upload some!</span>
                                </div>
                            </div>
                        ) : (
                            <div className="strip_flex_container" stripid={strip.id}>
                                {reorderedFrames.map( (frame, index) => (
                                    <FrameCard frameObj={frame} delay={index+this.props.delay} key={"frame"+index}/>
                                ))}

                                {this.state.loadingFrames && <FrameCard standby={true}/>}
                            </div>
                        )
                    }

                </div>

                {/* Message or modals */}
                <CardCover_old on={this.state.cardCoverOn} off={()=>{this.endModalState("cardCoverOn", true)}}
                           setParentSpotlight={this.setSpotlight}/>
                <CardCover2 on={this.state.dragAndDropOn} off={()=>{this.endModalState("dragAndDropOn", true)}}
                            messageType={this.state.cardCover_messageType}
                            setParentSpotlight={this.setSpotlight}/>
                <StripMenu on={this.state.menuOn} off={()=>{this.endModalState("menuOn");}}
                           actionDelete={this.handle_deleteSceneConfirm}/>

            </li>
        )
    }
}







// ███████╗ ██████╗███████╗███╗   ██╗███████╗██╗     ██╗███████╗████████╗
// ██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝██║     ██║██╔════╝╚══██╔══╝
// ███████╗██║     █████╗  ██╔██╗ ██║█████╗  ██║     ██║███████╗   ██║   
// ╚════██║██║     ██╔══╝  ██║╚██╗██║██╔══╝  ██║     ██║╚════██║   ██║   
// ███████║╚██████╗███████╗██║ ╚████║███████╗███████╗██║███████║   ██║   
// ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝   
                                                                      



class SceneCardList extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: null
        }

        this.firstLoad = true;

        this.handle_fetchScene = this.handle_fetchScene.bind(this);
        // incoming
        //this.props.toSceneCardList

    }

    componentDidMount(){
        this.handle_fetchScene();
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // Check inbox
        if (JSON.stringify(prevProps.dataInbox) != JSON.stringify(this.props.dataInbox)){
            console.log("MAIL TIME [SceneCardList]");
            // Mail time!
            const newData = this.appendData(this.state.data, this.props.dataInbox)
            this.setState({data: newData});
        }

    }

    handle_fetchScene(){
        axh.fetchScene(this.props.sceneId).then(res =>{
            this.setState({data: res.data});
            this.firstLoad = false;
        });
    }

    // takes only one key from newData. Rest will be ignored for now.
    appendData(data, newData){
        console.log("New Data looks like this: " + JSON.stringify(newData.newStrip));

        if (newData == null || Object.keys(newData).length === 0) {
            // newData is invalid. return same data.
            return data;
        }

        switch(Object.keys(newData)[0]){
            case "newStrip":
                //add it to list of strips
                if (data.hasOwnProperty("strips")) { data.strips.push(newData.newStrip) }
            default: 
                return data;
        }
        return data; 
    }



    render (){

        return (
            <div>
            {this.state.data == null ? ( 
                    <p>Strip List Loading...</p>
                ) : (
                    <ul className="list_strips">
                        {this.state.data['strips'].map( (strip,index) => (
                             <StripCard stripObj={strip} 
                                        delay={this.firstLoad ? index : 1} 
                                        index={index+1}
                                        spotlightedAll = {this.props.spotlightedAll}

                                        handle_fetchScene = {this.handle_fetchScene}
                                        setState_LightBox = {this.props.setState_LightBox}

                                        key={"strip"+index}/>
                        )) } 
                    </ul>
                    
                ) //end: ternary
            }
            </div>
        ) //end: return
    } //end: render()


}


export {
    SceneCardList,
    FrameCard
};
