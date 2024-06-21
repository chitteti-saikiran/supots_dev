import React from "react"
import { alert } from "tns-core-modules/ui/dialogs";
import * as ReactNativeScript from "react-nativescript";
import { BaseNavigationContainer, useNavigation } from '@react-navigation/core';
import { stackNavigatorFactory, tabNavigatorFactory } from "react-nativescript-navigation";
import IconSet from '~/font-icons';
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { ListView as NSListView } from '@nativescript/core/ui/list-view';
import { ItemEventData, ObservableArray, EventData } from "@nativescript/core";
import { Color } from "tns-core-modules/color";
import Theme, { Theme2 } from "~/Theme";
import * as ISupotsu from '~/DB/interfaces';
//@ts-ignore
import { client } from "~/app";
import * as Application from "@nativescript/core/application";
import * as AppSettings from "@nativescript/core/application-settings";
import PostScreen from "~/Screens/PostScreen";
import Methods from "~/Methods";
import { GAMES_QRY, EVENTS, sports } from '../components/GQL';
import { ScreenProps, onTouch } from '../app';
import { Page } from "tns-core-modules/ui/page";
import Helper, { getItemSpec } from "~/helpers";
import { Props } from "~/components/AppContainer";
import { LoadingState, Empty, FullScreenLoader } from "~/ui/common.ui";
import { useState, useEffect } from 'react';
import { PropertyChangeData } from 'tns-core-modules/ui/editable-text-base';
import { GMCStream } from '~/gmc/gmx-react';
import { goToPageReact } from '~/components/AppContainer';
import moment from 'moment';
import { ListView as $ListView, NSVElement } from "react-nativescript";
import { screen, isIOS, isAndroid } from '@nativescript/core/platform/platform';
import { CommentLightBox } from '../components/CommentsThread';
import { UnionUser } from "~/utils/types";

const dummy = Methods.getDummy(32);
const dum = Methods.arrayChunks(dummy, 3);

type PhotoFilter = "Uploads" | "Tagged" | "Albums"

const PhotoFilters: PhotoFilter[] = ['Uploads', 'Tagged', 'Albums']

export const Photos = ({user,  canBeLoaded = false, color = Theme[500]}: {user: UnionUser, canBeLoaded: boolean, color?: string}) => {
  const [active, setActive] = useState<PhotoFilter>('Uploads')
  const [state, updateState] = useState<Record<string, any>>({})

  const setState = (newState: Partial<Record<string, any>>) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const getYourPhotos = React.useCallback(() => {
    const dataTo = {
      user: {
        _id: user._id,
        type: user.type
      },
      userTo: {
        id: user._id,
        type: user.type
      }
    }

    Methods.post(`https://supotsu.com/api/photos/tagged/${user._id}`, dataTo, {
      headers: {
        "Content-Type": 'application/json'
      },
      success: res => {
        AppSettings.setString('your-photos', JSON.stringify(res));
        setState({
          yourPhotos: res,
          isLoadingYourPhotos: false
        });
      },
      error: res => {
        setTimeout(() => {
          //_that.getPhotosOf()
        }, 3000);
      }
    });
  }, [])

  const getPhotosOf = React.useCallback(() => {
    const dataTo = {
      user: {
        _id: user._id,
        type: user.type
      },
      userTo: {
        id: user._id,
        type: user.type
      }
    };

    Methods.post(`https://supotsu.com/api/photos/mine/${user._id}`, dataTo, {
      headers: {
        "Content-Type": 'application/json'
      },
      success: res => {
        AppSettings.setString('tagged-photos', JSON.stringify(res));
        setState({
          photosOfYou: res,
          isLoadingPhotosOfYou: false
        });
      },
      error: res => {
        setTimeout(() => {
          //_that.getPhotosOf()
        }, 3000);
      }
    });
  }, [])

  const getAlbums = React.useCallback((photos = []): Record<string, any> => {
    const _albumNames = photos.map((photo, i) => {
      return photo.album;
    });

    var uniqueNames = [];
    _albumNames.forEach((n, i) => {
      if (!Methods.inArray(n, uniqueNames)) {
        uniqueNames.push(n);
      }
    });

    const _albumObjects: Record<string, any> = {};

    uniqueNames.forEach((n, i) => {
      if (n && n.name) {
        _albumObjects[n.name] = {
          data: n,
          photos: []
        }
      }
    });

    photos.forEach((photo, i) => {
      if (photo.album && photo.album.name) {
        _albumObjects[photo.album.name].photos.push(photo);
      }
    });

    return _albumObjects;
  }, []);

  useEffect(() => {
    const _yourPhotos = AppSettings.getString('your-photos', '[]');
    const yourPhotos: ISupotsu.Post[] = JSON.parse(_yourPhotos);

    setState({
      yourPhotos: yourPhotos,
      isLoadingYourPhotos: yourPhotos.length > 0 ? true : false
    });

    const _taggedPhotos = AppSettings.getString('tagged-photos', '[]');
    const tagged: ISupotsu.Post[] = JSON.parse(_taggedPhotos);

    setState({
      photosOfYou: tagged,
      isLoadingPhotosOfYou: tagged.length > 0 ? true : false
    });

    return () => {

    }

  }, [active])

  useEffect(() => {
    getYourPhotos();
    getPhotosOf();

    return () => {
      console.log("Exit photos")
    }
  }, [])

  const { yourPhotos, photosOfYou, isLoadingPhotosOfYou, isLoadingYourPhotos } = state

  if(!canBeLoaded) {
    return <FullScreenLoader />
  }

  return (
    <scrollView background={'#eee'}>
      <stackLayout padding={'16 0'}>
        <gridLayout marginBottom={16} columns="*,*,*">
          {PhotoFilters.map((item, i)=>{
            return (
              <PhotoSementItem color={color} key={item} onSelect={()=>{
                setActive(item)
              }} active={Boolean(active === item)} col={i} item={item} />
            )
          })}
        </gridLayout>
        {active === "Albums" && (
          <PhotoListView key={active} type={active} loading={false} albums={getAlbums(yourPhotos)} />
        )}
        {active === "Tagged" && (
          <PhotoListView key={active} type={active} loading={isLoadingPhotosOfYou} items={photosOfYou} />
        )}
        {active === "Uploads" && (
          <PhotoListView key={active} type={active} loading={isLoadingYourPhotos} items={photosOfYou} />
        )}
      </stackLayout>
    </scrollView>
  )
}

