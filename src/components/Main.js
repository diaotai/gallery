require('normalize.css/normalize.css');
require('styles/App.scss');
var imageDatas=require("../data/imageDatas.json")

import React from 'react';

// let yeomanImage = require('../images/1.jpg');

//将图片名信息转化为图片URL信息
function genURLImageData(datas){
  for(let i=0;i<datas.length;i++)
  {
    let singleImageData=datas[i];
    singleImageData.imageURL=require('../images/'+singleImageData.fileName)
    datas[i]=singleImageData
  }
  return datas;
}
imageDatas=genURLImageData(imageDatas)

//获取区间内的随机值
function getRangeRandom(low,high){
return  Math.ceil(Math.random()*(high-low)+low);
}

//用于获取0～30度之间的任意一个正负值
function get30DegRandom(){
  return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30)
}
class ImgFigure extends React.Component{
constructor(props){
  super(props)
  this.handleClick=this.handleClick.bind(this)
}
handleClick(e){
  if(this.props.arrange.isCenter){
  this.props.inverse();
  }else{
    this.props.center();
  }
  
  e.stopPropagation();
  e.preventDefault();
}
  render(){

    let styleObj = {};

    //如果props属性中制定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    } 

    //如过图片的旋转角度有值且不为0，则使用 否则添加旋转角度
    if(this.props.arrange.rotate){
      (['MozTransfrom','msTransfrom','WebkitTransfrom','transform']).forEach(function(value){
         styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
      },this);
     
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex=11;
    }

    //本处可能有错
    let imgFigureClassName='img-figure';
    imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
      <img src={this.props.data.imageURL} alt={this.props.data.title}/>
      <figcaption>
      <h2 className="img-title">{this.props.data.title}</h2>
      <div className="img-back" onClick={this.handleClick}>
      <p>{this.props.data.desc}</p>
      </div>
      </figcaption>
      </figure>
    )
  }
}

class ControllerUnit extends React.Component{
  constructor(props){
    super(props)
    this.handleClick=this.handleClick.bind(this)
  }
  handleClick(e){

      //如果点击选中态按钮，则反转，否则居中
      if(this.props.arrange.isCenter){
        this.props.inverse();
      }else{
        this.props.center();
      }
      e.preventDefault();
      e.stopPropagation();
  }
  render(){
    let controllerUnitClassName="controller-unit";

    //如果对应剧中图片，显示居中态
    if(this.props.arrange.isCenter){
      controllerUnitClassName+=" is-center";

      //如果同时还是翻转态
      if(this.props.arrange.isInverse)
      controllerUnitClassName+=" is-inverse";
    }
    return(
      <span className={controllerUnitClassName} onClick={this.handleClick} ></span>
    );
  }
}
// var ControllerUnit = React.createClass({
// 	handleClick: function(e){

// 		//如果点击的是当前选中态的按钮，则翻转图片，否则将对应的图片居中
// 		if(this.props.arrange.isCenter){
// 			this.props.inverse();
// 		} else{
// 			this.props.center();
// 		}
// 		e.preventDefault();
// 		e.stopPropagation();
// 	},
// 	render: function(){
// 		var controllerUnitClassName = 'controller-unit';

// 		//如果对应的是居中的图片，显示控制按钮的居中态
// 		if(this.props.arrange.isCenter){
// 			controllerUnitClassName += ' is-center';

// 			//如果同时对应的是反转图片，显示控制按钮的翻转态
// 			if(this.props.arrange.isInverse){
// 				controllerUnitClassName += ' is-inverse';
// 			}
// 		}
// 		return(
// 			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
// 		);
// 	}
// })

