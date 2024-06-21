import { ImageSource } from '@nativescript/core'

export const getImage = function(view) {
    if (view.ios) {
        UIGraphicsBeginImageContextWithOptions(view.ios.frame.size, false, 0);
        view.ios.drawViewHierarchyInRectAfterScreenUpdates(CGRectMake(0, 0, view.ios.frame.size.width, view.ios.frame.size.height), true);
        var imageFromCurrentImageContext = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return ImageSource.fromData(UIImagePNGRepresentation(imageFromCurrentImageContext));

    } else if (view.android) {
        view.android.setDrawingCacheEnabled(true);
        var bmp = android.graphics.Bitmap.createBitmap(view.android.getDrawingCache());
        view.android.setDrawingCacheEnabled(false);
        var source = new ImageSource();
        source.setNativeSource(bmp);
        return source;
    }
    return undefined;
}

export const getImageBMP = function(view) {
  if (view.ios) {
      return undefined;
  } else if (view.android) {
      view.android.setDrawingCacheEnabled(true);
      var bmp = android.graphics.Bitmap.createBitmap(view.android.getDrawingCache());
      view.android.setDrawingCacheEnabled(false);
      return bmp;
  }
  return undefined;
}
