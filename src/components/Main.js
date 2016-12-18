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

// class ImgFigure extends React.Component{
//   render(){
//     return(
//       <figure>
//       <img src={this.props.data.imageURL} alt={this.props.data.title}/>
//       <figcaption>
//       <h2>{this.props.data.title}</h2>
//       </figcaption>
//       </figure>
//     )
//   }
// }
class AppComponent extends React.Component {
  render() {
    // let controlers=[],imgFigures=[];
    // imageDatas.forEach(value=>{
    //   imgFigures.push(<ImgFigure data={value}/>)
    // })
 
    return (
         <section className="stage">
      <section className="img-sec">
      
      </section>
      <nav className="controller-nav">
    
      </nav>

      </section>
    );
  }
}


AppComponent.defaultProps = {
};

export default AppComponent;
