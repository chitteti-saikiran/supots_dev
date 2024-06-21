import * as React from 'react';
import { Component, useState } from 'react';
import { onTouch } from '~/app';
import * as AppSettings from '@nativescript/core/application-settings';
import { Color } from '@nativescript/core/color/color';
import Theme, { Theme2 } from '~/Theme';
import { ListView as $ListView, NSVElement } from "react-nativescript";
import NativeModal from './Modal';
//import { NarrowedEventData } from 'react-nativescript/dist/shared/NativeScriptComponentTypings';
//import { EditableTextBase, Frame, Page, DatePicker, TimePicker } from 'react-nativescript/dist/client/ElementRegistry';
import { EventData, View as BaseView, ShowModalOptions, ShownModallyData } from '@nativescript/core/ui/page/page';
import IconSet from '~/font-icons';
import { goToPageReact } from '~/components/AppContainer';
import { getItemSpec } from '~/helpers';

import { ItemEventData } from "@nativescript/core/ui/list-view/list-view";
import Methods, { ms } from '~/Methods';
import { hasFilePermissions, requestFilePermissions } from 'nativescript-advanced-permissions/files';
import { openAppSettings } from 'nativescript-advanced-permissions/core';
import { screen, isIOS, isAndroid } from '@nativescript/core/platform/platform';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout';
import { getRoot } from '../app';
import { KeyboardType } from 'tns-core-modules/ui/editable-text-base/editable-text-base';
import { Folder, FileSystemEntity, File } from "tns-core-modules/file-system";
import _ from 'lodash';
import { Session, session } from 'nativescript-background-http'
import { Frame, Page } from 'tns-core-modules/ui/frame';
import { clearBorder } from '~/contexts/StyledContext';
import { googlePlacesAutocomplete } from '~/utils/googlePlacesAutocomplete';
const d = AppSettings.getString('you', '{}');
const user = JSON.parse(d);

const _users = AppSettings.getString('users', '[]');
const users = JSON.parse(_users);

const _teams = AppSettings.getString('teams', '[]');
const teams = JSON.parse(_teams);

const _sports = AppSettings.getString('sports', '[]');
const sports = JSON.parse(_sports);

const _games = AppSettings.getString('game-list', '[]');
const games = JSON.parse(_games);

const filteredGames = games.filter((item: { state: string; }, i: any) => {
  return item.state === 'none';
});

export const rootRef: React.RefObject<Frame> = React.createRef<Frame>();

export enum ComboModalHeaderSize {
  mini = "mini",
  normal = "normal"
}

interface BaseModalSelectorProps {
  title: string;
  size: ComboModalHeaderSize,
  render?(): React.ReactNode;
  renderTrigger?(ref: React.MutableRefObject<any>, onOpenModal: () => void): React.ReactNode;
  onDone?(data: any): void
}

export interface ComboModalProps extends BaseModalSelectorProps {
  items: any[]
  selected?: any,
  withImage?: boolean,
  complex?: boolean,
}

const getModalStyle = (size: ComboModalHeaderSize, title = "Select") => {
  const propsForHeader = size === "mini" ? {
    rootRows: getItemSpec(["auto", "40"]),
    rootMainRows: getItemSpec(["40", "*"]),
    rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
    backIconHolderStyle: {
      paddingTop: 5
    },
    backIconStyle: {},
    backIconClass: "Ionicons size10",
    title,
    titleStyle: {
      textAlignment: "left",
      fontWeight: "bold",
      fontSize: 18
    }
  } : {
    rootRows: getItemSpec(["auto", "58"]),
    rootMainRows: getItemSpec(["58", "*"]),
    rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
    backIconHolderStyle: {
      height: 40,
      width: 40,
      borderRadius: 20
    },
    backIconStyle: {},
    backIconClass: "Ionicons size14",
    title,
    titleStyle: {
      textAlignment: "left",
      fontWeight: "bold",
      fontSize: 24
    }
  };
  return propsForHeader;
}

export class ComboModal extends Component<ComboModalProps, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  private closeCallback: any;
  constructor(props: ComboModalProps) {
    super(props)
  }

  componentDidMount() {
    Frame.topmost().showModal(this.pageRef.current!.nativeView, {
      context: {},
      closeCallback: () => {
        this.closeCallback(true);
      },
      animated: true,
      fullscreen: true,
      stretched: false
    })
  }

  loaded = (args: EventData) => {
    const view = args.object as BaseView;
    //console.log(view.className);
  }

  render = () => {
    const { size, render } = this.props
    const propsForHeader = size === "mini" ? {
      rootRows: getItemSpec(["auto", "40"]),
      rootMainRows: getItemSpec(["40", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        paddingTop: 5
      },
      backIconStyle: {},
      backIconClass: "Ionicons size10",
      title: this.props.title || "Select",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 18
      }
    } : {
      rootRows: getItemSpec(["auto", "58"]),
      rootMainRows: getItemSpec(["58", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
      },
      backIconStyle: {},
      backIconClass: "Ionicons size14",
      title: this.props.title || "Select",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 24
      }
    }
    return (
      <page onShownModally={(args: ShownModallyData) => {
        const _cb = args.closeCallback;
        this.closeCallback = (_data: any) => {
          _cb();
          if (this.props.onDone) this.props.onDone(_data)
        }
      }} actionBarHidden ref={this.pageRef}>
        <gridLayout rows={propsForHeader.rootMainRows} columns={'*'}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
              <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                this.closeCallback(null)
              }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                {size === 'mini' &&
                  <image onLoaded={this.loaded} className="Ionicons size10" style={{
                    fontSize: 10
                  }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                }
                {size !== 'mini' &&
                  <image onLoaded={this.loaded} className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                }
              </flexboxLayout>
              <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 18
              } : {
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 24
              }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
            </gridLayout>
          </stackLayout>
          {this.props.items.length > 0 &&
            <$ListView
              items={this.props.items}
              row={1}
              separatorColor={new Color("#fff")}
              visibility={this.props.items.length >= 1 ? 'visible' : 'hidden'}
              cellFactory={(item: any) => {
                return (
                  <stackLayout orientation="horizontal" padding={this.props.withImage ? "10 20" : "8 20"} height={40}>
                    {this.props.withImage &&
                      <flexboxLayout style={{
                        marginBottom: 0,
                        marginRight: 10,
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <image src={item.image} style={{
                          height: 35,
                          width: 35,
                          borderRadius: 17.5
                        }} stretch="fill" />
                      </flexboxLayout>
                    }
                    <label verticalAlignment="middle" text={this.props.complex ? item.name : item} />
                  </stackLayout>
                );
              }}
              onItemTap={(args: ItemEventData) => {
                const index: number = args.index;
                const item: any = this.props.items[index];
                if (this.props.withImage) {
                  item.image = String(item.image).replace('.svg', '.png')
                }
                this.closeCallback(item);
              }}
            />
          }
          {this.props.items.length === 0 &&
            <stackLayout row={1} style={{ marginTop: 20, background: "#fff" }} visibility={this.props.items.length <= 0 ? 'visible' : 'hidden'}>
              <flexboxLayout onTouch={onTouch} flexDirection='column' alignItems='center' justifyContent='center' style={{
                padding: 20,
                background: "#fff"
              }}>
                <label fontSize={24} color={new Color("#888")} text="Ops, Sorry!" />
                <label textWrap fontSize={16} textAlignment="center" color={new Color("#999")} text="No selection data found!" />
              </flexboxLayout>
            </stackLayout>
          }
        </gridLayout>
      </page>
    )
  }
}

const BasicSelectorStyle = {
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
}

export const ComboSelector = ({
  title,
  items,
  size,
  complex,
  onDone,
  renderTrigger,
  selected,
  render,
  withImage
}: ComboModalProps) => {

  const propsForHeader = size === "mini" ? {
    rootRows: getItemSpec(["auto", "40"]),
    rootMainRows: getItemSpec(["40", "*"]),
    rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
    backIconHolderStyle: {
      paddingTop: 5
    },
    backIconStyle: {},
    backIconClass: "Ionicons size10",
    title: title || "Select",
    titleStyle: {
      textAlignment: "left",
      fontWeight: "bold",
      fontSize: 18
    }
  } : {
    rootRows: getItemSpec(["auto", "58"]),
    rootMainRows: getItemSpec(["58", "*"]),
    rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
    backIconHolderStyle: {
      height: 40,
      width: 40,
      borderRadius: 20
    },
    backIconStyle: {},
    backIconClass: "Ionicons size14",
    title: title || "Select",
    titleStyle: {
      textAlignment: "left",
      fontWeight: "bold",
      fontSize: 24
    }
  }
  return (
    <NativeModal
      renderTriggerAction={(ref, open) => renderTrigger(ref, open)}
      fullscreen
      renderContent={(open, close, isOpen) => {
        return (
          <gridLayout {...BasicSelectorStyle} rows={propsForHeader.rootMainRows} columns={'*'}>
            <stackLayout col={0} row={0}>
              <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
                <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                  close();
                }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                  {size === 'mini' &&
                    <image className="Ionicons size10" style={{
                      fontSize: 10
                    }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                  {size !== 'mini' &&
                    <image className="Ionicons size12" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                </flexboxLayout>
                <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 18
                } : {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 24
                }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
              </gridLayout>
            </stackLayout>
            <scrollView row={1} visibility={items?.length >= 1 ? 'visible' : 'hidden'}>
              <stackLayout>
                {items?.map((item: any, index) => {
                  return (
                    <stackLayout orientation="horizontal" key={index} onTap={() => {
                      const item: any = items[index];
                      if (withImage) {
                        item.image = String(item.image).replace('.svg', '.png')
                      }
                      if (onDone) onDone(item);
                      close();
                    }} padding={withImage ? "10 20" : "8 20"}>
                      {withImage &&
                        <flexboxLayout style={{
                          marginBottom: 0,
                          marginRight: 10,
                          width: 40,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <image src={item.image} style={{
                            height: 35,
                            width: 35,
                            borderRadius: 17.5
                          }} stretch="fill" />
                        </flexboxLayout>
                      }
                      <label verticalAlignment="middle" text={complex ? item.name : item} />
                    </stackLayout>
                  )
                })}
              </stackLayout>
            </scrollView>
            <stackLayout visibility={items?.length === 0 ? 'visible' : 'hidden'} row={1} style={{ marginTop: 20, background: "#fff" }}>
              <flexboxLayout onTouch={onTouch} flexDirection='column' alignItems='center' justifyContent='center' style={{
                padding: 20,
                background: "#fff"
              }}>
                <label fontSize={24} color={new Color("#888")} text="Ops, Sorry!" />
                <label textWrap fontSize={16} textAlignment="center" color={new Color("#999")} text="No selection data found!" />
              </flexboxLayout>
            </stackLayout>
          </gridLayout>
        )
      }}
    />
  )
}

type DateModalOrientaion = "landscape" | "portrait";

export type DatePickerType = "date-time" | "date" | "time"

export interface DateModalProps extends BaseModalSelectorProps {
  onChange?(date: Date): void;
  orientation: DateModalOrientaion;
  type?: DatePickerType;
}

export class DateModal extends Component<DateModalProps, {
  date: Date
}>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  private closeCallback: any;
  date: Date = new Date();
  orientation: String;
  constructor(props: DateModalProps) {
    super(props)
    this.state = {
      date: new Date()
    }
    //this.orientation = orientation
  }

  componentDidMount() {

    Frame.topmost().showModal(this.pageRef.current!.nativeView, {
      context: {},
      closeCallback: () => {
        this.closeCallback(true);
      },
      animated: true,
      fullscreen: true,
      stretched: false
    })
  }

  render = () => {
    const { size, render, orientation, type = "date-time" } = this.props;
    const { date = new Date() } = this.state;
    const propsForHeader = size === "mini" ? {
      rootRows: getItemSpec(["auto", "40"]),
      rootMainRows: getItemSpec(["40", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        paddingTop: 5
      },
      backIconStyle: {},
      backIconClass: "Ionicons size10",
      title: this.props.title || "Select",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 18
      }
    } : {
      rootRows: getItemSpec(["auto", "58"]),
      rootMainRows: getItemSpec(["58", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
      },
      backIconStyle: {},
      backIconClass: "Ionicons size14",
      title: this.props.title || "Select",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 24
      }
    }

    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();

    const currentHour: number = new Date().getHours();
    const currentMinute: number = new Date().getMinutes();

    if (orientation === "landscape") {
      return (
        <page onShownModally={(args: ShownModallyData) => {
          const _cb = args.closeCallback;
          this.closeCallback = (_data: any) => {
            _cb();
            if (this.props.onDone) this.props.onDone(_data)
          }
        }} actionBarHidden ref={this.pageRef}>
          <gridLayout rows={propsForHeader.rootMainRows} columns={'*'}>
            <stackLayout col={0} row={0}>
              <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
                <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                  this.closeCallback(null)
                }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                  {size === 'mini' &&
                    <image className="Ionicons size10" style={{
                      fontSize: 10
                    }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                  {size !== 'mini' &&
                    <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                </flexboxLayout>
                <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 18
                } : {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 24
                }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
              </gridLayout>
            </stackLayout>
            <gridLayout row={1} columns={"*,auto,20,auto,20,auto*"} rows={"*,20,45,20"}>
              {type === 'date' || type === 'date-time' ? (
                <datePicker col={1} row={0} onDateChange={(args: any) => {
                  //const date = args.object.
                  const { date } = args.object;

                  date.setMinutes(currentMinute);
                  date.setHours(currentHour)
                  this.setState({ date })
                  if (this.props.onChange) {
                    this.props.onChange(date);
                  }
                }} year={currentYear} month={currentMonth} day={currentDay} minDate={new Date("1970-01-01")} maxDate={new Date("2100-12-31")} />
              ): <></>}

              {type === 'time' || type === 'date-time' ? (
                <timePicker onTimeChange={(args: any) => {
                  const { time } = args.object;
                  time.setDate(currentDay);
                  time.setFullYear(currentYear);
                  time.setMonth(currentMonth - 1);
                  this.setState({ date: time })
                  if (this.props.onChange) {
                    this.props.onChange(time);
                  }
                }} col={type === 'time' ? 1 : 3} row={0} hour={currentHour} minute={currentHour} />
              ) : <></>}

              <stackLayout row={2} colSpan={7} style={{
                height: 45,
                margin: '0 40',
                background: Theme2['500'],
                borderRadius: 10,
                textAlignment: 'center',
                verticalAlignment: 'middle',
                color: new Color('#fff')
              }} onTap={() => {
                const _date = new Date(date);
                _date.setMinutes(currentMinute);
                _date.setHours(currentHour)
                _date.setDate(currentDay);
                _date.setFullYear(currentYear);
                _date.setMonth(currentMonth - 1);
                this.closeCallback(_date);
              }}>
                <label textAlignment={'center'} text={'SET'} />
              </stackLayout>
            </gridLayout>
          </gridLayout>
        </page>
      )
    }

    return (
      <page onShownModally={(args: ShownModallyData) => {
        const _cb = args.closeCallback;
        this.closeCallback = (_data: any) => {
          _cb();
          if (this.props.onDone) this.props.onDone(_data)
        }
      }} actionBarHidden ref={this.pageRef}>
        <gridLayout rows={propsForHeader.rootMainRows} columns={'*'}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
              <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                this.closeCallback(null)
              }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                {size === 'mini' &&
                  <image className="Ionicons size10" style={{
                    fontSize: 10
                  }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                }
                {size !== 'mini' &&
                  <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                }
              </flexboxLayout>
              <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 18
              } : {
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 24
              }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
            </gridLayout>
          </stackLayout>
          <gridLayout row={1} rows={'*,auto,20,auto,20,auto,*'} columns={'*'}>
            {type === 'date' || type === 'date-time' ? (
              <datePicker col={0} row={1} onDateChange={(args: any) => {
                //const date = args.object.
                const { date } = args.object;

                date.setMinutes(currentMinute);
                date.setHours(currentHour)
                this.setState({ date })
                if (this.props.onChange) {
                  this.props.onChange(date);
                }
              }} year={currentYear} month={currentMonth} day={currentDay} minDate={new Date("1970-01-01")} maxDate={new Date("2100-12-31")} />
            ) : <></>}

            {type === 'time' || type === 'date-time' ? (
              <timePicker onTimeChange={(args: any) => {
                const { time } = args.object;
                time.setDate(currentDay);
                time.setFullYear(currentYear);
                time.setMonth(currentMonth - 1);
                this.setState({ date: time })
                if (this.props.onChange) {
                  this.props.onChange(time);
                }
              }} col={0} row={type === 'time' ? 1 : 3} hour={currentHour} minute={currentHour} />
            ) : <></>}

            <stackLayout row={5} style={{
              height: 45,
              margin: '0 40',
              background: Theme2['500'],
              borderRadius: 10,
              textAlignment: 'center',
              verticalAlignment: 'middle',
              color: new Color('#fff')
            }} onTap={() => {
              const _date = new Date(date);
              _date.setMinutes(currentMinute);
              _date.setHours(currentHour)
              _date.setDate(currentDay);
              _date.setFullYear(currentYear);
              _date.setMonth(currentMonth - 1);
              this.closeCallback(_date);
            }}>
              <label textAlignment={'center'} text={'SET'} />
            </stackLayout>
          </gridLayout>
        </gridLayout>
      </page>
    )
  }
}

export const DateSelector = ({
  orientation,
  size,
  title,
  onChange,
  onDone,
  render,
  renderTrigger,
  type = "date-time"
}: DateModalProps) => {
  const [date, setDate] = React.useState(new Date());
  const propsForHeader = getModalStyle(size, title);
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;
  const currentDay = date.getDate();

  const currentHour: number = new Date().getHours();
  const currentMinute: number = new Date().getMinutes();
  return (
    <NativeModal
      renderTriggerAction={(ref, open) => renderTrigger(ref, open)}
      fullscreen
      renderContent={(open, close, isModalOpen) => {
        if (orientation === "landscape") {
          return (
            <gridLayout {...BasicSelectorStyle} rows={propsForHeader.rootMainRows} columns={'*'}>
              <stackLayout col={0} row={0}>
                <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
                  <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                    onDone(date)
                    close();
                  }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                    {size === 'mini' &&
                      <image className="Ionicons size10" style={{
                        fontSize: 10
                      }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                    }
                    {size !== 'mini' &&
                      <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                    }
                  </flexboxLayout>
                  <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                    textAlignment: "left",
                    fontWeight: "bold",
                    fontSize: 18
                  } : {
                    textAlignment: "left",
                    fontWeight: "bold",
                    fontSize: 24
                  }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
                </gridLayout>
              </stackLayout>
              <gridLayout row={1} columns={"*,auto,20,auto,20,auto*"} rows={"*,20,45,20"}>
                <datePicker col={1} row={0} onDateChange={(args: any) => {
                  //const date = args.object.
                  const { date } = args.object;

                  date.setMinutes(currentMinute);
                  date.setHours(currentHour)
                  setDate(date);
                  if (onChange) {
                    onChange(date);
                  }
                }} year={currentYear} month={currentMonth} day={currentDay} minDate={new Date("1970-01-01")} maxDate={new Date("2100-12-31")} />

                <timePicker onTimeChange={(args: any) => {
                  const { time } = args.object;
                  time.setDate(currentDay);
                  time.setFullYear(currentYear);
                  time.setMonth(currentMonth - 1);
                  setDate(time)
                  if (onChange) {
                    onChange(time);
                  }
                }} col={3} row={0} hour={currentHour} minute={currentHour} />

                <stackLayout row={2} colSpan={7} style={{
                  height: 45,
                  margin: '0 40',
                  background: Theme2['500'],
                  borderRadius: 10,
                  textAlignment: 'center',
                  verticalAlignment: 'middle',
                  color: new Color('#fff')
                }} onTap={() => {
                  const _date = new Date();
                  _date.setMinutes(currentMinute);
                  _date.setHours(currentHour)
                  _date.setDate(currentDay);
                  _date.setFullYear(currentYear);
                  _date.setMonth(currentMonth - 1);
                  onDone(_date);
                  close();
                }}>
                  <label textAlignment={'center'} text={'SET'} />
                </stackLayout>
              </gridLayout>
            </gridLayout>
          )
        }

        return (
          <gridLayout {...BasicSelectorStyle} rows={propsForHeader.rootMainRows} columns={'*'}>
            <stackLayout col={0} row={0}>
              <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
                <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                  onDone(date)
                  close();
                }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                  {size === 'mini' &&
                    <image className="Ionicons size10" style={{
                      fontSize: 10
                    }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                  {size !== 'mini' &&
                    <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                </flexboxLayout>
                <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 18
                } : {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 24
                }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
              </gridLayout>
            </stackLayout>
            <gridLayout row={1} rows={'*,auto,20,auto,20,auto,*'} columns={'*'}>
              <datePicker col={0} row={1} onDateChange={(args: any) => {
                //const date = args.object.
                const { date } = args.object;

                date.setMinutes(currentMinute);
                date.setHours(currentHour)
                setDate(date);
                if (onChange) {
                  onChange(date);
                }
              }} year={currentYear} month={currentMonth} day={currentDay} minDate={new Date("1970-01-01")} maxDate={new Date("2100-12-31")} />

              <timePicker onTimeChange={(args: any) => {
                const { time } = args.object;
                time.setDate(currentDay);
                time.setFullYear(currentYear);
                time.setMonth(currentMonth - 1);
                setDate(time)
                if (onChange) {
                  onChange(time);
                }
              }} col={0} row={3} hour={currentHour} minute={currentHour} />

              <stackLayout row={5} style={{
                height: 45,
                margin: '0 40',
                background: Theme2['500'],
                borderRadius: 10,
                textAlignment: 'center',
                verticalAlignment: 'middle',
                color: new Color('#fff')
              }} onTap={() => {
                const _date = new Date();
                _date.setMinutes(currentMinute);
                _date.setHours(currentHour)
                _date.setDate(currentDay);
                _date.setFullYear(currentYear);
                _date.setMonth(currentMonth - 1);
                onDone(_date);
                close();
              }}>
                <label textAlignment={'center'} text={'SET'} />
              </stackLayout>
            </gridLayout>
          </gridLayout>
        )
      }}
    />
  )
}

export interface LocationModalProps extends BaseModalSelectorProps {
  places?: any[],
  value?: string
  ground?: boolean
  hasPopUp?: boolean
  onChange?(date: any): void,
  orientation?: DateModalOrientaion
}

export class LocationModal extends Component<LocationModalProps, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  private closeCallback: any;
  constructor(props: LocationModalProps) {
    super(props)
    this.state = {
      value: this.props.value ? this.props.value : null,
      lon: "",
      lat: "",
      name: "",
      address: "",
      place: false,
      error: {

      },
      isLoading: false,
      isVisible: false
    }
  }

  componentDidMount() {

    Frame.topmost().showModal(this.pageRef.current!.nativeView, {
      context: {},
      closeCallback: () => {
        this.closeCallback(true);
      },
      animated: true,
      fullscreen: true,
      stretched: false
    })
  }

  addPlace = () => {
    const _that = this
    const { value, place, lat, lon, address, name, error } = this.state;
    if ((name == "") || (this.state.name == null)) {
      error['name'] = true;
      this.setState({ error });
      return
    }

    if ((address == "") || (address == null)) {
      error['address'] = true;
      this.setState({ error });
      return
    }

    if ((lon == "") || (lon == null)) {
      error['lon'] = true;
      this.setState({ error });
      return
    }

    if ((lat == "") || (lat == null)) {
      error['lat'] = true;
      this.setState({ error });
      return
    }

    const dataTo = {
      user: user,
      lon: this.state.lon,
      address: this.state.address,
      lat: this.state.lat,
      name: this.state.name
    }

    const successCB = (data) => {
      this.setState({ isLoading: false });
      this.setPlace(data)
    }

    const failCB = (data) => {
      this.setState({ isLoading: false });
    }

    this.setState({ isLoading: true });

    const type = this.props.ground ? 'ground' : 'place';

    Methods.post(`https://supotsu.com/api/add-place/${type}/${user._id}`, dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.error) {
          failCB(res)
        } else {
          successCB(res)
        }
      },
      error(err) {
        failCB(err)
      }
    });

    return;
  }

  setPlace = (e) => {
    var val = (e.name) ? e.name : e
    if (this.props.onDone) this.props.onDone(e)
    this.setState({
      value: val,
      place: e,
      isLoading: false
    });
  }

  openPlacePicker = (args: EventData) => {
    const { value, isPicker = false } = this.state;
    if (isPicker) return;
    this.setState({ isPicker: true })

    const opts: ComboModalProps = {
      items: this.props.ground ? Methods.listify(user.grounds) : Methods.listify(user?.placesLived?.others),
      selected: value,
      complex: true,
      title: this.props.ground ? "Select Ground" : "Select Place",
      size: ComboModalHeaderSize.mini,
      onDone: (place?: any) => {
        if (place) {
          this.setState({ value: place })
        }

        this.setState({ isPicker: false });
      }
    }

    goToPageReact(ComboModal, opts, 'ComboModal')
  }

  renderContent = () => {
    const { value, place, lat, lon, address, name, error } = this.state;
    const { hasPopUp, ground } = this.props;
    if (this.state.isLoading) {
      return null;
    }

    return (
      <gridLayout row={1} rows={getItemSpec(['auto', '20', 'auto', '*'])} padding={20}>
        <gridLayout onTap={this.openPlacePicker} row={0} height={40} style={{
          borderColor: '#eee',
          borderWidth: 1,
          borderRadius: 4
        }} columns={getItemSpec(['*', '40'])}>
          <stackLayout style={{
            verticalAlignment: 'middle',
            padding: '0 10'
          }} col={0}>
            <label text={value ? value.name : "Select Place"} />
          </stackLayout>
          <stackLayout style={{
            verticalAlignment: 'middle',
            padding: '0 10'
          }} col={1}>
            <label className={"Ionicons size16"} color={new Color(Theme2['500'])} text={IconSet.Ionicons["ios-arrow-down"]} />
          </stackLayout>
        </gridLayout>
        <gridLayout row={2} columns={getItemSpec(['*', 'auto', '*'])} style={{
          verticalAlignment: 'middle',
          padding: 10
        }} col={0}>
          <label col={1} style={{
            margin: '0 10',
            color: new Color('#8F8F8F')
          }} text="OR" />
        </gridLayout>
        <scrollView row={3}>
          <stackLayout>
            <stackLayout style={{
              verticalAlignment: 'middle',
              borderColor: '#eee',
              borderWidth: 1,
              borderRadius: 4
            }} col={0}>
              <textField onTextChange={(args: any) => {
                const { text } = args.object;
                this.setState({ name: text })
              }} text={name} hint="Name" style={{
                //background: '#fff',
                borderBottomWidth: 0
              }} />
            </stackLayout>
            <LocDiv />
            <stackLayout style={{
              verticalAlignment: 'middle',
              borderColor: '#eee',
              borderWidth: 1,
              borderRadius: 4
            }} col={0}>
              <textField onTextChange={(args: any) => {
                const { text } = args.object;
                this.setState({ address: text })
              }} text={name} hint="Address" style={{
                //background: '#fff',
                borderBottomWidth: 0
              }} />
            </stackLayout>
            <LocDiv />
          </stackLayout>
        </scrollView>
      </gridLayout>
    )
  }

  render = () => {
    const { size, render, orientation } = this.props;
    const propsForHeader = size === "mini" ? {
      rootRows: getItemSpec(["auto", "40"]),
      rootMainRows: getItemSpec(["40", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        paddingTop: 5
      },
      backIconStyle: {},
      backIconClass: "Ionicons size10",
      title: this.props.title || "Select Place",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 18
      }
    } : {
      rootRows: getItemSpec(["auto", "58"]),
      rootMainRows: getItemSpec(["58", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
      },
      backIconStyle: {},
      backIconClass: "Ionicons size14",
      title: this.props.title || "Select Place",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 24
      }
    }

    return (
      <page onShownModally={(args: ShownModallyData) => {
        const _cb = args.closeCallback;
        this.closeCallback = (_data: any) => {
          _cb();
          if (this.props.onDone) this.props.onDone(_data)
        }
      }} actionBarHidden ref={this.pageRef}>
        <gridLayout rows={propsForHeader.rootMainRows} columns={'*'}>
          <stackLayout col={0} row={0}>
            <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
              <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                this.closeCallback(null)
              }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                {size === 'mini' &&
                  <image className="Ionicons size10" style={{
                    fontSize: 10
                  }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                }
                {size !== 'mini' &&
                  <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                }
              </flexboxLayout>
              <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 18
              } : {
                textAlignment: "left",
                fontWeight: "bold",
                fontSize: 24
              }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
              {this.state.value &&
                <flexboxLayout onTouch={onTouch} onTap={() => {
                  if (this.state.value && this.props.onDone) {
                    this.closeCallback(this.state.value)
                  }
                }} justifyContent="center" alignItems="center" col={5} padding="0 0" row={1}>
                  <stackLayout className="gmc-next-btn">
                    <label text="DONE" />
                  </stackLayout>
                </flexboxLayout>
              }
            </gridLayout>
          </stackLayout>
          {this.renderContent()}
        </gridLayout>
      </page>
    )
  }
}

