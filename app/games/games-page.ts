import { EventData, Observable } from '@nativescript/core/data/observable';
import { Page, NavigatedData, View } from '@nativescript/core/ui/page';
import { GamesViewModel} from './games-view-model';
import { Color } from '@nativescript/core/color';
import { Label } from '@nativescript/core/ui/label';
import * as AppSettings from '@nativescript/core/application-settings';
import * as app from "@nativescript/core/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import IconSet from '~/font-icons';
import { client } from '~/app';
import { GAMES_QRY } from '~/components/GQL';
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { FlexboxLayout } from '@nativescript/core/ui/layouts/flexbox-layout/flexbox-layout';
import { ItemEventData } from '@nativescript/core/ui/list-view/list-view';
import Methods from '~/Methods';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout/grid-layout';
import Helper from '~/helpers';
import * as React from "react";
import {setCurrentOrientation , orientationCleanup} from 'nativescript-screen-orientation';

import { TouchGestureEventData } from "@nativescript/core/ui/gestures/gestures";
import { GMCStream } from '~/gmc/gmx-react';
import { goToPageReact } from '~/components/AppContainer';
import moment from 'moment';

export function onTouch(args: TouchGestureEventData) {
    const label = args.object as View;
    switch (args.action) {
        case 'up':
            label.deletePseudoClass("pressed");
            break;
        case 'down':
            label.addPseudoClass("pressed");
            break;
    }
}


const vm = new GamesViewModel();

const d = AppSettings.getString('you', '{}');
const user = JSON.parse(d);

const _sports = AppSettings.getString('sports', '[]');
const sports = JSON.parse(_sports);

const _games = AppSettings.getString('game-list', '[]');
const games = new ObservableArray<any>(JSON.parse(_games));

const filteredGames = games.filter((item: { state: string; }, i: any)=>{
    return item.state === 'none';
})

const _draft_games = AppSettings.getString('draft-games', '[]');
const draft_games = new ObservableArray<any>(JSON.parse(_draft_games));

const cb = (state = {}, _cb = () => {}) => {
    setState({
        ...state
    }, () => _cb())
}

export function pageLoaded(args: EventData) {
    let page = args.object as Page;
    page.androidStatusBarBackground = new Color("#334455");
    setCurrentOrientation('all', ()=>{
        console.log('rotate?')
    });
    vm.set("you", user);
    vm.set("isItemVisible", false)
    vm.set('gameItemState', {});
    vm.set('gameItemViews', {});
    vm.set("activeView", "Upcoming");
    vm.set("state",{
        isLoading: games.length>0?false:true,
        isLoadingDraft: false,
        games,
        filteredGames,
        draft_games,
        view_filters: [
            ['Upcoming', 0],
            ['Live', 1],
            ['Past', 2],
            ['Draft', 3]
        ],
        sports
    });

    vm.set('backIcon', `font://${IconSet.Ionicons["md-arrow-round-back"]}`)

    vm.set('iconSet', IconSet);

    client.query({
        query: GAMES_QRY,
        variables: {
            user: user._id
        }
    }).then(({data})=>{
        const games_ = data.games.sort((a: { matchDate: any; }, b: { matchDate: any; })=>{
            let a_:any = new Date(a.matchDate || '');
            a_ = a_ === 'Invalid date'?0:a_.getTime();

            let b_:any = new Date(b.matchDate || '');
            b_ = b_ === 'Invalid date'?0:b_.getTime();
            return a_ < b_;
        }) || [];

        console.log(data.games.map((item)=>item.state))

        const games = games_;

        console.log('DONE')
        cb({
            isLoading: false,
            games,
            filteredGames
        }, () => {
            AppSettings.setString('game-list', JSON.stringify(games));
            setFilter(vm.get("activeView"));
        })
    }).catch((err)=>{
        cb({
            isLoading: false
        })
        console.log(err)
    })
    page.bindingContext = vm;
}

function setState(state = {}, cb = () => {}){
    vm.set("state", {...vm.get("state"), ...state});
    if(cb) cb();
}

export const onGameItemToggle = (args: EventData) => {
    let target = args.object as View;
    const view = target.parent as GridLayout;
    console.log(view);
    if(view){
        const _view = view.getChildAt(3);
        console.log(_view.visibility, view.getChildrenCount())
        const visibility = _view.visibility;
        _view.visibility = visibility === "collapse"?'visible':'collapse';
        view.paddingBottom = visibility === "collapse"?0:20;
    }
}

export const onGameItemLoaded = (args: EventData) => {
    let view = args.object as GridLayout;
    vm.set('gameItemViews', {
        ...vm.get('gameItemViews'),
        [view.id]:view.getChildAt(3)
    })
}

export const gameItem1LabelLoaded = (args: EventData) => {
    let view = args.object as Label;
    const game = view.get('game');
    const goalsOne = Helper.listify(game.teamOneActs).filter((_item)=>_item.type === 'goal');
    const goalsTwo = Helper.listify(game.teamTwoActs).filter((_item)=>_item.type === 'goal');
    console.log(goalsOne.length, goalsTwo.length)
    if(game.state === "none"){
        view.text = 'vs'
    } else{
        view.text = `${Methods.shortDigit(goalsOne.length).data === ''?0:Methods.shortDigit(goalsOne.length).data} - ${Methods.shortDigit(goalsTwo.length).data === ''?0:Methods.shortDigit(goalsTwo.length).data}`
    }
}

export const gameItem2LabelLoaded = (args: EventData) => {
    let view = args.object as Label;
    const game = view.get('game');
    view.text = game.state !== "none"?Methods.hhmmss(game.currentTime):game.matchDate === null?'Date not set':moment(game.matchDate).format('DD MMM YYYY')
}

export const gameItemCurrentTimeLabelLoaded = (args: EventData) => {
    let view = args.object as Label;
    view.text = Methods.hhmmss(view.text as unknown as number);
    console.log(view.text)
}

export function toggleDrawer(){

}

export function onNavigatedTo(args: NavigatedData) {
}

export function onViewFilterTap(args: EventData) {
    let label = args.object as Label;
    console.log('[GAMES]: ',label.text)
    vm.set("activeView", label.text);
    const {text} = label;
    if(text!=="Draft"){
        const games_ = vm.get("state").games.filter((item: { state: string; }, i: any)=>{
            if(text.toLowerCase() === 'upcoming') return item.state === 'none';
            if(text.toLowerCase() === 'past') return item.state === 'ended';
            if(text.toLowerCase() === 'live'){
                return ['running','paused'].includes(item.state)
            }
        });

        cb({
            isLoading: false,
            filteredGames: games_
        }, () => {

        })
    }
}

export function setFilter(text:string){
    console.log('[GAMES]: ',text)
    if(text!=="Draft"){
        const games_ = vm.get("state").games.filter((item: { state: string; }, i: any)=>{
            if(text.toLowerCase() === 'upcoming') return item.state === 'none';
            if(text.toLowerCase() === 'past') return item.state === 'ended';
            if(text.toLowerCase() === 'live'){
                return ['running','paused'].includes(item.state)
            }
        });

        cb({
            isLoading: false,
            filteredGames: games_
        }, () => {

        })
    }
}


export function goGMC(args: EventData){
    const v = args.object as View;
    const game = v.get('game')
    console.log(typeof game);
    goToPageReact(GMCStream, {game}, 'GMCStream')
}
