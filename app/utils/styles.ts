import { mergeRight } from "ramda";
import { RNSStyle } from "react-nativescript";
// import { colors } from "~/theme";

export const composeStyles = (args: RNSStyle[]) => {
  return args.reduce((acc, curr) => {
    return mergeRight(acc, curr);
  }, {});
}

export const pickTextColorBasedOnBgColorAdvanced = (bgColor, lightColor, darkColor) => {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.189) ? darkColor : lightColor;
}

export const shadeColor = (color: string, percent: number) => {

  var R = parseInt(color.substring(1, 3), 16);
  var G = parseInt(color.substring(3, 5), 16);
  var B = parseInt(color.substring(5, 7), 16);

  R = parseInt(String(R * (100 + percent) / 100));
  G = parseInt(String(G * (100 + percent) / 100));
  B = parseInt(String(B * (100 + percent) / 100));

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}


// export const getRandomColor = () => {
//     var colorList = [colors.primary.main, colors.secondary.main, colors.success.main, colors.warning.main, colors.error.main];
//     return colorList[Math.floor(Math.random() * colorList.length)];
// }