interface LocationSelectorState {
  value?: any;
  lon?: string;
  lat?: string;
  name?: string;
  address?: string;
  place?: boolean;
  error?: Record<string, boolean>;
  isLoading?: boolean;
  isVisible?: boolean;
}

export const LocationSelector = ({
  size,
  title,
  ground,
  hasPopUp,
  onChange,
  orientation,
  places,
  renderTrigger,
  onDone
}: LocationModalProps) => {
  const [state, updateState] = React.useState<LocationSelectorState>(() => {
    return {

    }
  })

  const [locations, setLocations] = React.useState([])

  const propsForHeader = getModalStyle(size, title);

  const setState = (newState: Partial<LocationSelectorState>, cb = () => { }) => {
    updateState({
      ...state,
      ...newState
    })
  }

  const search = (text: string) => {
    googlePlacesAutocomplete.search(text).then((placeList: any) => {
      setLocations(placeList)
    }, (error => {
      setLocations([])
      console.log(error)
    }));
  }

  const addPlace = () => {
    const _that = this
    const { value, place, lat, lon, address, name, error } = state;
    if ((name == "") || (state.name == null)) {
      error['name'] = true;
      setState({ error });
      return
    }

    if ((address == "") || (address == null)) {
      error['address'] = true;
      setState({ error });
      return
    }

    if ((lon == "") || (lon == null)) {
      error['lon'] = true;
      setState({ error });
      return
    }

    if ((lat == "") || (lat == null)) {
      error['lat'] = true;
      setState({ error });
      return;
    }

    const dataTo = {
      user: user,
      lon: state.lon,
      address: state.address,
      lat: state.lat,
      name: state.name
    }

    const successCB = (data) => {
      setState({ isLoading: false });
      setPlace(data)
    }

    const failCB = (data) => {
      setState({ isLoading: false });
    }

    setState({ isLoading: true });

    const type = ground ? 'ground' : 'place';

    Methods.post(`https://supotsu.com/api/add-place/${type}/${user._id}`, dataTo, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        if (res.error) {
          failCB(res)
        } else {
          successCB(res)
        }
      },
      error(err) {
        failCB(err)
      }
    });

    return;
  }

  const setPlace = (e) => {
    var val = (e.name) ? e.name : e;
    setState({
      value: val,
      place: e,
      isLoading: false
    });
    if (onDone) {
      onDone(e)
      close();
    }
  }

  const renderContent = () => {
    const { value, place, lat, lon, address, name, error } = state;
    if (state.isLoading) {
      return null;
    }

    return (
      <gridLayout row={1} rows={getItemSpec(['auto', '20', 'auto', '*'])} padding={20}>
        <ComboSelector
          renderTrigger={(ref, open) => {
            return (
              <gridLayout onTap={open} row={0} height={40} style={{
                borderColor: '#eee',
                borderWidth: 1,
                borderRadius: 4
              }} columns={getItemSpec(['*', '40'])}>
                <stackLayout style={{
                  verticalAlignment: 'middle',
                  padding: '0 10'
                }} col={0}>
                  <label text={value ? value.name : "Select Place"} />
                </stackLayout>
                <stackLayout style={{
                  verticalAlignment: 'middle',
                  padding: '0 10'
                }} col={1}>
                  <label className={"Ionicons size16"} color={new Color(Theme2['500'])} text={IconSet.Ionicons["ios-arrow-down"]} />
                </stackLayout>
              </gridLayout>
            )
          }}
          items={ground ? Methods.listify(user.grounds) : Methods.listify(user?.placesLived?.others)}
          selected={value}
          complex
          title={ground ? "Select Ground" : "Select Place"}
          size={ComboModalHeaderSize.mini}
          onDone={(place?: any) => {
            console.log(place)
            if (place) {
              setState({ value: place })
            }
          }}
        />
        <gridLayout row={2} columns={getItemSpec(['*', 'auto', '*'])} style={{
          verticalAlignment: 'middle',
          padding: 10
        }} col={0}>
          <label col={1} style={{
            margin: '0 10',
            color: new Color('#8F8F8F')
          }} text="OR" />
        </gridLayout>
        <gridLayout rows='auto, 8, *' row={3}>
          <stackLayout>
            <stackLayout style={{
              verticalAlignment: 'middle',
              borderColor: '#eee',
              borderWidth: 1,
              borderRadius: 4,
              paddingLeft: 10,
              paddingRight: 10,
            }} col={0}>
              <textField onTextChange={(args: any) => {
                const { text } = args.object;
                setState({ address: text })
                search(text)
              }} text={name} hint="Address" style={{
                //background: '#fff',
                borderBottomWidth: 0
              }} />
            </stackLayout>
            <LocDiv />
          </stackLayout>
          {locations.length > 0 &&
            <$ListView
              row={2}
              background={'#fff'}
              items={locations}
              cellFactory={(item: any) => {
                return (
                  // You MUST pass the ref in to the component.
                  <flexboxLayout padding="8 16">
                    <label text={item.description} />
                  </flexboxLayout>
                );
              }}
              onItemTap={(args: ItemEventData) => {
                const index: number = args.index;
                const item: any = locations[index];

                setState({
                  value: {
                    name: item.description,
                    _id: item.place_id,
                    status: 'active',
                    date: new Date(),
                    coord: {
                      lat: 0,
                      lon: 0
                    }
                  }
                })
                setLocations([])
              }}
            />
          }
        </gridLayout>
      </gridLayout>
    )
  }

  return (
    <NativeModal
      fullscreen
      renderTriggerAction={(ref, open) => renderTrigger(ref, open)}
      renderContent={(open, close, isModalOpen) => {
        return (
          <gridLayout {...BasicSelectorStyle} rows={propsForHeader.rootMainRows} columns={'*'}>
            <stackLayout col={0} row={0}>
              <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
                <flexboxLayout className={size === ComboModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                  onDone(null)
                  close();
                }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                  {size === 'mini' &&
                    <image className="Ionicons size10" style={{
                      fontSize: 10
                    }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                  {size !== 'mini' &&
                    <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                  }
                </flexboxLayout>
                <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 18
                } : {
                  textAlignment: "left",
                  fontWeight: "bold",
                  fontSize: 24
                }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
                {state.value &&
                  <flexboxLayout onTouch={onTouch} onTap={() => {
                    if (state.value && onDone) {
                      onDone(state.value)
                      close();
                    }
                  }} justifyContent="center" alignItems="center" col={5} padding="0 0" row={1}>
                    <stackLayout className="gmc-next-btn">
                      <label text="DONE" />
                    </stackLayout>
                  </flexboxLayout>
                }
              </gridLayout>
            </stackLayout>
            {renderContent()}
          </gridLayout>
        )
      }}
    />
  )
}

interface BasicTextFieldProps {
  value?: string
  onTextChange(text: string): void
  hint?: string
  col?: number
  row?: number,
  keyboardType?: KeyboardType
}

export const BasicTextField = (props: BasicTextFieldProps) => {
  const { col, row } = props;
  return (
    <stackLayout {...col ? { col } : {}} {...row ? { row } : {}} style={{
      verticalAlignment: 'middle',
      borderColor: '#eee',
      borderWidth: 1,
      borderRadius: 4
    }}>
      <textField {...props.keyboardType ? { keyboardType: props.keyboardType } : {}} onTextChange={(args: any) => {
        const { text } = args.object;
        if (props.onTextChange) {
          props.onTextChange(text);
        }
      }} text={props.value} hint={props.hint} style={{
        //background: '#fff',
        borderBottomWidth: 0
      }} />
    </stackLayout>
  )
}


export const LocDiv = (props: { height?: number }) => <stackLayout height={props.height ? props.height : 20} />

export enum ModalHeaderSize {
  mini = "mini",
  normal = "normal"
}

export enum ModalActionButon {
  red = "gmc-next-btn red",
  blue = "gmc-next-btn"
}

export interface ModalProps {
  title?: string,
  onDoneTitle?: string,
  size: ModalHeaderSize,
  onDoneButton?: ModalActionButon,
  render?(): React.ReactNode,
  onDone?(data?: Modal): void,
  onClose?(): void,
  ref?(ref: Modal): void
  actionBarHidden?: boolean,
  header?(): React.ReactNode,
  appRef?: React.RefObject<any>;
}

const ModalContext = React.createContext({} as { appRef?: React.RefObject<any>; });

export const useOldModalRef = () => React.useContext(ModalContext);

export class Modal extends Component<ModalProps, any>{
  closeCallback: any;
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  constructor(props: ModalProps) {
    super(props)
  }

  componentDidMount() {
    if (this.props.ref) {
      this.props.ref(this)
    }
    Frame.topmost().showModal(this.pageRef.current!.nativeView, {
      context: {},
      closeCallback: () => {
        this.closeCallback(true);
      },
      animated: true,
      fullscreen: true,
      stretched: false
    })
  }

