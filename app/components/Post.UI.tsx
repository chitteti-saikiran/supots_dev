import * as React from 'react';
import { ItemEventData, ObservableArray, EventData } from "@nativescript/core";
import { Frame, Page, Color, isAndroid, View } from '@nativescript/core/ui/frame/frame';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout';
import { ScrollView } from '@nativescript/core/ui/scroll-view'
import { Tabs, TabStrip, TabStripItem, TabContentItem } from '@nativescript/core/ui/tabs';
import * as ReactNativeScript from "react-nativescript";
import { ItemSpec, GridLayout } from '@nativescript/core/ui/layouts/grid-layout/grid-layout';
import {Observable} from '@nativescript/core/data/observable';
import Icon from './Icon';
import IconSet from '~/font-icons';
import { SideDrawerLocation, RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as AppSettings from '@nativescript/core/application-settings';
import Methods, {ms} from '~/Methods';
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { NavigationEntry, ViewEntry } from '@nativescript/core/ui/frame/frame';
//import { PageComponentProps } from "react-nativescript/dist/components/Page";
import { createUploadLink } from 'apollo-upload-client';
import { TEAMS, PostQuery, PostQueryMin, AsyncPost } from './GQL';
import { screen } from '@nativescript/core/platform/platform';
import Theme, { Theme2 } from '~/Theme';
import PostScreen from '../Screens/PostScreen';
import { RichTextView, ShareContext, PostItemButton, LoadingState, GenericFile, EmbedMaterial, Empty, CommonHeader, CameraRoll, WhoShouldSeeTapPopUp, RichInputField, ModalProps, ModalHeaderSize, Modal } from '~/ui/common.ui';
import { getItemSpec } from '~/helpers';
//import Video from '~/Video';
//import { NarrowedEventData } from 'react-nativescript/dist/shared/NativeScriptComponentTypings';
import { EditableTextBase } from '@nativescript/core';
import { ModalActionButon, CameraRollCallback } from '../ui/common.ui';
import {Request, CompleteEventData, ErrorEventData, ProgressEventData, ResultEventData, Session, Task, session} from 'nativescript-background-http'
import * as ISupotsu from '~/DB/interfaces'
import * as DBSupotsu from '~/DB'
import { Group, Institution } from '../DB/interfaces/index';
import { Image } from '@nativescript/core/ui/image/image';


export interface PostContentProps{
    onTap?(arg?:any):void
}

export class LinkView extends React.Component<any, any>{
    constructor(p: any){
        super(p);

        this.state = {

        }
    }

    render = () =>  {

        const {link} = this.props;

        if(typeof link === "string") return null;

        const title = link['title']!==""?link['title']:link['url'];

        const url = link['url']!==""?link['url']:link['url'];

        const image = link['images'][0]?link['images'][0]:false;

        const description = false//link['description']!==""?Methods.nullify(link['description']).trim():false;

        const _url = Methods.getUrl(url.indexOf('google.com')>-1?`https://www.google.com/`:url);

        const imageUrl = Methods.isWebsite(image)?image:`${Methods.nullify(_url).toLowerCase()}${image}`;
        if(!title) return null;
        const width = screen.mainScreen.widthDIPs;
        return(
            <gridLayout style={{
                //height: 100,
                marginBottom: 10,
                //width,
                background: 'rgb(241,241,241)'
            }}>
                {image &&
                    <image style={{
                        width,
                        height: width / 2
                    }} src={Methods.isWebsite(image)?image:imageUrl} loadMode={'async'}/>
                }
                <stackLayout style={{
                    padding: 10
                }}>
                    {url &&
                        <label style={{
                            color: new Color('#555'),
                            padding: `0 5`,
                            paddingBottom: 3,
                            fontSize: 11
                        }} text={Methods.getUrl(url, true).trim().toUpperCase()}/>
                    }
                    {title &&
                        <label style={{
                            color:new Color('black'),
                            padding: `0 5`,
                            paddingBottom: 3,
                            fontWeight: 'bold',
                            fontSize: 16
                        }} text={title.trim()} />
                    }
                    {description &&
                        <label textWrap style={{
                            color: new Color('#555'),
                            padding:`0 5`
                        }} text={description}/>
                    }
                </stackLayout>
            </gridLayout>
        )
    }
}

export class ContentEditor extends React.Component<any, any>{
    constructor(props: any){
        super(props);
        const {content, comment, rawContent} = this.props;
        this.state = {
            isEditting: false,
            isPostingComment: false,
            content,
            comment,
            rawContent,
            keyword: ''
        }
    }

    onSuggestionTap = (user: { name: string; }, hidePanel: () => void) => {
        const {comment, rawContent} = this.state;
        hidePanel();

        let _comment = comment.slice(0, - this.state.keyword.length);
        _comment = _comment + user.name;

        let rawText = Methods.nullify(_comment);
        Methods.getTaggableUsers().forEach((item) => {
			//[@michel:5455345]
            const _content = "%" + item._id + "^" + item.type + "%";
            rawText = rawText.replace(item.name, _content);
            rawText = rawText.replace("@", "");
        })
        //rawComment = _comment + `%${user._id}^${user.type}%`;

        this.setState({
            value: _comment + '@' + user.name,
            rawContent: rawText,
            content: _comment,
            comment: _comment,
        })
    }

    callback = (keyword = '') => {
        const _filter = keyword.replace("@","");
        this.setState({
            keyword: keyword,
            friends: Methods.getTaggableUsers().filter((item)=>{
                return item.name.toLowerCase().indexOf(_filter.toLowerCase())>  -1;
            })
        })
	}

    Container = React.createContext({
        actions: {},
        state: {}
    });

    renderEditor = () => {


        return null //TODO
    }

    update = () => {
        if(this.state.isPostingComment) return;
        this.setState({ isPostingComment: true });
        const Host = Methods.shared(this.props.contentID);
        if(Host){
            Host.edit(this.state.content, this.state.rawContent);
        } else{
            this.setState({ isPostingComment: false });
        }
    }

    render = () => {
        const edit = () => {
            this.setState({
                isEditting: true
            })
        }
        const close = () => {
            this.setState({
                isEditting: false,
                isPostingComment: false
            })
        }

        const post = () => {
            //this.setState({
                //isPostingComment: true
            //})
        }
        const values = {
            state: this.state,
            actions: {
                edit,
                close,
                post
            },
            Holder: this
        }

        return(
            <React.Fragment>
                <this.Container.Provider value={values}>
                    {typeof this.props.children === "function"
                        ? this.props.children(values)
                        : this.props.children}
                </this.Container.Provider>
                {this.state.isEditting && this.renderEditor()}
            </React.Fragment>
        )
    }
}
