import * as React from 'react';
import IconSet from './icons';
import { Observable } from "tns-core-modules/data/observable";
import { Font } from "tns-core-modules/ui/styling/font";
const { Component } = React;
interface Config<P> {
  ElementType: React.ReactType<P>
}

type FontTypes = "AntDesign" | "FontAwesome" | "AntDesign" | "Zocial" | "Foundation" | "MaterialCommunityIcons" | "Feather" | "FontAwesome5Free" | "SimpleLineIcons" | "Entypo" | "MaterialIcons" | "Octicons" | "EvilIcons" | "Fontisto" | "FontAwesome5Pro" | "Ionicons"
//type TintColor:
interface IcoProps {
  name: string,
  type: FontTypes,
  style: any,
  image?: boolean,
  fontClass?: string
}

interface IcoState {

}

export default class Icon extends Component<IcoProps & any, IcoState> {

  constructor(props: IcoProps) {
    super(props);
  }

  render() {
    const { name, type, fontClass, forwardedRef, ...rest } = this.props;
    const _name = this.props.name ? this.props.name : 'question';
    const _type = this.props.type ? this.props.type : 'AntDesign';
    const _icon = IconSet[_type][_name] ? IconSet[_type][_name] : IconSet.AntDesign.question;
    const _style = this.props.style || {};

    const icon_ = String.fromCharCode(_icon);

    if (this.props.image) {
      return (
        <image {...rest} src={`font://${icon_}`} className={`${_type} ${this.props.fontClass}`} stretch={'none'} />
      )
    }

    return (
      <label {...rest} textWrap className={_type} text={icon_} />
    )
  }
}