  render = () => {
    const { size, render, actionBarHidden } = this.props
    const propsForHeader = size === "mini" ? {
      rootRows: getItemSpec(["auto", "40"]),
      rootMainRows: actionBarHidden ? getItemSpec(["auto", "*"]) : getItemSpec(["40", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        paddingTop: 5
      },
      backIconStyle: {},
      backIconClass: "Ionicons size10",
      title: this.props.title || "Select",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 18
      }
    } : {
      rootRows: getItemSpec(["auto", "58"]),
      rootMainRows: actionBarHidden ? getItemSpec(["auto", "*"]) : getItemSpec(["58", "*"]),
      rootCols: getItemSpec(["10", "40", "*", "40", "6", "auto", "16"]),
      backIconHolderStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
      },
      backIconStyle: {},
      backIconClass: "Ionicons size14",
      title: this.props.title || "Select",
      titleStyle: {
        textAlignment: "left",
        fontWeight: "bold",
        fontSize: 24
      }
    }
    return (
      <ModalContext.Provider value={{
        appRef: this.props.appRef
      }}>
        <page onShownModally={(args: ShownModallyData) => {
          const _cb = args.closeCallback;
          this.closeCallback = (close?: boolean) => {
            if (close) {
              _cb();
              if (this.props.onClose) this.props.onClose()
            } else {
              _cb();
            }
          }
        }} actionBarHidden ref={this.pageRef}>
          <gridLayout rows={propsForHeader.rootMainRows} columns={'*'}>
            {!actionBarHidden && !this.props.header &&
              <stackLayout col={0} row={0}>
                <gridLayout backgroundColor="#334455" rows={propsForHeader.rootRows} columns={propsForHeader.rootCols}>
                  <flexboxLayout className={size === ModalHeaderSize.mini ? "size10" : "size14"} justifyContent="center" onTap={() => {
                    this.closeCallback(true)
                  }} alignItems="center" row={1} col={1} style={propsForHeader.backIconHolderStyle}>
                    {size === 'mini' &&
                      <image className="Ionicons size10" style={{
                        fontSize: 10
                      }} tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                    }
                    {size !== 'mini' &&
                      <image className="Ionicons size14" tintColor={new Color("#fff")} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} stretch="none" />
                    }
                  </flexboxLayout>
                  <label textWrap margin="0 10 0 5" verticalAlignment="middle" style={size === "mini" ? {
                    textAlignment: "left",
                    fontWeight: "bold",
                    fontSize: 18
                  } : {
                    textAlignment: "left",
                    fontWeight: "bold",
                    fontSize: 24
                  }} color={new Color("white")} row={1} col={2} text={propsForHeader.title} />
                  {this.props.onDone &&
                    <flexboxLayout onTouch={onTouch} onTap={() => {
                      this.props.onDone(this);
                    }} justifyContent="center" alignItems="center" col={5} padding="0 0" row={1}>
                      <stackLayout className={this.props.onDoneButton}>
                        <label text={this.props.onDoneTitle || "DONE"} />
                      </stackLayout>
                    </flexboxLayout>
                  }
                </gridLayout>
              </stackLayout>
            }
            {this.props.header && this.props.header()}
            {render && render()}
          </gridLayout>
        </page>
      </ModalContext.Provider>
    )
  }
}

export class FancyModal extends Component<any, any>{
  private readonly pageRef: React.RefObject<NSVElement<Page>> = React.createRef<NSVElement<Page>>();
  constructor(props: ModalProps) {
    super(props)
  }

  componentDidMount() {

    const opt: ShowModalOptions = {
      context: {},
      closeCallback: () => { },
      animated: true,
      fullscreen: true,
      stretched: true,
      android: {
        cancelable: true
      }
    }

    Frame.topmost().showModal(this.pageRef.current!.nativeView, opt)
  }

  render = () => {
    return (
      <page width={screen.mainScreen.widthDIPs} height={300} row={1} onLoaded={(args: EventData) => {
        if (isIOS) {
          this.pageRef.current!.nativeView.backgroundColor = new Color('transparent')
        } else {
          this.pageRef.current!.nativeView.backgroundColor = new Color('transparent')
        }
      }} background={'rgba(0,0,0,0)'} onShownModally={(args: ShownModallyData) => {
        console.log(args.object.get('view'));
      }} actionBarHidden ref={this.pageRef}>
        <gridLayout>
          {this.props.children}
        </gridLayout>
      </page>
    )
  }
}

export const TrainingAddButtonIcon = (_props: any) => {
  const { icon = "md-add", iconType = 'Ionicons', disabled = false, backgroundColor = Theme2['500'], size = 20, style, iconColor = "#fff", onPress = () => { }, marginRight = 0, ...props } = _props;
  const specials = ['md-create'];
  const specials2 = ['md-remove'];
  const sizeScale = size * 0.9;
  const fontSize = (size / 4) + 3;
  const classOf = `.size${fontSize.toString().replace('.', '_')}`;
  return (
    <flexboxLayout {...props} {...disabled ? {} : {
      onTouch
    }} style={{
      background: disabled ? '#eee' : backgroundColor,
      height: sizeScale,
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeScale,
      paddingTop: specials2.includes(icon) ? 2 : 1,
      ...specials.includes(icon) ? {
        paddingLeft: 1
      } : {},
      marginRight: 5,
      borderRadius: sizeScale / 2,
      ...style
    }} onTap={() => {
      if (disabled) return;
      if (onPress && typeof onPress === "function") {
        onPress()
      } else {
        console.log('No Listener')
      }
    }}>
      <image className={`${iconType} ${classOf}`} style={{
        fontSize,
        width: fontSize,
        height: fontSize
      }} tintColor={new Color(iconColor)} src={`font://${IconSet[iconType][icon]}`} />
    </flexboxLayout>
  )
}

export const EmbedMaterial = (args: any) => {
  const { isFile, file, session, ...props } = args;
  if (!isFile) {
    const _file = session.files[0] ? session.files[0] : false;
    return (
      <SessionFile {...props} isShared={true} isGrid={false} isSession={true} file={_file} session={session} />
    )
  }

  return (
    <SessionFile {...props} isShared={true} isGrid={false} file={file} />
  );
};

const SessionFile = (props) => <GenericFile {...props} />;

export class GenericFile extends Component<any, any> {
  constructor(p) {
    super(p)
    const selection = Methods.listify(p.selection).filter((_file) => {
      return _file._id === p.file._id
    });
    this.state = {
      isSharing: false,
      isSelected: selection.length > 0 ? true : false,
      isViewing: false,
      hasImage: true,
      height: 'auto'
    }
  }

  containerStyle;

  gridStyle;

  componentWillMount = () => {
    if (!this.props.isVideo && !this.props.isPhoto) {
      const file = this.props.file || this.props._file;
      let uri = file.type === "document" ? this.images[file.file.type] : file.type === "video" ? { uri: '' } : { uri: `https://supotsu.com/${file.file.url}` };
      let video = this.getEmbedIcon(file);
      if (file.isLink && !video.url) {
        return null;
      }

      uri = file.isLink ? { uri: video.url } : uri;
    } else if (this.props.isPhoto) {
      const uri = { uri: this.props.photo.media[0].url };
    }

    this.gridStyle = this.props.isGrid ? {} : { height: 70, width: 100 }
    this.containerStyle = {
      width: '100%',

      flexDirection: this.props.isGrid ? "column" : "row",
      padding: this.props.isGrid ? 0 : 10,
      marginTop: this.props.isShared ? 10 : 0,
      paddingTop: this.props.isShared ? 10 : this.props.isGrid ? 0 : 3,
      paddingRight: this.props.isGrid ? 0 : 0,
      paddingBottom: this.props.isGrid ? 0 : 0,
      backgroundColor: this.props.isSelected ? Theme2['500'] : this.props.isShared ? '#eee' : 'white'
    }
  }

  componentDidMount = () => {

  }

  setImageSize = (width, height) => {
    const _width = screen.mainScreen.widthDIPs - 50;
    this.setState({
      width: width,
      height: height * (_width / width)
    });

    this.setState({ isLoading: false });
  }

  getDocumentIcon = (type) => {
    let str = "";
    switch (type) {
      case "pdf":
        str = "";
        break;
      case "xls":
        str = "";
        break;
      case "doc":
        str = "doc_icon_training.svg";
        break;
      case "ppt":
        str = "";
        break;
      default:
        break;
    }
    return "";
  }

  getEmbedIcon = ({ link = "" }) => {
    if (!link) return null;
    let uri = "";
    let id;
    const source = Methods.extractHostname(link);
    let color = "";
    let icon = "";
    let iconType = "";
    let url;
    if (source === "dailymotion.com") {
      id = Methods.dailymotionID(link)
      uri = "//www.dailymotion.com/video/" + id;
      icon = "md-videocam";
      color = Theme2['500'];
      iconType = "Ionicons";
      url = `https://www.dailymotion.com/thumbnail/video/${id}`
    } else if (source === "vimeo.com") {
      id = Methods.vimeoID(link)
      uri = "https://player.vimeo.com/video/" + id;
      icon = "logo-vimeo";
      color = Theme2['500'];
      iconType = "Ionicons";
      url = `https://i.vimeocdn.com/video/${id}_640.jpg`
    } else if (source === "youtube.com") {
      id = Methods.youtubeID(link)
      uri = "https://www.youtube.com/embed/" + id;
      icon = "logo-youtube";
      color = "red";
      iconType = "Ionicons"
      url = `https://img.youtube.com/vi/${id}/0.jpg`
    } else if (source === "vine.co") {
      uri = "https://vine.co/v/" + id;
      icon = "vine";
      color = Theme2['500'];
      iconType = "Entypo"
    } else {
      uri = null;
    }

    return { uri, icon, color, iconType, url };
  }

  getDocumentSource = (type, id) => {
    let obj: any = {
      icon: 'logo-youtube',
      color: '#D33242',
      url: `https://img.youtube.com/vi/${id}/0.jpg`
    };
    switch (type) {
      case "vimeo":
        obj = {
          icon: 'logo-vimeo',
          color: Theme2['500']
        };
        break;
      case "xls":
        obj = "";
        break;
      case "doc":
        obj = "doc_icon_training.svg";
        break;
      case "ppt":
        obj = "";
        break;
      default:
        break;
    }
    return "";
  }

  images = {
    pdf: "~/images/assets/pdf__.png",
    xls: "~/images/assets/xls__.png",
    ppt: "~/images/assets/ppt__.png",
    doc: "~/images/assets/doc__.png"
  };

  AvatarView = ({ isGrid = true, hasIcon = false, iconName = "videocam", innerStyle = {}, children, ...props }) => {
    if (isGrid) {
      return (
        <SquareView {...props} innerStyle={innerStyle}>
          {children}
        </SquareView>
      )
    } else {
      return (
        <flexboxLayout {...props}>{children}</flexboxLayout>
      )
    }
  }

  renderSession = () => {
    const { file, isAddingToSession, isEditting, canFav, BannerImage, isGrid, isVideo, isSession, session } = this.props;
    const { isSharing, isSelected, isViewing } = this.state;
    let uri: any = !file ? false : file.type === "document" && (file.file && file.file.type) ? this.images[file.file.type] : file.type === "video" ? { uri: '' } : { uri: `https://supotsu.com/${file.file.url}` };
    let video: any = !file ? false : this.getEmbedIcon(file);
    const { AvatarView } = this;

    uri = !file ? false : file.isLink ? { uri: video.url } : uri;

    const gridStyle = isGrid ? {} : { height: 100 }

    return null;
  }

  renderVideo = () => {
    const { file, isAddingToSession, isEditting, canFav, isShared, BannerImage, isGrid, isVideo, video } = this.props;
    const { isSharing, isSelected, isViewing, hasImage } = this.state;
    const { AvatarView } = this;

    let uri = { uri: !hasImage ? video.user.image : video.poster };
    const gridStyle = isGrid ? {} : { height: 100 }

    return null;
  }

  renderPhoto = () => {
    const { file, photo, isAddingToSession, SvgUri, isEditting, canFav, isShared, BannerImage, isGrid, isVideo, video } = this.props;
    const { isSharing, isSelected, isViewing, hasImage } = this.state;
    const { AvatarView } = this;
    //`https://supostu.com/${item.media[0].url}`

    let uri = { uri: `https://supotsu.com/${photo.media[0].url}` };
    const gridStyle = isGrid ? {} : { height: 100 }

    return null;
  }

  renderSessionFile = () => {
    const { file, isAddingToSession, isEditting, isShared, isPhoto, canFav, BannerImage, isGrid, CustomView, isVideo, isSession, session } = this.props;
    const { isSharing, isSelected, isViewing } = this.state;
    let uri;
    let video;
    const gridStyle = isGrid ? {} : { height: 100 }

    uri = file.type === "document" ? this.images[file.file.type] : file.type === "video" ? { uri: '' } : { uri: `https://supotsu.com/${file.file.url}` };
    video = this.getEmbedIcon(file);
    const { AvatarView } = this;
    if (file.isLink && !video.url) {
      return null;
    }

    uri = file.isLink ? { uri: video.url } : uri;

    return null;
  }

  render = () => {
    const { file, isAddingToSession, isEditting, isShared, isPhoto, SvgUri, canFav, BannerImage, isGrid, CustomView, isVideo, isSession, session } = this.props;
    const { isSharing, isSelected, isViewing } = this.state;
    const { AvatarView } = this;
    let uri;
    let video;
    if (!file || !file._id) return null;
    const gridStyle = isGrid ? {} : { height: 100 }
    if (isVideo) {
      return (
        <React.Fragment>
          {this.renderVideo()}
        </React.Fragment>
      )
    } else if (isPhoto) {
      return (
        <React.Fragment>
          {this.renderPhoto()}
        </React.Fragment>
      )
    } else if (isSession) {
      return (
        <React.Fragment>
          {this.renderSession()}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {this.renderSessionFile()}
        </React.Fragment>
      )
    }
  }
}

export const PreviewBadge = ({ icon = 'more-horiz', type = 'MaterialIcons', count = 0, size = 25 }) => {
  return null;
}

const SessionFileContent = ({ title = '', views = 0, CustomView = false, isMediaFile = false, description = '', isShared = false, fileUser, date = false, isGrid = true, file, ...props }) => {
  const _style = isGrid ? {} : { flex: 1, paddingLeft: 10 }
  return null;
}

export const SquareView = ({ innerStyle, ...props }) => {
  return (
    <absoluteLayout {...props}>
      <label style={{

      }} />
      <flexboxLayout style={{
        width: '100%',
        height: '100%',
        zIndex: 1,
        ...innerStyle
      }}>
        {props.children}
      </flexboxLayout>
    </absoluteLayout>
  )
}

interface CommonHeaderIcon {
  className?: string,
  icon: string,
  size?: number,
  onPress?(): void,
  count?: number
}

export const CommonHeader = (p: any) => {
  const headerRef = React.useRef();
  const { user = Methods.you(), subTitle = false, isLandScape = false, isGame = false, transparent = false, titleStyle = {}, onAction = false, onGameAction = false, titleOnly = false, userPress = false, size = 40, avatar = false, pictureBackground = Theme['600'], SvgUri, goBack = false, navigation, collapsible, icons = [], search = false, background = '#334455', color = '#fff', ...props } = p;
  const icons_ = [];

  icons.forEach((item: CommonHeaderIcon, i) => {
    if (i > 2) return null
    const _size = item.size ? item.size : (size - 16)
    icons_.push(
      <absoluteLayout onTouch={onTouch} row={1} col={i + 5} marginLeft={8} key={i} style={{
        //height: size,
        //width: size,
        //borderRadius: size/2,
        //background: Theme['600'],
        //alignItems: 'center',
        //justifyContent: 'center'
      }} onTap={() => {
        if (item.onPress) {
          item.onPress()
        }
      }}>
        <flexboxLayout top={0} left={0} justifyContent="center" alignItems="center" style={{
          height: size,
          width: size,
          borderRadius: size / 2,
          marginTop: 8,
          background: transparent ? 'rgba(0, 0, 0, 0.4)' : Methods.alpha(background, 0.5),
        }}>
          <image src={item.className ? `font://${IconSet[item.className][item.icon]}` : `font://${IconSet.Ionicons[item.icon]}`} tintColor={new Color("#fff")} className={item.className ? `${item.className} size14` : 'Ionicons size14'} stretch="none" />
        </flexboxLayout>
        {item.count &&
          <label className={`${item.className} size${_size}`} top={0} left={0} style={{

          }} text={IconSet[item.className][item.icon] || ""} />
        }
      </absoluteLayout>
    )
  });

  const backIconClassName = `Ionicons size12`;

  React.useEffect(() => {
    if (!headerRef) return;
    const { current } = headerRef;
    if (current) {
      // @ts-ignore
      const view = current.nativeView as StackLayout;
      const page = view.page;
      if (isIOS) {

      } else {
        if (page) page.androidStatusBarBackground = new Color(background);
      }
    }

    return () => {
      if (current) {
        // @ts-ignore
        const view = current.nativeView as StackLayout;
        const page = view.page;
        if (isIOS) {

        } else {
          if (page) page.androidStatusBarBackground = new Color(Theme[500]);
        }
      }
    }
  }, [headerRef])

  return (
    <stackLayout ref={headerRef} col={props.col ? props.col : 0} row={props.row ? props.row : 0} {...transparent ? {
      paddingTop: 8
    } : {}}>
      <gridLayout background={transparent ? "transparent" : background} rows={getItemSpec(["auto", "58", '2'])} columns={getItemSpec(["16", "auto", "auto", "*", "6", "auto", "auto", "auto", 'auto'])} paddingRight={16}>
        {goBack &&
          <flexboxLayout style={{
            height: size,
            width: size,
          }} justifyContent="center" onTap={goBack} alignItems="center" paddingTop={5} row={1} col={1}>
            <image className={backIconClassName} tintColor={new Color(color)} src={`font://${IconSet.Ionicons["md-arrow-round-back"]}`} row={1} col={1} stretch="none" />
          </flexboxLayout>
        }
        {!search && !titleOnly && user.image &&
          <image src={user.image.replace(".svg", ".png")} stretch="fill" row={1} col={2} style={{
            height: size,
            width: size,
            borderRadius: size / 2,
            background: Methods.alpha(background, 0.5)
          }} />
        }
        {!search && (
          <stackLayout marginLeft={16} row={1} col={3} padding={0} verticalAlignment={'middle'}>
            <label textWrap verticalAlignment="bottom" style={{
              textAlignment: 'left',
              fontWeight: 'bold',
              fontSize: size / 2,
              padding: 0,
              margin: 0
            }} color={new Color(color)} row={1} col={3} text={user.first_name ? user.first_name : user.name} />
            {subTitle &&
              <label textWrap margin="0 10" verticalAlignment="middle" style={{
                textAlignment: 'left',
                fontSize: 9,
                padding: 0,
                margin: 0
              }} color={new Color(color)} row={1} col={3} text={subTitle} />
            }
          </stackLayout>
        )}
        {search && (
          <stackLayout>
            <flexboxLayout style={{
              margin: 8,
              background: Theme[800],
              borderRadius: 8,
            }} />
          </stackLayout>
        )}
        {icons_}
      </gridLayout>
    </stackLayout>
  )
}

export class ShareContext extends Component<any, any>{
  private textField: any;
  modalRef: Modal;
  constructor(props) {
    super(props)
    this.state = {
      isActive: false,
      activeShareIndex: this.props.shareType !== "POST" ? 1 : 0,
      activeShare:
        this.props.shareType !== "POST"
          ? {
            key: "F",
            tag: "Friend",
            val: "Share on a Friend's timeline",
            img: ".././images/who_sees_friends.svg",
            bg: ""
          }
          : {
            key: "Y",
            tag: "You",
            val: "Share on your timeline",
            img: ".././images/user-picture.svg",
            bg: "#58CC66",
            withPadding: true
          },
      tabs: [
        {
          key: "Y",
          tag: "You",
          val: "Share on your timeline",
          img: ".././images/user-picture.svg",
          bg: "#58CC66",
          withPadding: true
        },
        {
          key: "F",
          tag: "Friend",
          val: "Share on a Friend's timeline",
          img: ".././images/who_sees_friends.svg",
          bg: ""
        },
        {
          key: "Q",
          tag: "Group",
          val: "Share in a Group",
          img: ".././images/facebook-group.svg",
          bg: "#58CC66",
          withPadding: true
        },
        {
          key: "T",
          tag: "Team",
          val: "Share on a Team's timeline",
          img: ".././images/who_sees_game.svg",
          bg: ""
        },
        {
          key: "C",
          tag: "Club",
          val: "Share on a Club's timeline",
          img: ".././images/club.svg",
          bg: "#f43",
          withPadding: true
        },
        {
          key: "L",
          tag: "Tournament",
          val: "Share on a Tournament's timeline",
          img: ".././images/who_sees_league.svg",
          bg: ""
        },
        {
          key: "I",
          tag: "Institution",
          val: "Share on an Institution's timeline",
          img: ".././images/institution_icon.svg",
          bg: "#888",
          withPadding: true
        }
      ],
      tagged: [],
      filter: "",
      content: "",
      comment: '',
      rawContent: '',
      isTagging: false,
      isCheckingIn: false,
      canAlsoPost: false,
      isWhoToSeeContent: false,
      isPosting: false,
      users: [],
      location: "",
      coord: { lat: 0, lng: 0 },
      index: 0,
      total: 1,
      posts: [],
      files: [],
      post: {
        content: "",
        rawContent: "",
        postType: "normal",
        media: [],
        links: [],
        tags: [],
        audienceList: [],
        place: { name: "" },
        coord: { lat: 0, lng: 0 }
      }
    }
  }

