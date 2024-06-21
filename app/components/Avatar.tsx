import * as React from 'react';
import { AbsoluteLayoutAttributes, RNSStyle } from 'react-nativescript';
import icons from '../utils/icons';
import { composeStyles, pickTextColorBasedOnBgColorAdvanced } from '../utils/styles';
import getInitials from '../utils/getInitials'
import Theme from '~/Theme';


interface AvatarProps extends AbsoluteLayoutAttributes {
  name: string;
  image?: any;
  col?: number;
  row?: number;
  size?: number;
  containerStyle?: RNSStyle;
  labelStyle?: RNSStyle;
  fontSize?: number;
  background?: string;
  onTap?(args?: any): void;
  color?: string;
  edit?: boolean;
  square?: boolean;
}

export const Avatar: React.FC<AvatarProps> = (props) => {
  const {
    image,
    name,
    col,
    row,
    containerStyle = {},
    labelStyle = {},
    size = 50,
    fontSize,
    background = Theme[500],
    onTap,
    color,
    edit,
    square,
  } = props
  const [bgColor] = React.useState(background);
  const [imageLoadFail, setImageLoadFail] = React.useState(false);
  // const img = useImageCache({
  //   url: image,
  //   avatar: cache ? false : true,
  // })
  const isImage = imageLoadFail ? imageLoadFail : image ? true : false;
  // const isImage = img ? true : false;
  const labelStyles = React.useMemo(() => {
    return composeStyles([{
      fontSize: !fontSize ? size * 0.4 : fontSize,
      ...isImage ? {
        width: size,
        height: size,
      } : {
        color: color ? color : pickTextColorBasedOnBgColorAdvanced(bgColor, '#fff', '#000')
      }
    }, labelStyle])
  }, [labelStyle]);
  const containerStyles = React.useMemo(() => {
    return composeStyles([{
      width: size,
      height: size,
      background: bgColor,
      color: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }, containerStyle])
  }, [containerStyle, size, bgColor]);

  // React.useEffect(() => {
  //   if (image) {
  //     fetch(image).then(r => {
  //       const contentType = r.headers['']['content-type'] || r.headers['Content-Type'];
  //       if (!contentType) {
  //         setImageLoadFail(true);
  //       } else {
  //         setImageLoadFail(false);
  //       }
  //     }).catch(() => {
  //       setImageLoadFail(true);
  //     });
  //   }
  // }, [image])

  return (
    <absoluteLayout {...col ? { col } : {}} {...row ? { row } : {}}>
      <flexboxLayout onTap={onTap} borderRadius={square ? 10 : '50%'} style={containerStyles}>
        {isImage && (
          <image borderRadius={square ? 10 : '50%'} verticalAlignment='middle' src={image} style={labelStyles} loadMode="async" stretch='aspectFill' />
        )}
        {!isImage && (
          <label verticalAlignment='middle' horizontalAlignment='center' text={getInitials(name)} style={labelStyles} />
        )}
      </flexboxLayout>
      {edit && (
        <flexboxLayout alignItems='center' justifyContent='center' top={(size as number)  - 20} left={(size as number) - 20} style={{
          height: 20,
          width: 20,
          borderRadius: '50%',
          background: Theme['800'],
          ...square ? {
            marginRight: 8,
            marginBottom: 8
          } : {}
        }}>
          <label className='MaterialIcons' color='#fff' text={icons.MaterialIcons.create} fontSize={14} />
        </flexboxLayout>
      )}
    </absoluteLayout>
  )
}
