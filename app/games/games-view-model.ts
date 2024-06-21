import { Observable, EventData } from '@nativescript/core/data/observable';
import { Label } from '@nativescript/core/ui/label/label';
import Methods from '~/Methods';
import { ItemEventData } from '@nativescript/core/ui/list-view/list-view';
import Helper from '~/helpers';
import { onTouch } from './games-page';

export class GamesViewModel extends Observable {
    name:String = "Supotsu"
    constructor() {
        super();
        this.set('Helper', Helper);
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

    getGameItemLabel = (game: { teamOneActs: any; teamTwoActs: any; currentTime: number; }) => {
        const goalsOne = Methods.listify(game.teamOneActs).filter((_item)=>_item.type === 'goal');
        const goalsTwo = Methods.listify(game.teamTwoActs).filter((_item)=>_item.type === 'goal');
        const lbl = game.currentTime>0?`${Methods.shortDigit(goalsOne.length).data === ''?0:Methods.shortDigit(goalsOne.length).data} - ${Methods.shortDigit(goalsTwo.length).data === ''?0:Methods.shortDigit(goalsTwo.length).data}`:'vs';
        console.log(lbl);
        return lbl;
    }

    onViewFilterTap = (args: EventData) => {
        let label = args.object as Label;
        this.set("activeView", label.text);
        if(label.text!=="Draft"){
            const games_ = this.get("state").games.filter((item: { state: string; }, i: any)=>{
                if(label.text.toLowerCase() === 'upcoming') return item.state === 'none';
                if(label.text.toLowerCase() === 'past') return item.state === 'ended';
                if(label.text.toLowerCase() === 'live'){
                    return ['running','paused'].includes(item.state)
                };
            });
        
            this.cb({
                isLoading: false,
                filteredGames: games_
            }, () => {
                
            })
        }
    }
}