  open = () => {
    this.setState({ isActive: true });
  }

  getPostBody = () => {
    this.setState({ isPosting: true });
    const { tagged, canAlsoPost } = this.state;
    const user = this.state.user ? this.state.user : Methods.you()

    const _that = this;

    const _userTo = tagged.length === 1 ? {
      name: tagged[0].name,
      image: tagged[0].image,
      id: tagged[0]._id,
      type: tagged[0].type
    } : {
      name: user.name,
      image: user.image,
      id: user._id,
      type: user.type
    }

    if (user.type !== "F" && canAlsoPost) {
      tagged.push(Methods.you());
    }

    const { refreshPosts } = this.props;

    const finalCB = () => {
      if (refreshPosts && typeof refreshPosts === "function") {
        refreshPosts();
      }
      alert('Post shared')
      _that.resetState()
    }

    const newPost = {
      user: {
        ...user,
        id: user._id
      },
      userTo: _userTo,
      type: 1,
      postType: "normal",
      sport: _that.state.sport,
      isError: false,
      isEvent: false,
      content: _that.state.content,
      rawContent: _that.state.rawContent,
      media: [],
      timeAgo: new Date(),
      isLiked: false,
      likes: [],
      links: [],
      linkImages: [],
      place: _that.state.post.place,
      shares: [],
      commentType: "post",
      audience: "friends",
      tagged: _that.state.tagged,
      audienceList: [],
      tagsLen: _that.state.tagged.length,
      comments: [],
      shareType: _that.props.shareType,
      isShared: true,
      shareContent: {
        type: _that.props.shareType,
        id: _that.props.post._id
      }
    };

    const failCB = (err) => {
      this.setState({ isPosting: false });
    }

    const successCB = (res) => {
      if (Methods.shared(`home-posts`)) {
        Methods.shared(`home-posts`).newPost(res)
      }
      _that.setState({ isPosting: false });
      _that.resetState()
      _that.setState({ isAdding: false });
      finalCB();
    }

    console.log('sharing...')


    if (_that.modalRef) {
      _that.modalRef.closeCallback(true)
    }

    Methods.post(`https://supotsu.com/api/feed/create`, newPost, {
      headers: {
        'Content-Type': 'application/json'
      },
      success(res) {
        _that.setState({ res }, () => {
          if (res.error) {
            failCB(res)
          } else {
            successCB(res)
          }
        })
      },
      error(err) {
        console.log(err)
        failCB(err);
      }
    })
  }

  resetState = () => {
    this.setState({
      isActive: false,
      activeShareIndex: this.props.shareType !== "POST" ? 1 : 0,
      activeShare:
        this.props.shareType !== "POST"
          ? {
            key: "F",
            tag: "Friend",
            val: "Share on a Friend's timeline",
            img: ".././images/who_sees_friends.svg",
            bg: ""
          }
          : {
            key: "Y",
            tag: "You",
            val: "Share on your timeline",
            img: ".././images/user-picture.svg",
            bg: "#58CC66",
            withPadding: true
          },
      tabs: [
        {
          key: "Y",
          tag: "You",
          val: "Share on your timeline",
          img: ".././images/user-picture.svg",
          bg: "#58CC66",
          withPadding: true
        },
        {
          key: "F",
          tag: "Friend",
          val: "Share on a Friend's timeline",
          img: ".././images/who_sees_friends.svg",
          bg: ""
        },
        {
          key: "Q",
          tag: "Group",
          val: "Share in a Group",
          img: ".././images/facebook-group.svg",
          bg: "#58CC66",
          withPadding: true
        },
        {
          key: "T",
          tag: "Team",
          val: "Share on a Team's timeline",
          img: ".././images/who_sees_game.svg",
          bg: ""
        },
        {
          key: "C",
          tag: "Club",
          val: "Share on a Club's timeline",
          img: ".././images/club.svg",
          bg: "#f43",
          withPadding: true
        },
        {
          key: "L",
          tag: "Tournament",
          val: "Share on a Tournament's timeline",
          img: ".././images/who_sees_league.svg",
          bg: ""
        },
        {
          key: "I",
          tag: "Institution",
          val: "Share on an Institution's timeline",
          img: ".././images/institution_icon.svg",
          bg: "#888",
          withPadding: true
        }
      ],
      tagged: [],
      filter: "",
      content: "",
      comment: '',
      rawContent: '',
      isTagging: false,
      isCheckingIn: false,
      canAlsoPost: false,
      isWhoToSeeContent: false,
      isPosting: false,
      users: [],
      location: "",
      coord: { lat: 0, lng: 0 },
      index: 0,
      total: 1,
      posts: [],
      files: []
    });
  }

  onClose = () => {
    this.resetState()
  }

  getUsers = key => {
    let List = [];
    switch (key) {
      case "F":
        List = Methods.listify(Methods.you().friends).filter((item, i) => {
          const block = Methods.getBlocked({ props: {} }, false, [key]);
          return !Methods.inArray(item._id, block)
        });
        List.forEach((item, i) => {
          item.type = "F";
        });
        break;
      case "T":
        List = Methods.listify(Methods.you().myTeams).filter((item, i) => {
          const block = Methods.getBlocked({ props: {} }, false, [key]);
          return !Methods.inArray(item._id, block)
        });
        List.forEach((item, i) => {
          item.type = "T";
        });
        break;
      case "C":
        List = Methods.listify(Methods.you().clubs).filter((item, i) => {
          const block = Methods.getBlocked({ props: {} }, false, [key]);
          return !Methods.inArray(item._id, block)
        });
        List.forEach((item, i) => {
          item.type = "C";
        });
        break;
      case "I":
        List = Methods.listify(Methods.you().institutions).filter((item, i) => {
          const block = Methods.getBlocked({ props: {} }, false, [key]);
          return !Methods.inArray(item._id, block)
        });
        List.forEach((item, i) => {
          item.type = "I";
        });
        break;
      case "L":
        List = Methods.listify(Methods.you().leagues).filter((item, i) => {
          const block = Methods.getBlocked({ props: {} }, false, [key]);
          return !Methods.inArray(item._id, block)
        });
        List.forEach((item, i) => {
          item.type = "L";
        });
        break;
      case "Q":
        List = Methods.listify(Methods.you().groups).filter((item, i) => {
          const block = Methods.getBlocked({ props: {} }, false, [key]);
          return !Methods.inArray(item._id, block)
        });
        List.forEach((item, i) => {
          item.type = "Q";
        });
        break;
      default:
        List = [];
        break;
    }

    return List.sort((a, b) => (a.name > b.name) ? 1 : -1);
  };

  inArray = (item = { _id: 0, type: "" }, tagged = []) => {
    const list = tagged.filter(_item => {
      return _item._id === item._id && _item.type === item.type;
    });

    return list.length > 0 ? true : false;
  };

  onAddTag = tags => {
    this.setState({
      users: tags
    });
  };

  Padding = ({ padding, paddingHorizontal, paddingBottom, paddingLeft, paddingRight, paddingTop, paddingVertical, children, style }) => {
    return (
      <stackLayout style={{
        padding,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        ...style,
        ...paddingHorizontal ? {
          paddingLeft: paddingHorizontal,
          paddingRight: paddingHorizontal
        } : {},
        ...paddingVertical ? {
          paddingBottom: paddingVertical,
          paddingTop: paddingVertical
        } : {}
      }}>
        {children}
      </stackLayout>
    )
  }

  renderTagView = () => {
    const { location, navigation, NativeBase, MaterialIcons, SvgUri, isFab, Fab } = this.props;
    //const { Icon, Toast } = NativeBase;
    const { isTagging, post } = this.state;
    return (
      <TagUser title={"Tag A Friend"} onCancel={() => {
        this.setState({ isTagging: false });
      }} onAction={(users = []) => {
        const cb = () => {
          this.setState({ isTagging: false, users });
        }
        cb()
      }} hasAction={true} actionBtnText={"DONE"} closeBtnText={"CANCEL"} animationType={"slide"} presentationStyle={'formSheet'} visible={isTagging} {...this.props} toId={this.props.postToId}
        toType={this.props.postToType} onRequestClose={() => {
          this.setState({ isTagging: false });
        }} />
    )
  }

  renderCheckin = () => {
    const { location, navigation, NativeBase, MaterialIcons, SvgUri, isFab, Fab } = this.props;
    //const { Icon, Toast } = NativeBase;
    const { isCheckingIn, coord } = this.state;
    return (
      <CheckIn title={"Check In"} onCancel={() => {
        this.setState({ isCheckingIn: false });
      }} onAction={(place) => {

        const cb = () => {
          this.setState({ isCheckingIn: false, location: place.name, coord: { lng: place.lon, lat: place.lat } });
        }

        cb()
      }} hasAction={true} actionBtnText={"DONE"} closeBtnText={"CANCEL"} animationType={"slide"} presentationStyle={'formSheet'} visible={isCheckingIn} {...this.props} toId={this.props.postToId}
        toType={this.props.postToType} />
    )
  }

  renderWhoToSee = () => {
    const { location, navigation, NativeBase, MaterialIcons, SvgUri, isFab, Fab } = this.props;
    //const { Icon, Toast } = NativeBase;
    const { isWhoToSee } = this.state;

    return (
      <WhoShouldSee {...this.props} activeIndex={this.state.activeShareIndex} active={this.state.activeShare} onCancel={() => {
        this.setState({ isWhoToSee: false });
      }} onAction={(tagged = []) => {
        const cb = () => {
          this.setState({ isWhoToSee: false, tagged });
        }
        cb()
      }} hasAction={true} positiveText={"Share"} actionBtnText={"DONE"} closeBtnText={"CANCEL"} animationType={"slide"} presentationStyle={'formSheet'} visible={isWhoToSee} />
    )
  }

  onSuggestionTap = (user, hidePanel) => {
    const { comment, rawContent } = this.state;
    hidePanel();

    let _comment = comment.slice(0, - this.state.keyword.length);
    _comment = _comment + user.name;

    let rawComment = rawContent.slice(0, - this.state.keyword.length);
    let rawText = Methods.nullify(_comment);
    Methods.listify(Methods.getTaggableUsers()).forEach((item, i) => {
      const _content = "%" + item._id + "^" + item.type + "%";
      rawText = rawText.replace(item.name, _content);
      rawText = rawText.replace("@", "");
    })
    //rawComment = _comment + `%${user._id}^${user.type}%`;

    this.setState({
      value: _comment + '@' + user.name,
      rawComment: rawText,
      content: _comment,
      comment: _comment,
      textField: this.textField
    }, () => {
      if (this.textField) {
        this.textField._textInput.focus()
      }
    })
  }

  callback = (keyword = '') => {
    const _filter = keyword.replace("@", "");
    this.setState({
      keyword: keyword,
      friends: Methods.getTaggableUsers().filter((item, i) => {
        return item.name.toLowerCase().indexOf(_filter.toLowerCase()) > -1;
      })
    })
  }

  openModal = () => {
    const { type, post, hideSportLabel, style, isVideo, noAction, col, row } = this.props;
    const {
      activeShare,
      tabs,
      filter,
      content,
      tagged,
      canAlsoPost,
      isTagging,
      isCheckingIn,
      isPosting,
      index,
      total,
      isActive
    } = this.state;

    const render = () => {
      const { Embed, shareType, SvgUri, KeyboardAccessoryView } = this.props;
      const { canAlsoPost, isCheckingIn, isTagging, tabs, tagged, content, location, user = Methods.you(), tag, isUserSending } = this.state;
      const width = screen.mainScreen.widthDIPs;
      const height = screen.mainScreen.heightDIPs;
      return (
        <gridLayout row={1} style={{
          background: "white",
          //paddingBottom: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTopWidth: 0,
          borderColor: "rgba(0, 0, 0, 0.1)"
        }}>
          {this.state.isPosting &&
            <React.Fragment>
              <LoadingState text={`Posting...`} />
            </React.Fragment>
          }
          {!this.state.isPosting &&
            <React.Fragment>
              <gridLayout rows={getItemSpec(['*', '10', 'auto'])}>
                <gridLayout row={0} rows={getItemSpec(['*', 'auto', 'auto', 'auto'])}>
                  <gridLayout row={2} columns={getItemSpec(['*', 'auto'])} paddingLeft={10} paddingRight={10} paddingTop={10} paddingBottom={5} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <flexboxLayout col={0} style={{
                      marginRight: 30,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <GoLiveUserPicker textColor={"#555"} onUserClick={() => {
                        this.setState({ isUserSending: !isUserSending, WhoShouldSee: false });
                      }} isTop {...this.props} user={user} tag={tag} onPickerFocus={() => {
                        this.setState({ isPickingCrowd: true, isSelectingUser: false, isUserSending: false });
                      }} onUserSelect={(user) => {
                        this.setState({ user, isSelectingUser: false });
                      }} onTagSelect={(tag) => {
                        this.setState({ tag, isPickingCrowd: false, isSelectingUser: (tag.val === "Public") ? false : true, user: (tag.val === "Public") ? (this.props.user && this.props.user._id !== null ? this.props.user : Methods.you()) : { id: null } });
                      }} />
                    </flexboxLayout>
                    {user.type === "F" &&
                      <WhoShouldSeeTapPopUp
                        TriggerButton={({ label = false, onTap, ...props }) => {
                          return (
                            <flexboxLayout
                              col={1}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: ms(35),
                                paddingLeft: ms(16),
                                paddingRight: ms(16),
                                background: Theme2['500'],
                                borderRadius: ms(35) / 2
                              }} {...props} onTap={() => {
                                //this.setState({ WhoShouldSee: !this.state.WhoShouldSee });
                                console.log('nn')
                                if (typeof onTap === "function") onTap()
                              }}>
                              <label style={{
                                color: new Color("#FFF")
                              }} text={this.state.WhoShouldSee ? "Close" : "Share with"} />
                            </flexboxLayout>
                          )
                        }}
                        onItemTap={(tags: any, i) => {
                          this.setState({ WhoShouldSee: false, isPickingCrowd: false, isSelectingUser: false, activeShare: tag, activeShareIndex: (i - 1), isWhoToSee: true });
                        }}
                      />
                    }
                  </gridLayout>
                  <stackLayout row={0} padding={8}>
                    <textView onLoaded={clearBorder} borderBottomWidth={0} onTextChange={(args: any) => {
                      this.setState({
                        content: args.object.text,
                        rawContent: args.object.text
                      })
                    }} text={this.state.content} hint={'Write something...'} />
                  </stackLayout>
                  <stackLayout row={1}>
                    {location.length > 0 &&
                      <flexboxLayout style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}>
                        <label text={"At"} /> <A text={location} />
                      </flexboxLayout>
                    }
                    {Embed}
                  </stackLayout>
                </gridLayout>
                <gridLayout row={2} style={{
                  //marginTop: 10,
                  //paddingLeft: 10,
                  //paddingRight: 10,
                  //borderTopColor: new Color('#ccc'),
                  //borderTopWidth: 1,
                  //paddingTop: 10,
                  //paddingBottom: Methods.ifIphoneX(30, 10)
                }} columns={getItemSpec(['*'])}>
                  {!Methods.isYou() &&
                    <flexboxLayout col={0} style={{
                      padding: `8 16`,
                      background: '#eee',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: ms(35) / 2
                    }} onTap={() => {
                      if (this.modalRef) {
                        this.modalRef.closeCallback(true)
                      }
                    }}>
                      <label style={{
                        color: new Color('#555')
                      }} text={"Cancel"} />
                    </flexboxLayout>
                  }
                  <flexboxLayout col={0} style={{
                    //padding: `0 16`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 50,
                    background: Theme2['500'],
                    borderRadius: 0,// ms(35) / 2
                  }} onTap={() => {
                    if (!this.state.isPosting) this.getPostBody();
                    //this.setState({ newPost:_post });
                  }}>
                    {this.state.isPosting && (
                      <activityIndicator width={20} height={20} color="#fff" />
                    )}
                    {!this.state.isPosting && (
                      <label style={{
                        color: new Color('#fff')
                      }} text={this.state.isPosting ? "SHARING..." : "SHARE NOW"} />
                    )}
                  </flexboxLayout>
                </gridLayout>
              </gridLayout>
            </React.Fragment>
          }
        </gridLayout>
      )
    }

    const _that = this;

    const opt: ModalProps = {
      title: _that.props.user ? _that.props.user.name : Methods.you().name,
      //onDoneTitle: 'DONE',
      size: ModalHeaderSize.normal,
      render,
      appRef: this.props.appRef,
      actionBarHidden: true,
      /*
      ref: (ref) => {
          this.modalRef = ref;
      },
      */
      header() {
        return (
          <CommonHeader size={30} subTitle={'Share post'} user={{
            name: 'Share',
            image: _that.props.user.image,
            ..._that.props.user
          }} goBack={() => {
            _that.setState({ isAdding: false });
            if (_that.modalRef) {
              _that.modalRef.closeCallback(true)
            }
          }} />
        )
      },
      onDoneButton: ModalActionButon.red,
      onClose: () => {
        this.setState({ isAdding: false });
      }
    }

    goToPageReact(Modal, opt, 'ShareContextModal')
  }

  render = () => {
    const { type, post, hideSportLabel, style, isVideo, FancyModal, noAction, col, row } = this.props;
    const {
      activeShare,
      tabs,
      filter,
      content,
      tagged,
      canAlsoPost,
      isTagging,
      isCheckingIn,
      isPosting,
      index,
      total,
      isActive
    } = this.state;
    const list = this.getUsers(activeShare.key).filter(item => {
      return (
        Methods.nullify(item.name)
          .toLowerCase()
          .indexOf(filter.toLowerCase()) > -1
      );
    });

    // @ts-ignore
    const _children = React.Children.map(this.props.children, (child, i) => React.cloneElement(child, {
      onTap: () => {
        this.setState({ isActive: true });
        if (this.props.onPress) {
          this.props.onPress()
        }
      }
    }))


    return (
      <React.Fragment>
        {!noAction &&
          <stackLayout padding={0} onTap={() => {
            this.openModal()
            if (this.props.onPress) {
              this.props.onPress()
            }
          }} {...row ? { row } : {}} {...col ? { col } : {}}>
            {_children}
          </stackLayout>
        }
      </React.Fragment>
    )
  }
}

export const A = ({ text, ...props }) => <label style={{ fontWeight: 'bold', color: new Color(Theme2['500']), ...props.style }} text={text} />


export class GoLiveUserPicker extends Component<any, any>{
  modalRef: Modal
  userPickerModal: Modal
  constructor(props: any) {
    super(props);
    this.state = {
      tag: this.props.tag ? this.props.tag : { val: "Public" },
      user: this.props.user && this.props.user._id !== null
        ? this.props.user
        : {
          id: Methods.you()._id,
          name: Methods.you().name,
          image: Methods.you().image,
          type: "F",
          user: Methods.you().username
        },
      filter: "",
      isPickingCrowd: false,
      isSelectingUser: false,
      tags: []
    }
  }