interface PhotoListViewProps {
  items?: ISupotsu.Post[],
  albums?: Record<string, any>,
  type: PhotoFilter,
  loading: boolean
}

const PhotoListView = ({
  items,
  albums,
  type,
  loading
}: PhotoListViewProps) => {
  if(loading){
    return(
      <flexboxLayout style={{
        height: 140,
        margin: '16 0',
        borderColor: new Color('#ddd'),
        borderWidth: 1,
        borderRadius: 8,
        background: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <LoadingState style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
        }} />
      </flexboxLayout>
    )
  }
  return(
    <>
    {items && items.length === 0 &&
      <PhotoEmptyState />
    }
    {albums && albums.length === 0 &&
      <PhotoEmptyState />
    }
    {type !== "Albums" && (
      <PhotoListView.Photos photos={items} />
    )}
    </>
  )
}

interface PhotoListViewItemProps {
  photos: ISupotsu.Post[],
}

PhotoListView.Photos = ({
  photos
}: PhotoListViewItemProps) => {
  const navigate = useNavigation();
  const _photos: ISupotsu.Post[][] = Methods.arrayChunks(photos, 3);
  return(
    <>
      {_photos.map((item, i) => {
        const { widthPixels } = screen.mainScreen;
        const widthOf = widthPixels / 6 - 2;
        return (
          <gridLayout margin={0} height={widthOf} key={i} columns="*,*,*">
            {item.map((photoItem, index) => {
              return (
                <flexboxLayout onTap={() => {
                  navigate.navigate(CommentLightBox.routeName, {
                    post: photoItem,
                  });
                }} key={index} col={index} style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0.5,
                  borderColor: '#eee',
                  background: '#fff'
                }}>
                  <image loadMode={'async'} style={{
                    height: '100%',
                    width: '100%',
                  }} src={`https://supotsu.com/${photoItem.media[0].url}`} />
                </flexboxLayout>
              )
            })}
          </gridLayout>
        )
      })}
    </>
  )
}

const PhotoEmptyState = () => {
  return (
    <flexboxLayout style={{
      height: 140,
      margin: '16 16 16 16',
      borderColor: new Color('#ddd'),
      borderWidth: 1,
      borderRadius: 8,
      background: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Empty style={{
        width: '100%',
        borderWidth: 0
      }} />
    </flexboxLayout>
  )
}

interface PhotoSementItemProps{
  item: string,
  col: number,
  active: boolean
  onSelect?(): void
  count?: number
  color?: string
}

export const PhotoSementItem = ({
  item,
  col,
  active,
  onSelect,
  count = 0,
  color = Theme[500]
}:PhotoSementItemProps) => {
  return(
    <absoluteLayout col={col} style={{
      height: 40
    }}>
      <flexboxLayout top={0} left={0} onTouch={onTouch} onTap={onSelect} style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderBottomWidth: 4,
        background: '#fff',
        borderBottomColor: active ? color : '#fff',
        width: '100%'
      }}>
        <label text={item}/>
      </flexboxLayout>
      {count > 0 && (
        <flexboxLayout top={0} marginTop={3} left={0} marginLeft={"84%"} background="red" height={18} borderRadius={9} padding="0 4">
          <label color="#fff" fontSize={10}>{Methods.shortDigit(1000).text}</label>
        </flexboxLayout>
      )}
    </absoluteLayout>
  )
}
