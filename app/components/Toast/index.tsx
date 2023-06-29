import ToastItem from "./ToastItem";
import ReactDOM from "react-dom";

const createDom = (content,duration,type)=>{
  const dom = document.createElement('div');
  const JSXdom = (<ToastItem content={content} duration={duration} type={type}/>);
    ReactDOM.render(JSXdom,dom)
  document.body.appendChild(dom);
}


const Toast = {
    dom: null,
    success(content: string, duration?: number) {
      createDom(content,duration,'success')   
    },
    error(content: string, duration?: number) {
      createDom(content,duration,'error')
    },
    warning(content: string, duration?: number) {
      createDom(content,duration,'warning')
    },
    info(content: string, duration?: number) {
      createDom(content,duration,'info')
    }
};

export default Toast;