  whoToSeeIcons = () => {
    return [
      {
        key: "F",
        val: "Public",
        img: false,
        bg: ""
      }, {
        key: "F",
        val: "Friends",
        img: "http://supotsu.com/images/who_sees_friends.png",
        bg: ""
      },
      {
        key: "Q",
        val: "Groups",
        img: "http://supotsu.com/images/facebook-group.png",
        bg: "#58CC66",
        withPadding: true
      },
      {
        key: "T",
        val: "Teams",
        img: "http://supotsu.com/images/who_sees_game.png",
        bg: ""
      },
      {
        key: "C",
        val: "Clubs",
        img: "http://supotsu.com/images/club.png",
        bg: "#f43",
        withPadding: true
      },
      {
        key: "L",
        val: "Tournaments",
        img: "http://supotsu.com/images/who_sees_league.png",
        bg: ""
      },
      {
        key: "I",
        val: "Institutions",
        img: "http://supotsu.com/images/institution_icon.png",
        bg: "#888",
        withPadding: true
      }
    ]
  }

  renderWhoToSee = () => {
    const { location, navigation, NativeBase, MaterialIcons, SvgUri, isFab, Fab } = this.props;
    //const { Icon, Toast, Container, Header, Content } = NativeBase;
    const { isWhoToSee, post } = this.state;
    //const NBView = NativeBase.View;

    return (
      <WhoShouldSee {...this.props} activeIndex={this.state.activeWhoToSeeTabIndex} active={this.state.activeWhoToSeeTab} onCancel={() => {
        this.setState({ isWhoToSee: false });
      }} onAction={(audience = []) => {

        //console.log(audience)
        const cb = () => {
          this.setState({ isWhoToSee: false, audience });
        }
        cb()
      }} hasAction={true} actionBtnText={"DONE"} closeBtnText={"CANCEL"} animationType={"slide"} presentationStyle={'formSheet'} visible={isWhoToSee} />
    )
  }

  renderWhoToSeeIcons = () => {
    const { location, navigation, NativeBase, MaterialIcons, SvgUri, isFab, Fab } = this.props;
    //const { Icon, Toast } = NativeBase;
    const { isWhoToSeeContent } = this.state;
    const width = screen.mainScreen.widthDIPs;

    return (
      <gridLayout columns={getItemSpec(['*'])} style={{

      }}>
        <gridLayout columns={getItemSpec(['*', '*'])} col={0} style={{

        }} onTap={() => {
          this.setState({ isWhoToSeeContent: !isWhoToSeeContent });
        }}>
          <flexboxLayout col={0} style={{
            //marginRight: 10,
            marginLeft: isWhoToSeeContent ? (width < 340 ? 0 : 5) : 16,
            //flex: 1,
            alignItems: isWhoToSeeContent ? 'flex-start' : 'flex-end',
            justifyContent: 'center',
          }} onTap={() => {
            this.setState({ isWhoToSeeContent: !isWhoToSeeContent });
          }}>
            <label style={{
              color: new Color('#fff'),
              fontSize: isWhoToSeeContent ? 12 : 14,
            }} text={isWhoToSeeContent ? "CLOSE" : "Who should see this?"} />
          </flexboxLayout>
          <scrollView orientation={'horizontal'} col={1}>
            <stackLayout orientation={'horizontal'} style={{
              verticalAlignment: 'middle',
              horizontalAlignment: 'right',
              paddingRight: 10
            }}>
              <flexboxLayout style={{
                width: 35,
                height: 35,
                alignItems: 'center'
              }} onTap={() => {
                this.setState({ isWhoToSee: true, activeWhoToSeeTab: this.whoToSeeIcons()[1], activeWhoToSeeTabIndex: 0 });
              }}>
                <image height={35} borderRadius={35 / 2} width={35} src={this.whoToSeeIcons()[1].img} />
              </flexboxLayout>
              {isWhoToSeeContent &&
                this.whoToSeeIcons().map((icon, i) => {
                  if (i < 2) {
                    return null;
                  }

                  return (
                    <flexboxLayout key={icon.key} onTap={() => {
                      this.setState({ isWhoToSee: true, activeWhoToSeeTab: icon, activeWhoToSeeTabIndex: i });
                    }} style={{
                      width: 35,
                      height: 35,
                      alignItems: 'center',
                      marginLeft: width < 340 ? 7 : 10,
                      justifyContent: 'center',
                      background: icon.bg ? icon.bg : "transparent",
                      borderRadius: icon.withPadding ? 100 : 100
                    }}>
                      <image height={icon.withPadding ? 25 : 35} borderRadius={icon.withPadding ? 25 / 2 : 35 / 2} width={icon.withPadding ? 25 : 35} src={icon.img} />
                    </flexboxLayout>
                  )
                })
              }
            </stackLayout>
          </scrollView>
        </gridLayout>
      </gridLayout>
    )
  }

  getUsers = (tag = "F") => {
    let List = [];
    switch (tag) {
      case "F":
        List = Methods.listify(Methods.you().friends);
        break;
      case "Q":
        List = Methods.listify(Methods.you().groups);
        break;
      case "T":
        List = Methods.getTeams(Methods.you());
        break;
      case "C":
        List = Methods.listify(Methods.you().clubs);
        break;
      case "L":
        List = Methods.listify(Methods.you().leagues);
        break;
      case "I":
        List = Methods.listify(Methods.you().institutions);
        break;
      default:
        break;
    }

    return List.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  Holder = ({ children, isTop = false }) => {
    if (!isTop) {
      return (
        <React.Fragment>
          {children}
        </React.Fragment>
      )
    } else {
      return (
        <stackLayout style={{
          verticalAlignment: 'middle',
          horizontalAlignment: 'center'
        }}>
          {children}
        </stackLayout>
      )
    }
  }

  renderFancyModal = () => {
    const {
      tag,
      user,
      filter,
      isPickingCrowd,
      isSelectingUser
    } = this.state;
    const { MaterialIcons, SvgUri, isFirstName } = this.props;
    const username = (!user.name) ? "" : isFirstName ? user.name.split(" ")[0] : user.name;
    const width = screen.mainScreen.widthDIPs;
    const height = screen.mainScreen.heightDIPs;
    const _style = this.props.isTop ?
      {
        background: 'rgba(255,255,255, 0.999)',
        margin: `0 16`,
      } : {
        background: 'rgba(255,255,255, 0.999)',
        margin: `0 16`,
      }

    const _typeStyle = this.props.isTop ? {
      background: 'rgba(255,255,255, 0.999)',
      margin: `0 16`
    } : {
      background: 'rgba(255,255,255, 0.999)',
    }
    const render = () => {
      return (
        <stackLayout row={1} style={{ ..._typeStyle }}>
          {
            this.whoToSeeIcons().filter((tag) => {
              if (tag.val === "public") return true;
              const _list = this.getUsers(tag.key).filter((user) => {
                return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
              });
              return _list.length > 0 ? true : false
            }).map((tag, i) => {
              if (tag.val === "Friends") {
                return null;
              }
              return (
                <flexboxLayout key={i} style={{
                  height: 50,
                  borderTopColor: new Color('#eee'),
                  borderTopWidth: i === 0 ? 0 : 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: `0 10`
                }} onTap={() => {
                  this.setState({ tag, isPickingCrowd: false, isSelectingUser: (tag.val === "Public") ? false : true, user: (tag.val === "Public") ? (this.props.user && (this.props.user._id !== null && this.props.user._id !== Methods.you()._id) ? this.props.user : Methods.you()) : { id: null } }, () => {
                    if (this.props.onTagSelect) {
                      this.props.onTagSelect(tag)
                    }
                    if ((tag.val === "Public")) {
                      if (this.props.onUserSelect) {
                        this.props.onUserSelect(this.props.user)
                      }
                      if (this.modalRef) {
                        this.modalRef.closeCallback(true)
                      }
                    } else {
                      //Open Next Modal
                      this.renderFancyUserModal();
                    }
                  });
                }}>
                  {!tag.img &&
                    <label className={'MaterialIcons'} fontSize={30} text={IconSet.MaterialIcons['public']} style={{
                      color: new Color('#000'),
                      zIndex: 1
                    }} />
                  }
                  {tag.img && (
                    <flexboxLayout style={{
                      width: 30,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: tag.bg ? tag.bg : "transparent",
                      borderRadius: tag.withPadding ? 100 : 100,
                      //padding: tag.withPadding ? 2 : 0,
                      //backgroundColor: tag.withPadding ? tag.bg : "transparent"
                    }}>
                      <image width={tag.withPadding ? 20 : 30} height={tag.withPadding ? 20 : 30}
                        src={tag.img}
                        style={{
                          padding: tag.withPadding ? 2 : 0,
                          width: tag.withPadding ? 20 : 30,
                          height: tag.withPadding ? 20 : 30,
                          borderRadius: tag.withPadding ? 20 / 2 : 30 / 2,
                        }}
                      />
                    </flexboxLayout>
                  )}
                  <label style={{ marginLeft: 8 }} text={tag.val} />
                </flexboxLayout>
              )
            })
          }
        </stackLayout >
      )
    }

    const opt: ModalProps = {
      title: "",
      //onDoneTitle: 'DONE',
      size: ModalHeaderSize.mini,
      render,
      //actionBarHidden: true,
      ref: (ref) => {
        this.modalRef = ref;
      },
      onDoneButton: ModalActionButon.red,
      onClose: () => {
        this.setState({ isAdding: false });
      },
      onDone: () => {

      }
    }

    goToPageReact(Modal, opt, 'GoLivePublicityModal')
  }

  renderFancyUserModal = () => {
    const {
      tag,
      user,
      filter,
      isPickingCrowd,
      isSelectingUser
    } = this.state;
    const { MaterialIcons, SvgUri, isFirstName } = this.props;
    const username = (!user.name) ? "" : isFirstName ? user.name.split(" ")[0] : user.name;
    const width = screen.mainScreen.widthDIPs;
    const height = screen.mainScreen.heightDIPs;
    const _style = this.props.isTop ?
      {
        background: 'rgba(255,255,255, 0.999)',
        margin: `0 16`,
      } : {
        background: 'rgba(255,255,255, 0.999)',
        margin: `0 16`,
      }

    const _typeStyle = this.props.isTop ? {
      background: 'rgba(255,255,255, 0.999)',
      margin: `0 16`
    } : {
      background: 'rgba(255,255,255, 0.999)',
    }
    const render = () => {
      return (
        <gridLayout row={1} rows={getItemSpec(['*'])} style={_style}>
          <scrollView row={0} scrollBarIndicatorVisible={false}>
            <stackLayout padding={`10 0`}>
              {
                this.getUsers(tag.key).filter((user) => {
                  return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
                }).map((user, i) => {
                  return (
                    <flexboxLayout key={i} style={{
                      height: 50,
                      borderTopColor: new Color('#eee'),
                      borderTopWidth: i === 0 ? 0 : 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: `0 10`
                    }} onTap={() => {
                      this.setState({ user, isSelectingUser: false }, () => {
                        if (this.props.onUserSelect) {
                          user['type'] = tag.key;
                          this.props.onUserSelect(user)
                        }
                        if (this.userPickerModal) {
                          this.userPickerModal.closeCallback(true)
                        }
                      });
                    }}>
                      <flexboxLayout style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35 / 2,
                      }}>
                        <image width={35} height={35}
                          src={user.image}
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 35 / 2,
                          }}
                        />
                      </flexboxLayout>
                      <label style={{ marginLeft: 5 }} text={user.name} />
                    </flexboxLayout>
                  )
                })
              }
              {this.getUsers(tag.key).filter((user) => {
                return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
              }).length === 0 &&
                <Empty text="No Users Found" />
              }
            </stackLayout>
          </scrollView>
        </gridLayout>
      )
    }
    const opt: ModalProps = {
      title: "Select Profile",
      onDoneTitle: 'DONE',
      size: ModalHeaderSize.mini,
      render,
      //actionBarHidden: true,
      ref: (ref) => {
        this.userPickerModal = ref;
        setTimeout(() => {
          if (this.modalRef) {
            this.modalRef.closeCallback(true)
          }
        }, 500)
      },
      onDoneButton: ModalActionButon.red,
      onClose: () => {
        this.setState({ isAdding: false });
      },
      onDone: () => {

      }
    }

    goToPageReact(Modal, opt, 'GoLiveUserModal')
  }

  render = () => {
    const {
      tag,
      user,
      filter,
      isPickingCrowd,
      isSelectingUser
    } = this.state;
    const { MaterialIcons, SvgUri, isFirstName } = this.props;
    const username = (!user.name) ? "" : isFirstName ? user.name.split(" ")[0] : user.name;
    const width = screen.mainScreen.widthDIPs;
    const height = screen.mainScreen.heightDIPs;
    const _style = this.props.isTop ?
      {
        background: 'rgba(255,255,255, 0.999)',
        margin: `0 16`,
      } : {
        background: 'rgba(255,255,255, 0.999)',
        margin: `0 16`,
      }

    const _typeStyle = this.props.isTop ? {
      background: 'rgba(255,255,255, 0.999)',
      margin: `0 16`
    } : {
      background: 'rgba(255,255,255, 0.999)',
    }

    return (
      <React.Fragment>
        <gridLayout columns={getItemSpec(['auto', '*'])} style={{ marginRight: 16 }}>
          <gridLayout columns={getItemSpec(['auto', '*'])} col={0} style={{
            padding: `5 10`,
            borderRadius: 100,
            background: 'rgba(0,0,0,.6)',
            flexDirection: 'row',
            alignItems: 'center'
          }} onTap={() => {
            this.setState({ isPickingCrowd: true, isSelectingUser: false }, () => {
              this.renderFancyModal()
              if (this.props.onPickerFocus) {
                this.props.onPickerFocus()
              }
            });
          }}>
            {!tag.img &&
              <label col={0} className={'MaterialIcons'} fontSize={25} text={IconSet.MaterialIcons['public']} style={{
                color: new Color('#fff'),
                zIndex: 1
              }} />
            }
            {tag.img && (
              <image col={0} borderRadius={tag.withPadding ? 25 / 2 : 25 / 2}
                src={tag.img}
                style={{
                  width: tag.withPadding ? 25 : 25,
                  height: tag.withPadding ? 25 : 25
                }}
              />
            )}
            <label col={1} style={{ color: new Color("#fff"), marginLeft: 5, marginRight: 5, verticalAlignment: 'middle' }} text={tag.val} />
          </gridLayout>

          <flexboxLayout col={1} style={{
            padding: `5 10`,
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center'
          }} onTap={() => {
            if (user._id !== null) {
              if (this.props.onUserClick) {
                this.props.onUserClick()
              }
            }
          }}>
            {user._id === null && (
              <gridLayout columns={getItemSpec(['auto', '*'])}>
                <label className={'MaterialIcons'} fontSize={25} text={IconSet.MaterialIcons['search']} style={{
                  color: new Color('#fff'),
                  zIndex: 1,
                  marginRight: 10
                }} />
                <textField
                  hint={"Broadcast as ...."}
                  text={filter}
                  style={{
                    color: new Color('#fff')
                  }}
                  borderBottomWidth={0}
                  onTextChange={(args: any) => {
                    this.setState({
                      filter: args.object.text,
                      isPickingCrowd: false
                    });
                  }}
                />
              </gridLayout>
            )}
            {user._id !== null && (
              <gridLayout columns={getItemSpec(['auto', '*'])}>
                <image
                  src={user.image}
                  stretch="fill"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2
                  }}
                />
                <label col={1} style={{ color: new Color(this.props.textColor || "#fff"), marginLeft: 5, verticalAlignment: 'middle' }} text={username} />
              </gridLayout>
            )}
          </flexboxLayout>
        </gridLayout>
      </React.Fragment>
    );
  }
}