class AppComponent extends React.Component {
  constructor(props){
    super(props)
     this.state={
       imgsArrangeArr:[
         {
           pos:{
             left:'0',
             right:'0'
           },
           rotate:0,//旋转角度
           isInverse:false,  //图片正反，默认为正面,
           isCenter:false
         }
       ]
    }
     this.Constant={
     centerPos:{
       left:0,
       right:0
     },
     hPosRange:{
       leftSecX:[0,0],
       rightSecX:[0,0],
       y:[0,0]
     },
     vPosRange:{
       x:[0,0],
       topY:[0,0]
     }
  }

   this.rearrane=this.rearrane.bind(this);
   this.center=this.center.bind(this);
   this.inverse=this.inverse.bind(this);
  }

center(index){
  return function(){
    this.rearrane(index);
  }.bind(this);
}
inverse(index){
  //console.log(this);
  return function(){
  //  console.log(this.state);
  let imgsArrangeArr=this.state.imgsArrangeArr;

  imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;

  this.setState({
    imgsArrangeArr:imgsArrangeArr
  })
  }.bind(this);
}

/*
*重新布局所有图片
*param centerIndex指定哪一个图片居中
*/
  rearrane(centerIndex){
let imgsArrangeArr=this.state.imgsArrangeArr;

let Constant=this.Constant,
centerPos=Constant.centerPos,
hPosRange=Constant.hPosRange,
vPosRange=Constant.vPosRange,
hPosRangeLeftSecX=hPosRange.leftSecX,
hPosRangeRightSecX=hPosRange.rightSecX,
hPosRangeY=hPosRange.y,
vPosRangeTopY=vPosRange.topY,
vPosRangeX=vPosRange.x,

imgsArrangeTopArr=[],
topImgNum=Math.floor(Math.random()*2)
//取一个或者不取
let topImgSpliceIndex=0,

imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);

//首先居中centerIndex的图片
imgsArrangeCenterArr[0]={
  pos:centerPos,
  rotate:0,
  isCenter:true
}

//去除布局上侧图片的状态信息
topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr,length-topImgNum));
imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
  
  //布局位于上侧的图片
imgsArrangeTopArr.forEach(function(value,index){
  imgsArrangeTopArr[index]={
    pos:{
      top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
    left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
  },
  rotate:get30DegRandom(),
  isCenter:false
    }
    
});

for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
              rotate:get30DegRandom(),
              isCenter:false
            };

        }
//布局左右两侧的图片
// for(let i=0;i<imgsArrangeArr.length;i++){
// let hPosRangeLORX=null;
// if(i<imgsArrangeArr/2){
//   hPosRangeLORX= hPosRangeLeftSecX;
// }else{
//   hPosRangeLORX=hPosRangeRightSecX;
// }

// imgsArrangeArr[i].pos={
//   top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
//   left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
// }
// }

if(imgsArrangeTopArr&&imgsArrangeTopArr[0]) {
  imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);

}

imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
//console.log(imgsArrangeCenterArr[0].pos.left,imgsArrangeCenterArr[0].pos.top)
this.setState({
  imgsArrangeArr:imgsArrangeArr
});
}
  componentDidMount(){
    //获取舞台的大小
    var stageDOM = this.refs.stage,
  		stageW = stageDOM.scrollWidth,
  		stageH = stageDOM.scrollHeight,
   halfStageW=Math.ceil(stageW/2),
   halfStageH=Math.ceil(stageH/2);

   //拿到一个imageFigure的大小
   let imgFigureDOM=this.refs.imgFigure0,
   imgW=320,
   imgH=360,
   halfImgW=Math.ceil(imgW / 2),
   halfImgH=Math.ceil(imgH / 2);
   /*
   console.log(imgFigureDOM)
 console.log('stage'+stageW+' '+stageH)
 console.log('img'+imgW+' '+imgH)
 */
    this.Constant.centerPos = {
    	left: halfStageW - halfImgW,
    	top: halfStageH - halfImgH
    }
   // console.log('center'+this.Constant.centerPos.left)
    //计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[0] = stageH - halfImgH;


    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfImgW;
   // this.rearrange(0);
//   //计算中心图片的位置点
//   this.Constant.centerPos={
//     left:halfStageW - halfImgW,
//     top:halfStageH - halfImgH
//   }

// //左侧及右侧区域的位置数据
//   this.Constant.hPosRange.leftSecX[0]=-halfImgW;
//   this.Constant.hPosRange.leftSecX[1]=halfStageW - 3 * halfImgW;
//   this.Constant.hPosRange.rightSecX[0]=halfStageW + halfImgW;
//   this.Constant.hPosRange.rightSecX[1]=stageW - halfImgW;
//   this.Constant.hPosRange.y[0]=-halfImgH;
//   this.Constant.hPosRange.y[1]=stageH - halfImgH;

// //上侧区域位置数据
// this.Constant.vPosRange.topY[0]=-halfImgH;
// this.Constant.vPosRange.topY[1]=halfStageH - halfImgH * 3;
// this.Constant.vPosRange.x[0]=halfStageW - imgW;
// this.Constant.vPosRange.x[1]=halfStageW; 

this.rearrane(0);
}

render() {
    let controlers=[],imgFigures=[];
    imageDatas.forEach(function(value,index){
     
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index}
      arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

      controlers.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
      center={this.center(index)}/>)
    
    },this);

   
 
    return (
         <section className="stage" ref="stage">
      <section className="img-sec">
      {imgFigures}
      </section>
      <nav className="controller-nav">
      {controlers}
    
      </nav>

      </section>
    );
  }
}


AppComponent.defaultProps = {
};

export default AppComponent;
