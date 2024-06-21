import { EventData, fromObject } from '@nativescript/core/data/observable';
import { Page, NavigatedData, View } from '@nativescript/core/ui/page';
import { GMCViewModel } from './gmc-model';
import { Color } from '@nativescript/core/color';
import { Label } from '@nativescript/core/ui/label';
import { ObservableArray } from '@nativescript/core/data/observable-array/observable-array';
import { ListView, ItemEventData } from "@nativescript/core/ui/list-view";
import * as AppSettings from '@nativescript/core/application-settings';
import { Image } from '@nativescript/core/ui/image/image';
import * as app from "@nativescript/core/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import IconSet from '~/font-icons';
import {setCurrentOrientation , orientationCleanup} from 'nativescript-screen-orientation';
import { client } from '~/app';
import { GAMES_QRY } from '~/components/GQL';
import Helper from '~/helpers';
import { ShowModalOptions } from '@nativescript/core/ui/page/page';
import { Frame, NavigationEntry } from '@nativescript/core/ui/frame/frame';
import { TouchGestureEventData } from "@nativescript/core/ui/gestures/gestures";
import { goToPageReact } from '~/components/AppContainer';
import { GMCNext } from './gmx-react';
import { ComboModalProps, ComboModalHeaderSize, ComboModal, LocationModal } from '~/ui/common.ui';
import { LocationModalProps } from '../ui/common.ui';

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

const vm = new GMCViewModel();
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

function setState(state = {}, cb = () => {}){
    vm.set("state", {...vm.get("state"), ...state});
    if(cb) cb();
}

export function pageLoaded(args: EventData) {
    let page = args.object as Page;
    page.androidStatusBarBackground = new Color("#000");
    //page.backgroundColor = new Color("#000");
    setCurrentOrientation('landscape', ()=>{

    });
    const newGame = {
        uniq_id: Helper.uniqid(),
        sport: {
            _id: null
        },
        role: null
    };

    vm.set("you", user);
    vm.set('newGame', newGame);
    vm.set("state",{
        isLoading: games.length>0?false:true,
        isLoadingDraft: false,
        games,
        filteredGames,
        draft_games,
        isSportOpen: false,
        isRoleOpen: false,
        view_filters: [
            ['Upcoming', 0],
            ['Live', 1],
            ['Past', 2],
            ['Draft', 3]
        ],
        sports
    });

    vm.set('backIcon', `font://${IconSet.Ionicons["md-arrow-round-back"]}`)

    vm.set('addIcon', `font://${IconSet.Ionicons["md-add"]}`)

    vm.set('iconSet', IconSet);

    client.query({
        query: GAMES_QRY,
        variables: {
            user: user._id
        }
    }).then(({data})=>{
        const games = data.games.sort((a: { matchDate: any; }, b: { matchDate: any; })=>{
            let a_:any = new Date(a.matchDate || '');
            a_ = a_ === 'Invalid date'?0:a_.getTime();

            let b_:any = new Date(b.matchDate || '');
            b_ = b_ === 'Invalid date'?0:b_.getTime();
            return a_ < b_;
        }) || [];

        //console.log(games.map((item: { state: any; }) => item.state));
        const filteredGames = games.filter((item: { state: string; }, i: any)=>{
            return item.state === 'none';
        })
        //console.log('DONE')
        cb({
            isLoading: false,
            games,
            filteredGames
        }, () => {
            AppSettings.setString('game-list', JSON.stringify(games))
        })
    }).catch((err)=>{
        cb({
            isLoading: false
        })
        console.log(err)
    })
    page.bindingContext = vm;
}

export function openSportPicker(args:EventData){
    const mainView = args.object as View;
    const newGame = vm.get('newGame');
    const isSportOpen:boolean = vm.get('isSportOpen')
    if(isSportOpen) return;
    vm.set('isSportOpen', true)
    const option:ShowModalOptions = {
        context: { items: sports.filter((item, i)=>{
            return ['Football','Netball','Rugby','Field Hockey'].includes(item.name)
        }), title: "Select Sport", size: 'mini' },
        closeCallback: (sport?: { _id: any; image: string }) => {
            if( sport && sport._id){
                newGame.sport = {
                    ...sport,
                    image: `https://supotsu.com/${sport.image.replace("_wht.svg", "_wht.png")}`
                };
                vm.set('newGame', newGame)
            }

            vm.set('isSportOpen', false)
        },
        fullscreen: !false
    };
    //mainView.showModal('~/modals/combo-no-image', option);

    const test: LocationModalProps = {
        size: ComboModalHeaderSize.mini,
        onDone: (place) => {
            if(place){
                alert(place.name);
            }
        }
    }

    //goToPageReact(LocationModal, test, 'LocationModal')
    //return;
    const opts:ComboModalProps = {
        items: sports.filter((item, i)=>{
            return ['Football','Netball','Rugby','Field Hockey'].includes(item.name)
        }),
        title: "Select Sport",
        complex: true,
        size: ComboModalHeaderSize.mini,
        onDone:(sport?: { _id: any; image: string }) => {
            if( sport && sport._id){
                newGame.sport = {
                    ...sport,
                    image: `https://supotsu.com/${sport.image.replace("_wht.svg", "_wht.png")}`
                };
                console.log(newGame.sport.image)
                vm.set('newGame', newGame)
            }

            vm.set('isSportOpen', false)
        }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
}

export function openRolePicker(args:EventData){
    const mainView = args.object as View;
    const newGame = vm.get('newGame');
    const isRoleOpen:boolean = vm.get('isRoleOpen')
    if(isRoleOpen) return;
    vm.set('isRoleOpen', true)
    const option:ShowModalOptions = {
        context: { items: ["GMC Admin","Team Member"], title: "Select Role", size: 'mini' },
        closeCallback: (role?: string) => {
            if(role){
                newGame.role = role;
                vm.set('newGame', newGame);
            }

            vm.set('isRoleOpen', false)
        },
        fullscreen: true
    };
    //mainView.showModal('~/modals/combo-simple', option);

    const opts:ComboModalProps = {
        items: ["GMC Admin","Team Member"],
        title: "Select Role",
        size: ComboModalHeaderSize.mini,
        onDone:(role?: string) => {
            if(role){
                newGame.role = role;
                vm.set('newGame', newGame);
            }

            vm.set('isRoleOpen', false)
        }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
}

export function toggleDrawer(){
    //let sideDrawer = <RadSideDrawer>app.getRootView();
    //sideDrawer.toggleDrawerState();
    //Frame.topmost().goBack();
    Frame.topmost().navigate({
        moduleName: '~/home/home-page',
        clearHistory: true,
        animated: true
    })
}

export function goToGMCNext(args:EventData){
    const view = args.object as View;
    const page = view.page as Page;
    const frame = page.frame as Frame;
    const newGame = vm.get('newGame');

    goToPageReact(
        GMCNext,
        {
            game: newGame,
        },
        'GMCNext'
    );

    AppSettings.setString('newGame',JSON.stringify(newGame));

    /*

    const opts:NavigationEntry = {
        moduleName: '~/gmc/subs/gmc-next',
        context: {
            game: newGame
        },
        animated: false
    }

    frame.navigate(opts);
    */
}