export class WhoShouldSeeTapPopUp extends React.Component<{
  onItemTap(tag: any, i: number): void,
  onAction(data: any[], sport?: any): void
} & any, any> {
  private readonly overlay: React.RefObject<NSVElement<StackLayout>> = React.createRef<NSVElement<StackLayout>>();
  modalRef: Modal;
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      index: 10,
      sport: { _id: null }
    }
  }

  onLoaded = (args: EventData) => {
    const root = getRoot();
    const view = args.object as StackLayout;
  }

  getUsers = (tag = "F") => {
    let List = [];
    switch (tag) {
      case "F":
        List = [Methods.you(), ...Methods.listify(Methods.you().friends)];
        break;
      case "Q":
        List = Methods.listify(Methods.you().groups);
        break;
      case "T":
        List = Methods.getTeams(Methods.you());
        break;
      case "C":
        List = Methods.listify(Methods.you().clubs);
        break;
      case "L":
        List = Methods.listify(Methods.you().leagues);
        break;
      case "I":
        List = Methods.listify(Methods.you().institutions);
        break;
      default:
        break;
    }

    return List.sort((a, b) => (a.name > b.name) ? 1 : -1);
  }

  getRows = () => {
    const { isActive, index } = this.state;
    let items;
    switch (index) {
      case 0:
        items = getItemSpec(['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'])
        break;
      case 1:
        items = getItemSpec(['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'])
        break;
      case 2:
        items = getItemSpec(['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'])
        break;
      case 3:
        items = getItemSpec(['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'])
        break;
      case 4:
        items = getItemSpec(['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto'])
        break;
      case 0:
        items = getItemSpec(['auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto'])
        break;
      default:
        items = getItemSpec(['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'])
        break;
    }

    return items;
  }

  open = () => {
    if (this.state.isActive) {
      return;
    }
  }

  Content = ({ open, close }: {
    open(): void;
    close(): void;
  }) => {
    const [index, setIndex] = useState(10);
    const [filter, setFilter] = useState("");
    const [users, setUsers] = useState(this.props.users || [])
    const { MaterialIcons, SvgUri, isFirstName, sport: initSport = (Methods.you().sportsFollowed && Methods.you().sportsFollowed[0] ? Methods.you().sportsFollowed[0] : {}), requestSport = false, onItemTap, onUserTap, onAction, showIconInstead = false } = this.props;
    const [isNew, setIsNew] = useState(true);
    const [active, setActive] = useState(requestSport ? 'sport' : 'F')

    const [sport, setSport] = useState(initSport._id ? initSport : (Methods.you().sportsFollowed && Methods.you().sportsFollowed[0] ? Methods.you().sportsFollowed[0] : {}));

    console.log(Methods.you().sportsFollowed)

    const getRows = () => {
      let items;
      switch (index) {
        case 0:
          items = getItemSpec(['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'])
          break;
        case 1:
          items = getItemSpec(['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'])
          break;
        case 2:
          items = getItemSpec(['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'])
          break;
        case 3:
          items = getItemSpec(['auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'])
          break;
        case 4:
          items = getItemSpec(['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto'])
          break;
        case 0:
          items = getItemSpec(['auto', 'auto', 'auto', 'auto', 'auto', '*', 'auto'])
          break;
        default:
          items = getItemSpec(['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'])
          break;
      }

      return items;
    }

    const _typeStyle = this.props.isTop ? {
      background: 'rgba(255,255,255, 0.999)',
      margin: `0 16`
    } : {
      background: 'rgba(255,255,255, 0.999)',
    };

    if (isNew) {
      const activeStyle = {
        //borderColor: '#345',
        borderWidth: 2
      };
      return (
        <gridLayout rows={getItemSpec(['auto', '*'])}>
          <scrollView scrollBarIndicatorVisible={false} background={Theme['500']} orientation={'horizontal'} height={58} row={0}>
            <stackLayout paddingLeft={16} orientation={'horizontal'}>
              {requestSport && sport._id &&
                <flexboxLayout className={active === 'sport' ? 'active-border' : ''} style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30 / 2,
                  marginRight: 16,
                  alignItems: 'center',
                  background: '#fff',
                  borderColor: '#000',
                  justifyContent: 'center'
                }} onTap={() => {
                  setActive('sport')
                }}>
                  <image style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30 / 2,
                  }} stretch={'aspectFill'} src={`https://supotsu.com/${sport.image.replace("_wht.svg", "_drk.png")}`} />
                </flexboxLayout>
              }
              {
                Methods.whoToSeeIcons().filter((tag, i) => {
                  const _list = this.getUsers(tag.key).filter((user) => {
                    return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
                  });

                  return _list.length > 0 ? true : false;
                }).map((tag, i) => {
                  const onTap = () => {
                    setActive(tag.key)
                  }
                  if (!tag.img) {
                    return (
                      <label key={i} onTap={onTap} className={active === tag.key ? 'MaterialIcons active-border' : 'MaterialIcons'} fontSize={30} text={IconSet.MaterialIcons['public']} style={{
                        color: new Color('#000'),
                        zIndex: 1,
                        ...active === tag.key ? { ...activeStyle } : {}
                      }} />
                    )
                  }
                  else if (tag.img) {
                    return (
                      <flexboxLayout className={active === tag.key ? 'active-border' : ''} key={i} onTap={onTap} style={{
                        width: 30,
                        height: 30,
                        marginRight: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: tag.bg ? tag.bg : "transparent",
                        borderRadius: tag.withPadding ? 100 : 100,
                        ...active === tag.key ? { ...activeStyle } : {}
                        //padding: tag.withPadding ? 2 : 0,
                        //backgroundColor: tag.withPadding ? tag.bg : "transparent"
                      }}>
                        <image width={tag.withPadding ? 20 : 30} height={tag.withPadding ? 20 : 30}
                          src={tag.img}
                          style={{
                            padding: tag.withPadding ? 2 : 0,
                            width: tag.withPadding ? 20 : 30,
                            height: tag.withPadding ? 20 : 30,
                            borderRadius: tag.withPadding ? 20 / 2 : 30 / 2,
                          }}
                        />
                      </flexboxLayout>
                    )
                  }
                })
              }
            </stackLayout>
          </scrollView>
          {
            Methods.whoToSeeIcons().filter((tag, i) => {
              const _list = this.getUsers(tag.key).filter((user) => {
                return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
              });

              return _list.length > 0 ? true : false;
            }).map((tag, i) => {
              return (
                <scrollView key={tag.key} visibility={active === tag.key ? 'visible' : 'hidden'} row={1} scrollBarIndicatorVisible={false}>
                  <stackLayout padding={`0 0`}>
                    {
                      this.getUsers(tag.key).filter((user) => {
                        return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
                      }).map((user, i) => {
                        const isSet = users.map((item) => item._id).includes(user._id)
                        return (
                          <gridLayout columns={getItemSpec(['auto', '*', 'auto'])} key={i} style={{
                            height: 50,
                            borderTopColor: new Color('#eee'),
                            borderTopWidth: i === 0 ? 0 : 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: `0 16`
                          }} onTap={() => {
                            if (this.props.single) {
                              if (typeof onItemTap === "function") {
                                onItemTap(tag, i)
                              }
                              if (typeof onUserTap === "function") {
                                onUserTap(user)
                              }
                              if (this.modalRef) {
                                this.modalRef.closeCallback(true)
                              }
                            } else {
                              const cb = () => {
                                setTimeout(() => {
                                  if (onAction && typeof onAction === "function") onAction(users, sport)
                                }, 250)
                              }
                              if (isSet) {
                                const users_ = users.filter((_item) => {
                                  return _item._id !== user._id// && _item.type !== user.type
                                })
                                setUsers([...users_]);
                                cb()
                              } else {
                                setUsers([...users, ...[user]])
                                cb();
                              }

                            }
                          }}>
                            <flexboxLayout col={0} style={{
                              width: 30,
                              height: 30,
                              borderRadius: 30 / 2,
                            }}>
                              <image width={30} height={30}
                                src={user.image}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30 / 2,
                                }}
                              />
                            </flexboxLayout>
                            <label col={1} style={{ marginLeft: 5, verticalAlignment: 'middle', }} text={user.name} />
                            {isSet && !showIconInstead &&
                              <label col={2} text={IconSet.MaterialIcons["done"]} className={"MaterialIcons"} style={{
                                color: new Color(Theme2['500']),
                                fontSize: 25,
                                verticalAlignment: 'middle',
                                margin: `0 10`
                              }} />
                            }
                          </gridLayout>
                        )
                      })
                    }
                    {this.getUsers(tag.key).filter((user) => {
                      return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
                    }).length === 0 &&
                      <Empty text="No Users Found" />
                    }
                  </stackLayout>
                </scrollView>
              )
            })
          }
          {requestSport && Methods.listify(Methods.you().sportsFollowed).length > 0 &&
            <scrollView visibility={active === 'sport' ? 'visible' : 'hidden'} row={1} scrollBarIndicatorVisible={false}>
              <stackLayout padding={`0 0`}>
                {
                  Methods.listify(Methods.you().sportsFollowed).map((sport_, i) => {
                    const _name = sport_.image.split("/")[1];
                    const _icon = Methods.nullify(_name).replace(".svg", "");

                    const source = `https://supotsu.com/${sport_.image.replace("_wht.svg", "_drk.png")}`;
                    return (
                      <gridLayout columns={getItemSpec(['auto', '*', 'auto'])} key={i} style={{
                        height: 50,
                        borderTopColor: new Color('#eee'),
                        borderTopWidth: i === 0 ? 0 : 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: `0 16`
                      }} onTap={() => {
                        const cb = () => {
                          setSport(sport_)
                        }
                        cb();
                      }}>
                        <flexboxLayout col={0} style={{
                          width: 40,
                          height: 40,
                          borderRadius: 40 / 2,
                        }}>
                          <image width={40} height={40}
                            src={source}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 40 / 2,
                            }}
                          />
                        </flexboxLayout>
                        <label col={1} style={{ marginLeft: 5, verticalAlignment: 'middle', }} text={sport_.name} />
                        {sport._id === sport_._id && !showIconInstead &&
                          <label col={2} text={IconSet.MaterialIcons["done"]} className={"MaterialIcons"} style={{
                            color: new Color(Theme2['500']),
                            fontSize: 25,
                            verticalAlignment: 'middle',
                            margin: `0 10`
                          }} />
                        }
                      </gridLayout>
                    )
                  })
                }
              </stackLayout>
            </scrollView>
          }
        </gridLayout>
      )
    }
    return (
      <gridLayout rows={getItemSpec(['auto', '*'])}>
        {requestSport && Methods.listify(Methods.you().sportsFollowed).length > 0 &&
          <scrollView orientation={'horizontal'} row={0}>
            <stackLayout verticalAlignment={'middle'} padding={16} orientation={'horizontal'} >
              {
                Methods.listify(Methods.you().sportsFollowed).map((sport_, i) => {
                  const _name = sport_.image.split("/")[1];
                  const _icon = Methods.nullify(_name).replace(".svg", "");

                  const source = sport._id === sport_._id ? `https://supotsu.com/${sport_.image.replace("_wht.svg", ".png")}` : `https://supotsu.com/${sport_.image.replace("_wht.svg", "_drk.png")}`

                  return (
                    <flexboxLayout key={i} style={{
                      width: 35,
                      height: 35,
                      borderRadius: 35 / 2,
                      marginRight: 10,
                      alignItems: 'center',
                      background: sport._id === sport_._id ? Theme2['500'] : Theme['500'],
                      borderColor: sport._id === sport_._id ? Theme2['500'] : '#000',
                      justifyContent: 'center'
                    }} onTap={() => {
                      const cb = () => {
                        setSport(sport_)
                      }
                      cb();
                    }}>
                      <image style={{
                        width: 30,
                        height: 30
                      }} stretch={'aspectFill'} src={source} />
                    </flexboxLayout>
                  )
                })
              }
            </stackLayout>
          </scrollView>
        }
        <gridLayout key={`active-${index}`} rows={getRows()} row={1} style={{ ..._typeStyle }}>
          {
            Methods.whoToSeeIcons().filter((tag, i) => {
              const _list = this.getUsers(tag.key).filter((user) => {
                return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
              });

              return _list.length > 0 ? true : false;
            }).map((tag, i) => {
              return (
                <gridLayout row={i} rows={getItemSpec(['auto', '*'])}>
                  <flexboxLayout row={0} key={i} style={{
                    height: 50,
                    ...(index !== 10 && index !== i) ? {
                      background: '#eee'
                    } : index === i ? {
                      background: Theme2['500']
                    } : {},
                    borderTopColor: index === i ? new Color(Theme2['500']) : new Color('#eee'),
                    borderTopWidth: index === i ? 1 : i === 0 ? 0 : 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: `0 10`
                  }} onTap={() => {
                    if (this.props.single && this.props.noUser) {
                      if (typeof onItemTap === "function") {
                        onItemTap(tag, i)
                      }
                      if (this.modalRef) {
                        this.modalRef.closeCallback(true)
                      }
                    } else {
                      if (index === i) {
                        setIndex(10)
                      } else {
                        setIndex(i)
                      }
                    }
                    console.log('dddd', i)
                  }}>
                    {!tag.img &&
                      <label className={'MaterialIcons'} fontSize={30} text={IconSet.MaterialIcons['public']} style={{
                        color: index === i ? new Color('white') : new Color('#000'),
                        zIndex: 1
                      }} />
                    }
                    {tag.img && (
                      <flexboxLayout style={{
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: tag.bg ? tag.bg : "transparent",
                        borderRadius: tag.withPadding ? 100 : 100,
                        //padding: tag.withPadding ? 2 : 0,
                        //backgroundColor: tag.withPadding ? tag.bg : "transparent"
                      }}>
                        <image width={tag.withPadding ? 20 : 30} height={tag.withPadding ? 20 : 30}
                          src={tag.img}
                          style={{
                            padding: tag.withPadding ? 2 : 0,
                            width: tag.withPadding ? 20 : 30,
                            height: tag.withPadding ? 20 : 30,
                            borderRadius: tag.withPadding ? 20 / 2 : 30 / 2,
                          }}
                        />
                      </flexboxLayout>
                    )}
                    <label style={{ marginLeft: 8 }} text={tag.val} />
                  </flexboxLayout>
                  {index === i &&
                    <scrollView row={1} scrollBarIndicatorVisible={false}>
                      <stackLayout padding={`0 0`}>
                        {
                          this.getUsers(tag.key).filter((user) => {
                            return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
                          }).map((user, i) => {
                            const isSet = users.map((item) => item._id).includes(user._id)
                            return (
                              <gridLayout columns={getItemSpec(['auto', '*', 'auto'])} key={i} style={{
                                height: 50,
                                borderTopColor: new Color('#eee'),
                                borderTopWidth: i === 0 ? 0 : 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: `0 10`
                              }} onTap={() => {
                                if (this.props.single) {
                                  if (typeof onItemTap === "function") {
                                    onItemTap(tag, i)
                                  }
                                  if (typeof onUserTap === "function") {
                                    onUserTap(user)
                                  }
                                  if (this.modalRef) {
                                    this.modalRef.closeCallback(true)
                                  }
                                } else {
                                  const cb = () => {
                                    setTimeout(() => {
                                      if (onAction && typeof onAction === "function") onAction(users, sport)
                                    }, 250)
                                  }
                                  if (isSet) {
                                    const users_ = users.filter((_item) => {
                                      return _item._id !== user._id// && _item.type !== user.type
                                    })
                                    setUsers([...users_]);
                                    cb()
                                  } else {
                                    setUsers([...users, ...[user]])
                                    cb();
                                  }

                                }
                              }}>
                                <flexboxLayout col={0} style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30 / 2,
                                }}>
                                  <image width={30} height={30}
                                    src={user.image}
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 30 / 2,
                                    }}
                                  />
                                </flexboxLayout>
                                <label col={1} style={{ marginLeft: 5, verticalAlignment: 'middle', }} text={user.name} />
                                {isSet && !showIconInstead &&
                                  <label col={2} text={IconSet.MaterialIcons["done"]} className={"MaterialIcons"} style={{
                                    color: new Color(Theme2['500']),
                                    fontSize: 25,
                                    verticalAlignment: 'middle',
                                    margin: `0 10`
                                  }} />
                                }
                              </gridLayout>
                            )
                          })
                        }
                        {this.getUsers(tag.key).filter((user) => {
                          return Methods.nullify(user.name).toLowerCase().indexOf(filter.toLowerCase()) > -1;
                        }).length === 0 &&
                          <Empty text="No Users Found" />
                        }
                      </stackLayout>
                    </scrollView>
                  }
                </gridLayout>
              )
            })
          }
        </gridLayout>
      </gridLayout>
    )
  }

  render = () => {
    const { isActive, sport } = this.state;
    const { TriggerButton, col, row, MaterialIcons, SvgUri, isFirstName, sport: initSport = (Methods.you().sportsFollowed && Methods.you().sportsFollowed[0] ? Methods.you().sportsFollowed[0] : {}), requestSport = false, onItemTap, onUserTap, onAction, showIconInstead = false } = this.props;

    return (
      <NativeModal
        fullscreen
        renderTriggerAction={(ref, open) => {
          return (
            <React.Fragment>
              {TriggerButton &&
                <TriggerButton label={isActive ? "CLOSE" : false} onTap={() => {
                  open();
                }} />
              }
              {row && isActive &&
                <stackLayout ref={this.overlay} height={screen.mainScreen.heightDIPs} background={'red'} width={screen.mainScreen.widthDIPs}>
                  {this.props.children}
                </stackLayout>
              }
            </React.Fragment>
          )
        }}
        renderContent={(open, close, isModalOpen) => {
          return (
            <gridLayout width="100%" rows={getItemSpec(['auto', 'auto', '*'])}>
              <CommonHeader user={{
                name: 'Select Audience'
              }}
                goBack={close}
              />
              {requestSport && Methods.listify(Methods.you().sportsFollowed).length > 0 &&
                <scrollView orientation={'horizontal'} row={1}>
                  <stackLayout verticalAlignment={'middle'} padding={16} orientation={'horizontal'} >
                    {
                      Methods.listify(Methods.you().sportsFollowed).map((sport_, i) => {
                        const _name = sport_.image.split("/")[1];
                        const _icon = Methods.nullify(_name).replace(".svg", "");

                        const source = sport._id === sport_._id ? `https://supotsu.com/${sport_.image.replace("_wht.svg", ".png")}` : `https://supotsu.com/${sport_.image.replace("_wht.svg", "_drk.png")}`

                        return (
                          <flexboxLayout key={i} style={{
                            width: 35,
                            height: 35,
                            borderRadius: 35 / 2,
                            marginRight: 10,
                            alignItems: 'center',
                            background: sport._id === sport_._id ? Theme2['500'] : Theme['500'],
                            borderColor: sport._id === sport_._id ? Theme2['500'] : '#000',
                            justifyContent: 'center'
                          }} onTap={() => {
                            const cb = () => {
                              this.setState({
                                sport: sport_,
                              })
                            }
                            cb();
                          }}>
                            <image style={{
                              width: 30,
                              height: 30
                            }} stretch={'aspectFill'} src={source} />
                          </flexboxLayout>
                        )
                      })
                    }
                  </stackLayout>
                </scrollView>
              }
            </gridLayout>
          )
        }}
      />
    )
  }
}

export class MediaUploads {

}

export interface CameraRollProps {
  onDone?(media: CameraRollCallback): void
  ref?(ref: CameraRoll): void
}

const CameraRollContent = React.createContext<any>({});

export enum CameraRollFileType {
  video = "video",
  image = "image",
  other = "other"
}

export interface CameraRollFile {
  isIcon?: boolean
  file?: File,
  src?: string
  type?: CameraRollFileType,
  date?: number
}

export interface CameraRollCallbackSession {
  session: Session
  name: string
}

export interface CameraRollCallback {
  file: File
  isApp: true
  objType: string
  progress: number
  url: string
  session: CameraRollCallbackSession
}

