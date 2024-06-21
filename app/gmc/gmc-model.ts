import { Observable } from '@nativescript/core/data/observable';
import { onTouch } from '~/app';

export class GMCViewModel extends Observable {
    name:String = "Supotsu"
    constructor() {
        super();
        this.set('onTouch', onTouch)
    }

    setState(state = {}, cb = () => {}){
        this.set("state", {...this.get("state"), ...state});
        if(cb) cb();
    }

    cb = (state = {}, _cb = () => {}) => {
        this.setState({
            ...state
        }, () => _cb())
    }
}