export class CameraRoll extends Component<CameraRollProps & any, {
  photoRoll: CameraRollFile[],
  filesToUpload: CameraRollFile[],
  photos: CameraRollCallback[]
} & any> {
  constructor(props) {
    super(props);
    const extraPhotos = Methods.getMedia().filter((item) => {
      if (props.pickerType === "all") {
        return true
      } else if (props.pickerType.toLowerCase() === "photos") {
        return item.type === CameraRollFileType.image
      } else {
        return item.type === CameraRollFileType.video
      }
    })//.filter((item, i)=>i<26)
    this.state = {
      photos: [
        { url: false, file: { name: null, id: null }, caption: '' }
      ],
      loc: '',
      tags: [],
      mobile: [],
      isSingle: props.isSingle ? true : false,
      type: props.pickerType,
      selected: [],
      canDisplayCam: false,
      canDisplayGal: false,
      isUploading: false,
      showCamera: this.props.isCameraOnly ? true : false,
      inputKey: Date.now(),
      uploadedFiles: [],
      errors: [],
      photoRoll: [
        { isIcon: true },
        ...extraPhotos
      ],
      filesToUpload: [
        {
          isIcon: true
        }
      ]
    }
  }

  getPhotoList = (): CameraRollCallback[] => {
    return this.state.photos.filter((item, i) => {
      if (!item.url) return false;
      return true;
    });
  }

  componentWillMount = () => {
    const _that = this;
    const { onAction, Permissions, onCancel, visible, actionBtnText, closeBtnText, onRequestClose, user, SvgUri, MaterialIcon, CameraKitCamera, CameraKitCameraScreen, CameraKitGallery, CameraKitGalleryView } = this.props;

    if (this.props.isCameraOnly && this.props.isChat) {
      //this.openPicker()
      //alert('aaa')
    }

    if (!this.props.isCameraOnly && this.props.isChat) {
      //alert('aaa')
      //this.openPicker()
    }

    const { filesToUpload, photos } = this.state;
    const { newFile } = this.props;

    if (newFile) {
      filesToUpload.push(newFile)

      photos.push(newFile)

      _that.setState({
        filesToUpload,
        photos,
        activeChatIndex: 1
      }, () => {

      });
    }

    this.getGalleryPerms()
  }

  componentDidMount = () => {
    const _that = this;
    const { onAction, onCancel, visible, actionBtnText, closeBtnText, onRequestClose, user, SvgUri, MaterialIcon, CameraKitCamera, CameraKitCameraScreen, CameraKitGallery, CameraKitGalleryView } = this.props;
    if (this.props.onRef && typeof this.props.onRef === "function") {
      this.props.onRef(this);
    }
  }

  requestPermission = () => {
    if (hasFilePermissions) {
      this.setState({
        canDisplayGal: true
      }, () => {
        this.getPhotos()
      })
    } else {
      console.log('sksksk')
      if (!hasFilePermissions) {
        requestFilePermissions().then((hasPermission) => {
          if (hasPermission) {
            AppSettings.setBoolean('withFiles', true);
            this.setState({
              canDisplayGal: true
            }, () => {
              this.getPhotos()
            })
          } else {
            AppSettings.setBoolean('withFiles', false)
          }
        });
      }
    }
  }

  getGalleryPerms = () => {
    if (hasFilePermissions) {
      this.setState({
        canDisplayGal: true
      }, () => {
        this.getPhotos()
      })
    }
  }

  getPhotos = async () => {
    return;
    const _that = this;
    const { photoRoll } = _that.state;
    const exts = [".jpeg", ".jpg", ".png", ".gif", '.mp4', '.mov', '.mpg', '.flv', '.3gp', '.wmv', '.flv', '.avi'];
    const imgs = [".jpeg", ".jpg", ".png", ".gif"];
    const vids = ['.mp4', '.mov', '.mpg', '.flv', '.3gp', '.wmv', '.flv', '.avi'];

    const testArr = this.state.type.toLowerCase() === "all" ? exts : this.state.type.toLowerCase() === "photos" ? imgs : vids;
    // const files: File[] = [];
    if (isAndroid) {
      // @ts-ignore
      const androidPicturesPath = `${android.os.Environment.getExternalStoragePublicDirectory(
        // @ts-ignore
        android.os.Environment.DIRECTORY_DCIM
      ).toString()}/Camera`;

      const folder = Folder.fromPath(androidPicturesPath);
      const entities: FileSystemEntity[] = await folder.getEntities();
      if (entities) {

        const files = entities.filter((item, i) => {
          return File.exists(item.path) && testArr.includes(File.fromPath(item.path).extension)
        });

        const finalFiles: CameraRollFile[] = files.map((item) => {
          return {
            file: File.fromPath(item.path),
            src: `file://${item.path}`,
            date: item.lastModified.getTime(),
            isIcon: false,
            type: imgs.includes(File.fromPath(item.path).extension) ? CameraRollFileType.image : vids.includes(File.fromPath(item.path).extension) ? CameraRollFileType.video : CameraRollFileType.other
          }
        });

        //console.log(finalFiles);

        this.setState({
          photoRoll: [
            ...photoRoll,
            ...finalFiles.filter((item, i) => {
              return i < 26
            })
          ]
        })
      }
    }
  }

  onAction = (index = 1) => {
    if (index >= this.state.photos.length) {
      //alert("Done!");
      this.setState({ isUploading: false });
      const cb = () => {
        if (this.props.onAction) {
          if (this.state.uploadedFiles.length === 0) {
            Methods.alert("Files not uploaded")
            return
          };
          this.props.onAction(this.state.uploadedFiles);
        }
      }
      setTimeout(cb, 1600);
      return;
    }

    this.uploadFile(this.state.photos[index], index, (index === this.state.photos.length - 1 ? true : false));
    this.setState({ isUploading: true, index });
  }

  uploadFile = (file, index = 1, isLast = false) => {
    //console.log(file)
    const { errors } = this.state;
    const nextIndex = index + 1;
    const cb = () => {
      this.onAction(nextIndex);
    }

    //setTimeout(cb, 4000);

    if (!file.url) {
      cb();
      return;
    }

    var formdata = new FormData();
    const _that = this;
    let tags = "";
    Methods.listify(this.state.tags).forEach(tag => {
      tags += tag._id + "^F,";
    });

    for (let i = 0; i < this.state.tags.length; i++) {
      const tag = this.state.tags[i];
      if (i === this.state.tags.length - 1) {
        tags += tag._id + "^F";
      } else {
        tags += tag._id + "^F,";
      }
    }

    formdata.append("file", file.file);
    formdata.append("location", this.state.loc);
    formdata.append("albumId", "");
    formdata.append("tags", JSON.stringify(this.state.tags));

    formdata.append("objType", this.props.fileType ? this.props.fileType : "profile");

    formdata.append("fromId", Methods.you()._id);
    formdata.append("fromType", Methods.you().type);
    formdata.append("toId", this.props.user._id);
    formdata.append("toType", this.props.user.type);


    const url = "https://supotsu.com/api/file/upload"// + this.props.postToType + "&userId=" + this.props.postToId;

    const _url = this.props.url + "&type=" + this.props.toType + "&caption=";

    /*fetch(url, {
        method: 'post',
        body: formdata,
    },(progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        file.progress = progress;
        _that.state.photos[index] = file;
        _that.setState({ photos: _that.state.photos });
      }).then(res => res.json()).then(data => {
        if (data._id) {
            data.oldUrl = file.url;
            _that.state.uploadedFiles.push(data);
            this.setState({ uploadedFiles: _that.state.uploadedFiles, data });
            cb();
        } else if(data.error){
            errors.push(data);
            this.setState({ errors, data });
        }
    }).catch((err) => {
        errors.push(err);
        this.setState({ errors });
    });

    */
  }

  renderCamera = () => {
    return (
      <gridLayout />
    )
  }

  openPicker = () => {
    const { filesToUpload, photos } = this.state;
    const _that = this;
    const cb = (response: { didCancel: any; error: any; customButton: any; uri: any; type: any; fileName: any; }) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        alert('ImagePicker Error: ' + response.error);
        if (this.props.isCameraOnly) {
          this.props.onCancel()
        }
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const file = {
          uri: response.uri,
          type: response.type,
          name: response.fileName
        };

        const newFile = {
          file: file,
          progress: 0,
          caption: '',
          _id: Methods.uniqid(),
          url: response.uri
        }

        filesToUpload.push(newFile)

        photos.push(newFile)

        _that.setState({
          filesToUpload,
          photos
        }, () => {

        });
      }
    }

    if (this.props.isCameraOnly) {

    } else {

    }
  }

  renderPermitRequest = () => {
    return (
      <AllowAccessView methods={Methods} feature={'photo'} Permissions={this.props.Permissions} isShown={!this.state.canDisplayGal} onCancel={this.props.onCancel} onRequest={() => {
        this.requestPermission()
      }} title={"Please allow access Photo Libray and Camera"} subtitle={"To share videos or photos, this app needs to access your device photo libray and camera"} />
    )
  }

  renderAndroidGallery = () => {
    const { photos, mobile, selected, canDisplayCam, canDisplayGal, photoRoll, isSingle } = this.state;
    const dum = Methods.arrayChunks(photoRoll, 4);
    const rows = dum.map((item, i) => {
      return 'auto'
    });

    return (
      <$ListView
        row={0}
        items={dum}
        separatorColor={new Color('#000')}
        cellFactory={(item: any) => {
          const { widthPixels } = screen.mainScreen;
          const widthOf = widthPixels / 8 - 2;
          return (
            <stackLayout orientation={'horizontal'} padding={0} height={widthOf}>
              {
                item.map((_item: CameraRollFile, index) => {
                  const photo = _item;
                  const __photos = photos.filter((item, i) => {
                    return item.url === photo.src;
                  });
                  const inPhotos = __photos.length === 0 ? false : true;
                  const _indexOf = photos.findIndex((item, i) => {
                    return item.url === photo.src;
                  });

                  return (
                    <flexboxLayout padding={0} height={widthOf} width={widthOf} style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: inPhotos ? 5 : 0,
                      borderColor: new Color('#4ac')
                    }} key={index} background={_item.isIcon ? '#fff' : '#eee'} onTap={() => {
                      if (photo.isIcon) {
                        return;
                      }

                      if (isSingle) {
                        const newFile: CameraRollCallback = {
                          file: photo.file,
                          isApp: true,
                          objType: this.props.fileType || "profile",
                          progress: 0,
                          url: photo.src,
                          session: {
                            session: session(`${photo.src}:${index}`),
                            name: `${photo.src}:${index}`
                          }
                        }


                        const _photos = [
                          { url: false, file: { name: null, id: null } },
                          newFile
                        ]

                        this.setState({ photos: _photos });
                      } else {
                        if (inPhotos) {
                          const _photos_ = photos.filter((item, i) => {
                            return item.url !== photo.src;
                          });

                          this.setState({ photos: _photos_ });
                        } else {
                          const newFile: CameraRollCallback = {
                            file: photo.file,
                            isApp: true,
                            objType: this.props.fileType || "profile",
                            progress: 0,
                            url: photo.src,
                            session: {
                              session: session(`${photo.src}:${index}`),
                              name: `${photo.src}:${index}`
                            }
                          }

                          photos.push(newFile);

                          this.setState({ photos });
                        }
                      }
                    }}>
                      {_item.isIcon &&
                        <label className={'MaterialIcons size50'} color={new Color('#ddd')} text={`${IconSet.MaterialIcons["camera-alt"]}`} />
                      }
                      {_item.type === CameraRollFileType.image &&
                        <image decodeHeight={100} decodeWidth={100} stretch={'aspectFill'} loadMode={'async'} width={widthOf} height={widthOf} src={_item.src} />
                      }
                    </flexboxLayout>
                  )
                })
              }
            </stackLayout>
          )
        }}
      />
    )

    //console.log(dum[0], dum[1]);

    return (
      <scrollView row={0}>
        <stackLayout>
          <gridLayout padding={2} rows={getItemSpec(rows)} >
            {
              dum.map((item, i) => {
                const { widthPixels } = screen.mainScreen;
                const widthOf = widthPixels / 8 - 2;
                return (
                  <gridLayout key={i} row={i} height={widthOf} marginBottom={2} columns={getItemSpec(['*', '*', '*', '*'])}>
                    {
                      item.map((_item: CameraRollFile, index) => {
                        const photo = _item;
                        const __photos = photos.filter((item, i) => {
                          return item.url === photo.src;
                        });
                        const inPhotos = __photos.length === 0 ? false : true;
                        const _indexOf = photos.findIndex((item, i) => {
                          return item.url === photo.src;
                        });
                        return (
                          <flexboxLayout style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: inPhotos ? 5 : 0,
                            borderColor: new Color('#4ac')
                          }} key={index} background={_item.isIcon ? '#fff' : '#eee'} marginLeft={2} marginRight={index === 3 ? 2 : 0} col={index} onTap={() => {
                            if (photo.isIcon) {
                              return;
                            }

                            if (isSingle) {
                              const newFile: CameraRollCallback = {
                                file: photo.file,
                                isApp: true,
                                objType: this.props.fileType || "profile",
                                progress: 0,
                                url: photo.src,
                                session: {
                                  session: session(`${photo.src}:${index}`),
                                  name: `${photo.src}:${index}`
                                }
                              }


                              const _photos = [
                                { url: false, file: { name: null, id: null } },
                                newFile
                              ]

                              this.setState({ photos: _photos });
                            } else {
                              if (inPhotos) {
                                const _photos_ = photos.filter((item, i) => {
                                  return item.url !== photo.src;
                                });

                                this.setState({ photos: _photos_ });
                              } else {
                                const newFile: CameraRollCallback = {
                                  file: photo.file,
                                  isApp: true,
                                  objType: this.props.fileType || "profile",
                                  progress: 0,
                                  url: photo.src,
                                  session: {
                                    session: session(`${photo.src}:${index}`),
                                    name: `${photo.src}:${index}`
                                  }
                                }

                                photos.push(newFile);

                                this.setState({ photos });
                              }
                            }
                          }}>
                            {_item.isIcon &&
                              <label className={'MaterialIcons size50'} color={new Color('#ddd')} text={`${IconSet.MaterialIcons["camera-alt"]}`} />
                            }
                            {_item.type === CameraRollFileType.image &&
                              <image stretch={'aspectFill'} loadMode={'async'} width={widthOf} height={widthOf} src={_item.src} />
                              //<label />
                            }
                          </flexboxLayout>
                        )
                      })
                    }
                  </gridLayout>
                )
              })
            }
          </gridLayout>
        </stackLayout>
      </scrollView>
    );
  }

  render = () => {
    const { onAction, onCancel, visible, actionBtnText, closeBtnText, onRequestClose, user, SvgUri, MaterialIcon, Video, CameraKitCamera, CameraKitCameraScreen, CameraKitGallery, CameraKitGalleryView } = this.props;
    const { photos, filesToUpload, mobile, selected, canDisplayCam, canDisplayGal, showCamera, isSingle, index = 1 } = this.state;
    const canAct = photos.length > 1 ? false : true;
    const _that = this;
    return (
      <gridLayout rows={getItemSpec(['*'])} row={1} background={'#000'}>
        {canDisplayGal &&
          this.renderAndroidGallery()
        }
        {!canDisplayGal &&
          this.renderPermitRequest()
        }
      </gridLayout>
    );
  }
}

const AllowAccessView = (p: any) => {
  const { Permissions = false, feature = '', isShown = true, onRequest = () => { }, onCancel = () => { }, title = '', subtitle = '', ...props } = p
  if (!isShown) {
    return null;
  }

  const _req = Methods.getData(`requested_${feature}`) ? Methods.getData(`requested_${feature}`) : false

  return (
    <stackLayout verticalAlignment={'middle'} horizontalAlignment={'center'} row={0} style={{
      background: "#000",
      justifyContent: 'center',
      alignItems: 'center',
      padding: `0 20`
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '600',
        color: new Color('#fff'),
        marginBottom: 10,
        textAlignment: 'center'
      }}>{title}</Text>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: new Color('#fff'),
        marginBottom: 10,
        textAlignment: 'center'
      }}>{subtitle}</Text>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: new Color('#fff'),
        marginBottom: 20,
        textAlignment: 'center'
      }}>To allow access, click on the blue button below</Text>
      {
        <stackLayout style={{
          flexDirection: 'row',
          padding: `0 10`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20
        }} >
          <flexboxLayout style={{
            height: 70,
            margin: `0 10`,
            borderRadius: 100,

            alignItems: 'center',
            justifyContent: 'center',
          }} onTap={() => {
            console.log("settings")
            if (onRequest && typeof onRequest === "function") onRequest()
          }}>
            <flexboxLayout style={{
              background: '#4ac',
              borderRadius: 100,
              width: screen.mainScreen.widthDIPs * 0.7,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: '#fff' }}>ALLOW ACCESS</Text>
            </flexboxLayout>
          </flexboxLayout>
        </stackLayout>
      }
      {isIOS &&
        <stackLayout style={{

          flexDirection: 'row',
          padding: `0 10`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20
        }} onTap={() => {
          openAppSettings();
        }}>
          <flexboxLayout style={{
            height: 70,
            margin: `0 10`,
            borderRadius: 100,

            width: screen.mainScreen.widthDIPs * 0.7,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <flexboxLayout style={{
              background: '#4a5',
              borderRadius: 100,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: '#fff' }}>OPEN SETTINGS</Text>
            </flexboxLayout>
          </flexboxLayout>
        </stackLayout>
      }
      <flexboxLayout style={{
        flexDirection: 'row',
        padding: `0 10`,
        alignItems: 'center',
        justifyContent: 'center'
      }} >
        <flexboxLayout style={{
          height: 70,
          margin: `0 10`,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }} onTap={onCancel}>
          <flexboxLayout style={{
            background: '#D33242',
            borderRadius: 100,
            width: screen.mainScreen.widthDIPs * 0.7,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ color: new Color('#fff') }}>CANCEL</Text>
          </flexboxLayout>
        </flexboxLayout>
      </flexboxLayout>
    </stackLayout >
  )
}

const View = (props: any) => null;

const Text = (props: any) => (
  <label {...props} textWrap text={String(props.children)} />
);

export const WhoShouldSee = (props: any) => null;

export const CheckIn = (props: any) => null;

export const TagUser = (props: any) => null;

const TouchableOpacity = (props: any) => null;

export const RichInputField_ = (props: any) => {
  const { row, col } = props;
  return (
    <stackLayout
      {...col ? { col } : {}}
      {...row ? { row } : {}}
      style={{
        ...props.containerStyle
      }}
    />
  )
};

export const PATTERNS = {
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  email: /\S+@\S+\.\S+/
};

enum RichInputFieldTriggerTypes {
  NEWWORD = "new-word-only",
  ANY = "anywhere"
}
interface RichInputFieldProps {
  textInputStyle?: any,
  suggestionsPanelStyle?: any,
  loadingComponent?: any,
  isTop?: boolean,
  textInputMinHeight?: number,
  textInputMaxHeight?: number,
  trigger: string,
  triggerLocation: RichInputFieldTriggerTypes,
  value: string,
  onChangeText(data: any): void,
  triggerCallback(data?: any): void,
  renderSuggestionsRow(item?: any, hidePanel?: any): any,
  suggestionsData: any[],
  keyExtractor?: any,
  horizontal?: boolean,
  suggestionRowHeight: number,
  parse?: any
  MaxVisibleRowCount: any,
  inputStyle?: any
  containerStyle?: any
  placeholder?: string,
  textInputProps?: any
  multiline: boolean
}

class TextExtraction {
  text: any;
  patterns: any;
  /**
   * @param {String} text - Text to be parsed
   * @param {Object[]} patterns - Patterns to be used when parsed
   *                              other options than pattern would be added to the parsed content
   * @param {RegExp} patterns[].pattern - RegExp to be used for parsing
   */
  constructor(text: any, patterns: any[]) {
    this.text = text;
    this.patterns = patterns || [];
    //alert(text)
  }

  /**
   * Returns parts of the text with their own props
   * @return {Object[]} - props for all the parts of the text
   */
  parse() {
    let parsedTexts = [{ text: this.text }];
    Methods.listify(this.patterns).forEach(pattern => {
      let newParts = [];

      Methods.listify(parsedTexts).forEach((parsedText: any) => {
        // Only allow for now one parsing
        if (parsedText._matched) {
          newParts.push(parsedText);
          return;
        }

        let parts = [];
        let textLeft = parsedText.text;

        while (textLeft) {
          let matches = textLeft.match(pattern.pattern);//pattern.pattern.exec(textLeft);


          if (!matches) {
            break;
          }

          let previousText = textLeft.substr(0, matches.index);

          parts.push({ text: previousText });

          parts.push(
            this.getMatchedPart(pattern, matches[0], matches)
          );

          textLeft = textLeft.substr(
            matches.index + matches[0].length
          );
        }

        parts.push({ text: textLeft });
        newParts.push(...parts);

      });

      parsedTexts = newParts;
    });

    // Remove _matched key.
    Methods.listify(parsedTexts).forEach((parsedText: any) => delete parsedText._matched);

    return parsedTexts.filter(t => !!t.text);
  }

  // private

  /**
   * @param {Object} matchedPattern - pattern configuration of the pattern used to match the text
   * @param {RegExp} matchedPattern.pattern - pattern used to match the text
   * @param {String} text - Text matching the pattern
   * @param {String[]} text - Result of the RegExp.exec
   * @return {Object} props for the matched text
   */

  getMatchedPart(matchedPattern: { [x: string]: any; cb?: any; renderText?: any; }, text: any, matches: (this: any, key: string, value: any) => any) {
    let props = {};

    Object.keys(matchedPattern).forEach(key => {
      if (key === "pattern" || key === "renderText") {
        return;
      }

      if (typeof matchedPattern[key] === "function") {
        props[key] = () => matchedPattern[key](text);
      } else {
        props[key] = matchedPattern[key];
      }
    });

    if (matchedPattern.cb) {
      matchedPattern.cb(JSON.stringify(text, matches))
    }

    let children = text;
    if (
      matchedPattern.renderText &&
      typeof matchedPattern.renderText === "function"
    ) {
      children = matchedPattern.renderText(text, matches);
    }

    return {
      ...props,
      children: children,
      _matched: true
    };
  }
}

export default TextExtraction;


export class RichInputField extends Component<RichInputFieldProps & any, any>{
  isTrackingStarted: boolean;
  previousChar: string;
  _textInput: any;
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      textInputHeight: '',
      isTrackingStarted: false,
      suggestionRowHeight: 0,
      height_off: 30,
      y: 0
    };

    this.isTrackingStarted = false;
    this.previousChar = " ";
  }

  static defaultProps = {
    textInputStyle: { borderColor: '#ebebeb', borderWidth: 1, fontSize: 16 },
    suggestionsPanelStyle: { backgroundColor: 'rgba(100,100,100,0.1)' },
    loadingComponent: () => <Text>Loading...</Text>,
    textInputMinHeight: 30,
    textInputMaxHeight: 80,
    horizontal: true,
    trigger: '@',
    value: '',
    renderSuggestionsRow: (item) => null,
    triggerLocation: 'anywhere',
    suggestionRowHeight: screen.mainScreen.heightDIPs / 3,
    triggerCallback: (text) => { },
    suggestionsData: [],
    keyExtractor: (text) => text,
    onChangeText: (text) => { }
  }

  componentWillMount = () => {
    this.setState({
      textInputHeight: this.props.textInputMinHeight
    })
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.value) {
      this.resetTextbox();
    } else if (this.isTrackingStarted && !nextProps.horizontal && nextProps.suggestionsData.length !== 0) {
      const numOfRows = nextProps.MaxVisibleRowCount >= nextProps.suggestionsData.length ? nextProps.suggestionsData.length : nextProps.MaxVisibleRowCount;
      const height = numOfRows * nextProps.suggestionRowHeight;
      this.openSuggestionsPanel(height);
      this.setState({ text: nextProps.value })
    }
  }

  startTracking = () => {
    this.isTrackingStarted = true;
    this.openSuggestionsPanel();
    this.setState({
      isTrackingStarted: true
    })
  }

  stopTracking = () => {
    this.isTrackingStarted = false;
    this.closeSuggestionsPanel();
    this.setState({
      isTrackingStarted: false
    })
  }

  openSuggestionsPanel = (height = 0) => {
    this.setState({ suggestionRowHeight: height })
  }

  closeSuggestionsPanel = () => {
    this.setState({ suggestionRowHeight: 0 })
  }

  updateSuggestions = (lastKeyword) => {
    this.props.triggerCallback(lastKeyword);
  }

  identifyKeyword = (val) => {
    if (this.isTrackingStarted) {
      const boundary = this.props.triggerLocation === 'new-word-only' ? 'B' : '';
      const pattern = new RegExp(`\\${boundary}${this.props.trigger}[a-z0-9_-]+|\\${boundary}${this.props.trigger}`, `gi`);
      const keywordArray = val.match(pattern);
      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1];
        this.updateSuggestions(lastKeyword);
      }
    }
  }

  onChangeText = (val) => {
    this.props.onChangeText(val);
    const lastChar = val.substr(val.length - 1);
    const wordBoundry = (this.props.triggerLocation === 'new-word-only') ? this.previousChar.trim().length === 0 : true;
    if (lastChar === this.props.trigger && wordBoundry) {
      this.startTracking();
    } else if (lastChar === ' ' && this.state.isTrackingStarted || val === "") {
      this.stopTracking();
    }
    this.previousChar = lastChar;
    this.identifyKeyword(val);
    this.setState({ text: val }); // pass changed text back
  }

  resetTextbox = () => {
    this.previousChar = " ";
    this.stopTracking();
    this.setState({ textInputHeight: this.props.textInputMinHeight });
  }

  getPatterns = () => {
    const userReg = Methods.getTaggableUsers().map((item, i) => {
      return item.name
    }).join("|");

    const reg = new RegExp(userReg);

    const userReg_ = Methods.getTaggableUsers().map((item, i) => {
      return '%' + item._id + '^' + item.type + '%';
    }).join("|");

    const reg2 = new RegExp(userReg_);

    console.log(userReg_, reg2)



    const parse = this.props.parse || [
      { type: 'url', style: {} },
      { type: 'phone', style: {} },
      { type: 'email', style: {} },
      {
        pattern: /\[(@[^:]+):([^\]]+)\]/i,
        style: {
          color: 'red'
        },
        //onPress: this.handleNamePress,
        //renderText: this.renderText
      },
      //{pattern: /Bob|David/,style: {}},
      //{pattern: /\[(@[^:]+):([^\]]+)\]/i,style: {}, renderText: this.renderText},
      //{pattern: /42/,style: {}},
      {
        pattern: reg,
        style: {
          fontWeight: '600',
          color: new Color(Theme['500']),
          backgroundColor: new Color(Theme2['100']),
          borderRadius: 3
        }
      },
      {
        pattern: reg2,
        style: {
          fontWeight: '600',
          color: new Color(Theme['500']),
          backgroundColor: new Color(Theme2['100']),
          borderRadius: 3
        }
      },
      {
        pattern: /%([0-9A-Fa-f]{24}[^]{1}(\w){1})%/i,
        style: {
          fontWeight: '600',
          color: new Color(Theme['500']),
          backgroundColor: new Color(Theme2['100']),
          borderRadius: 3
        },
        onPress: (text = '') => {
          const _req = /%(.*?)%/i;
          const users = Methods.getTaggableUsers();
          const matches = text.match(_req);
          const _user = users[matches[1]]; //
          const route = Methods.getRouteName(_user.type).name;
          //NavigationService.navigate({routeName:route,params: _user, key: _user.user})
        },
        renderText: (matchString, matches) => {
          const users = Methods.getTaggableUsers();
          const _userAttr = matches[1].split("^");
          const _users = users.filter((item) => item._id === _userAttr[0] && item.type === _userAttr[1]);
          return matchString;//users[matches[1]]['name']
        }
      },
      {
        pattern: /#(\w+)/, style: {
          color: new Color(Theme['500']),
          backgroundColor: new Color(Theme2['100']),
          borderRadius: 3
        }
      },
      {
        pattern: /&(\w+)/, style: {
          color: new Color(Theme['500']),
          backgroundColor: new Color(Theme2['100']),
          borderRadius: 3
        }
      }
    ];

    return parse.map(option => {
      const { type, ...patternOption } = option;
      if (type) {
        if (!PATTERNS[type]) {
          throw new Error(`${option.type} is not a supported type`);
        }
        patternOption.pattern = PATTERNS[type];
      }

      return patternOption;
    });
  }

  getParsedText = () => {
    const textExtraction = new TextExtraction(
      this.props.value || this.state.text,
      this.getPatterns()
    );

    return textExtraction.parse().map((props, index) => {
      return (
        <span
          key={`parsedText-${index}`}
          {...props}
        />
      );
    });
  }

  onLoaded = (args: EventData) => {
    const object = args.object as StackLayout;
    object.onMeasure = (width, height) => {
      //const y = object.;
      const height_off = height;
      this.setState({ height_off });
    }
  }

  render = () => {
    const { inputStyle = {}, containerStyle = {}, placeholder = "Write something...", textInputProps = {} } = this.props;
    const _height = Math.min(this.props.textInputMaxHeight, this.state.textInputHeight);
    const isTop = this.props.isTop//?this.props.isTop:this.state.y < (height / 4)?true:false;
    const width = screen.mainScreen.widthDIPs;
    return (
      <React.Fragment>
        <stackLayout onLoaded={this.onLoaded}
          style={
            {
              padding: `5 10 10 10`,
              ...containerStyle
            }
          }>
          <textView
            autocorrect
            effectiveMinHeight={30}
            onTextChange={(args: any) => {
              this.onChangeText(args.object.text)
            }}
            onLoaded={clearBorder}
            onContentSizeChange={(event) => {
              this.setState({
                textInputHeight: this.props.textInputMinHeight >= event.nativeEvent.contentSize.height ? this.props.textInputMinHeight : event.nativeEvent.contentSize.height + 10,
              });
            }}
            ref={(component) => {
              this._textInput = component;
            }}
            borderBottomColor={"rgba(0,0,0,0)"}
            multiline={this.props.multiline ? this.props.multiline : true}
            hint={placeholder}
            style={{ color: new Color('black'), textAlign: "left", textAlignVertical: "top", ...inputStyle }}
            {...textInputProps}
          >
            <formattedString>{this.getParsedText()}</formattedString>
          </textView>
        </stackLayout>
        {this.props.suggestionsData.length > 0 && this.state.isTrackingStarted &&
          <stackLayout />
        }
      </React.Fragment>
    )
  }
}

export const PostItemButton = (args: any) => {
  const { Icon, noIcon = false, col, row, countColor = "#D33242", Label, style, count = false, LabelColor = "#000", onPress = () => { }, ...props } = args;
  if (count) {
    return (
      <absoluteLayout onTouch={onTouch} {...col ? { col } : {}} {...row ? { row } : {}} style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}>
        <flexboxLayout style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }} onTap={onPress}>
          {!noIcon && Icon}
          {Label &&
            <label style={{
              marginLeft: ms(2),
              color: new Color(LabelColor),
              fontSize: ms(13)
            }} text={Label} />
          }
        </flexboxLayout>
        {count && String(count) !== "0" &&
          <stackLayout style={{
            height: 13,
            width: 13,
            marginRight: 0,
            verticalAlignment: 'middle',
            horizontalAlignment: 'center',
            borderRadius: 13 / 2,
            background: countColor
          }}>
            <label style={{
              marginRight: 1,
              marginTop: -1,
              textAlignment: 'center',
              verticalAlignment: 'middle',
              color: new Color('#fff'),
              fontSize: ms(8)
            }} text={String(count)} />
          </stackLayout>
        }
      </absoluteLayout>
    )
  }
  return (
    <flexboxLayout onTouch={onTouch}  {...col ? { col } : {}} {...row ? { row } : {}} style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }} onTap={onPress}>
      {!noIcon && Icon}
      {Label &&
        <label style={{
          marginLeft: ms(5),
          color: new Color(LabelColor),
          fontSize: ms(13)
        }} text={Label} />
      }
    </flexboxLayout>
  )
}

export const LoadingState = (args: any) => {
  const { onTap = () => { }, text, textStyle = {}, style, ...props } = args;
  return (
    <flexboxLayout style={{
      background: '#fff',
      marginTop: 16,
      marginBottom: 16,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20 0',
      ...style
    }} onTap={onTap}>
      <stackLayout style={{

      }}>
        {text &&
          <label style={{
            marginBottom: 10,
            ...textStyle
          }} text={text} />
        }
        <activityIndicator busy color={new Color("#4ac")} />

      </stackLayout>
    </flexboxLayout>
  )
}

export const FullScreenLoader = (args) => (
  <flexboxLayout style={{
    height: 140,
    margin: '16 0',
    borderRadius: 8,
    background: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <LoadingState style={{
      width: '100%',
      height: '100%',
      borderRadius: 8,
    }} {...args} />
  </flexboxLayout>
)

interface EmptyProps {
  onTap?(): void,
  text?: string,
  Icon?: React.ReactNode,
  iconStyle?: object,
  [x: string]: any,
}

export const Empty = (_props: EmptyProps & Record<string, any>) => {
  const { onTap = () => { }, text, Icon, iconStyle, ...props } = _props;
  return (
    <stackLayout onTouch={onTouch} style={{
      background: '#fff',
      margin: `16 0`,
      verticalAlignment: 'middle',
      horizontalAlignment: 'center',
      //padding: `30 0`,
      //width: '100%',
      // @ts-ignore
      ...props.style
    }} onTap={onTap}>
      {Icon &&
        <flexboxLayout style={
          {
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
            ...iconStyle
          }
        }>
          {Icon}
        </flexboxLayout>
      }

      {!Icon &&
        <flexboxLayout style={
          {
            marginBottom: 10,
            alignItems: 'center',
            justifyContent: 'center',
            ...iconStyle
          }
        }>
          <label className={"Foundation"} text={IconSet.Foundation["mountains"]} style={{
            color: new Color(Theme['500']),
            fontSize: 35
          }} />
        </flexboxLayout>
      }
      <label textWrap style={{ textAlignment: "center", verticalAlignment: "middle" }} text={text ? text : 'Nothing here'} />
    </stackLayout>
  )
}

export const Padding = (props: any) => {
  const { padding, paddingHorizontal, paddingBottom, paddingLeft, paddingRight, paddingTop, paddingVertical, children, style } = props;
  return (
    <stackLayout style={{
      padding,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      ...style,
      ...paddingHorizontal ? {
        paddingLeft: paddingHorizontal,
        paddingRight: paddingHorizontal
      } : {},
      ...paddingVertical ? {
        paddingBottom: paddingVertical,
        paddingTop: paddingVertical
      } : {}
    }}>
      {children}
    </stackLayout>
  )
}

Padding.Flex = (props: any) => {
  const { padding, paddingHorizontal, paddingBottom, paddingLeft, paddingRight, paddingTop, paddingVertical, children, style } = props;
  return (
    <flexboxLayout style={{
      padding,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      ...style,
      ...paddingHorizontal ? {
        paddingLeft: paddingHorizontal,
        paddingRight: paddingHorizontal
      } : {},
      ...paddingVertical ? {
        paddingBottom: paddingVertical,
        paddingTop: paddingVertical
      } : {}
    }}>
      {children}
    </flexboxLayout>
  )
}

Padding.Grid = (props: any) => {
  const { padding, paddingHorizontal, columns, rows, col, row, paddingBottom, paddingLeft, paddingRight, paddingTop, paddingVertical, children, style } = props;
  return (
    <gridLayout {...col ? { col } : {}} {...row ? { row } : {}} {...columns ? { columns } : {}} {...rows ? { rows } : {}} style={{
      padding,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      ...style,
      ...paddingHorizontal ? {
        paddingLeft: paddingHorizontal,
        paddingRight: paddingHorizontal
      } : {},
      ...paddingVertical ? {
        paddingBottom: paddingVertical,
        paddingTop: paddingVertical
      } : {}
    }}>
      {children}
    </gridLayout>
  )
}

export const SaveButton = (p: any) => {
  const { children, onPress, col, row, hasRadius = false, label = 'Save', isDark = false, isLoading = false, style = {}, textStyle = {}, danger = false, ...props } = p;
  if (children) {
    return (
      <flexboxLayout {...col ? { col } : {}} {...row ? { row } : {}} style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        background: danger ? 'red' : isDark ? Theme['500'] : Theme2['500'],
        borderRadius: hasRadius ? 10 : 0,
        padding: `0 10`,
        ...style
      }}>
        {isLoading &&
          <activityIndicator busy color={new Color("#fff")} />
        }
        {!isLoading &&
          <label style={{
            color: new Color('#fff'),
            ...textStyle
          }} text={label} />
        }
        {!isLoading && children}
      </flexboxLayout>
    )
  }

  return (
    <flexboxLayout {...col ? { col } : {}} {...row ? { row } : {}} onTouch={onTouch} style={{
      alignItems: 'center',
      justifyContent: 'center',
      height: 40,
      background: isDark ? Theme['500'] : Theme2['500'],
      borderRadius: hasRadius ? 10 : 0,
      padding: `0 10`,
      ...style
    }} onTap={() => {
      if (!isLoading && onPress) {
        onPress()
      }
    }}>
      {isLoading &&
        <activityIndicator color={new Color("#fff")} />
      }
      {!isLoading &&
        <label style={{
          color: new Color('#fff'),
          ...textStyle
        }} text={label} />
      }
      {!isLoading && children}
    </flexboxLayout>
  )
}

export const styles = {
  button: {
    borderRadius: 10,
    marginTop: 5
  }
}

interface RichTextViewPropTypes {
  parse?: any,
  onUserPress?(args: any): void,
  onHashPress?(args: any): void,
  onSkillPress?(args: any): void,
  onUrlPress?(args: any): void,
  onEmailPress?(args: any): void,
  users: object[],
  skillStyle?: object,
  userStyle?: object,
  hashStyle?: object,
  linkStyle?: object,
  style: object,
  content: string,
  col?: number,
  row?: number,
  isTextEdit?: boolean,
  hasUser?: boolean,
  user?: any
}

export class RichTextView extends Component<RichTextViewPropTypes, any>{
  static displayName = "ParsedText";

  static defaultProps = {
    parse: null,
    users: [],
    skillStyle: {},
    userStyle: {
      fontWeight: '600',
      color: new Color(Theme['500']),
      background: Theme2['100'],
      borderRadius: 3
    },
    hashStyle: {
      color: new Color(Theme['500']),
      background: Theme2['100'],
      borderRadius: 3
    },
    linkStyle: {
      color: new Color(Theme['500']),
      background: Theme2['100'],
      borderRadius: 3
    },
    content: '',
    style: {},
    onUserPress: (user) => { },
    onHashPress: (hash) => { },
    onSkillPress: (skill) => { },
    onUrlPress: (url) => { },
    onEmailPress: (email) => { },
    //childrenProps: {}
  };

  render = () => {
    const { users = Methods.getTaggableUsers(), style, skillStyle, userStyle, hashStyle, linkStyle, content = '', onUserPress, onHashPress, onSkillPress, onUrlPress, onEmailPress, col, row, ...props } = this.props;

    const parse = this.props.parse || [
      { type: 'url', style: {} },
      { type: 'phone', style: {} },
      { type: 'email', style: {} },
      {
        pattern: /\[(@[^:]+):([^\]]+)\]/i,
        style: {
          color: 'red'
        },
        //onPress: this.handleNamePress,
        //renderText: this.renderText
      },
      //{pattern: /Bob|David/,style: {}},
      //{pattern: /\[(@[^:]+):([^\]]+)\]/i,style: {}, renderText: this.renderText},
      //{pattern: /42/,style: {}},
      {
        pattern: /%([0-9A-Fa-f]{24}[^]{1}(\w){1})%/i,
        style: {
          fontWeight: '600',
          color: new Color(Theme['500']),
          background: Theme2['100'],
          borderRadius: 3
        },
        onPress: (text = '') => {
          const _req = /%(.*?)%/i;
          const users = Methods.getTaggableUsers();
          const matches = text.match(_req);
          const _user = users[matches[1]]; //
          const route = Methods.getRouteName(_user.type).name;
          //this.props.navigation.navigate({routeName:route,params: _user, key: _user.user})
        },
        renderText: (matchString, matches) => {
          const users = Methods.getTaggableUsers();
          const _userAttr = matches[1].split("^");
          const _users = users.filter((item) => item._id === _userAttr[0] && item.type === _userAttr[1]);
          return matchString;//users[matches[1]]['name']
        }
      },
      {
        pattern: /#(\w+)/, style: {
          color: new Color(Theme['500']),
          background: Theme2['100'],
          borderRadius: 3
        }
      },
      {
        pattern: /&(\w+)/, style: {
          color: new Color(Theme['500']),
          background: Theme2['100'],
          borderRadius: 3
        }
      }
    ];

    let delimiter = /\s+/;

    //split string
    let _text = content; //"%5c5bff18187b513744173553^F% test!";
    let token, index, parts = [];
    while (_text) {
      delimiter.lastIndex = 0;
      token = delimiter.exec(_text);
      if (token === null) {
        break;
      }
      index = token.index;
      if (token[0].length === 0) {
        index = 1;
      }
      parts.push(_text.substr(0, index));
      parts.push(token[0]);
      index = index + token[0].length;
      _text = _text.slice(index);
    }
    parts.push(_text);

    //highlight hashtags
    parts = parts.map((text, i) => {
      if (/^#/.test(text)) {
        return <span key={i} style={{
          //color: new Color(Theme['500']),
          //backgroundColor: new Color(Theme2['100']),
          borderRadius: 3,
          color: new Color('#000'),
          fontWeight: '400',
          ...hashStyle
        }} text={text} />;
      } else if (/^&/.test(text)) {
        return <span key={i} style={{
          //color: new Color(Theme['500']),
          //backgroundColor: new Color(Theme2['100']),
          borderRadius: 3,
          color: new Color('#000'),
          fontWeight: '400',
          ...skillStyle
        }} text={text} />;
      } else if (/%([0-9A-Fa-f]{24}[^]{1}(\w){1})%/i.test(text)) {
        const str = /%([0-9A-Fa-f]{24}[^]{1}(\w){1})%/i.exec(text)[1].split('^')
        const userMatch = users.filter((user) => {
          return user._id === str[0] && user.type === str[1];
        });
        const displayValue = userMatch[0] ? userMatch[0]['name'] : /%([0-9A-Fa-f]{24}[^]{1}(\w){1})%/i.exec(text)[1];
        return (
          <span key={i} style={{
            fontWeight: 'bold',
            color: new Color(Theme['500']),
            background: Theme2['100'],
            ...userStyle
          }} text={displayValue.toLowerCase()} />
        );
      } else {
        return (
          <span key={i} text={text} />
        );
      }
    });

    if (props.isTextEdit) {
      return (
        <textView {...col ? { col } : {}} {...row ? { row } : {}} style={{
          ...this.props.style
        }} editable borderBottomWidth={0}>
          <formattedString>
            {parts}
          </formattedString>
        </textView>
      )
    }

    return (
      <label {...col ? { col } : {}} {...row ? { row } : {}} style={{
        ...this.props.style
      }} textWrap={true}>
        <formattedString>
          {props.hasUser && (props.user && props.user.name) &&
            <span style={{ marginRight: 16, fontWeight: 'bold' }} text={props.user.name + " "} />
          }

          {parts}
        </formattedString>
      </label>
    );
  }
}
