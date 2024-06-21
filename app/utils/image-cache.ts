import * as React from 'react'
import { ImageSource } from '@nativescript/core/image-source';
import { Cache } from '@nativescript/core/ui/image-cache'
import { isWebsite } from '.';

export const cache = new Cache();
cache.maxRequests = 7
cache.placeholder = ImageSource.fromFileSync('~/assets/events-placeholder.jpg')

interface UseImageCacheProps {
  url: string,
  avatar?: boolean
}
export const useImageCache = ({ url, avatar }: UseImageCacheProps) => {
  const [image, setImage] = React.useState<ImageSource | string | undefined>(avatar || "" || !isWebsite(url) ? undefined : cache.placeholder )
  React.useEffect(() => {
    if (!url) return;
    const img = cache.get(url)

    if (img) {
      const imageSrc = new ImageSource(img)
      setImage(imageSrc)
    } else {
      cache.push({
        key: url,
        url: url,
        completed: (image, key) => {
          cache.set(key, image)
          if (url === key) {
            const imageSrc = new ImageSource(image)
            setImage(imageSrc);
          }
        },
        error(key) {
          console.log(key, 'error')
        },
    });
    }
  }, [url])
  return image
}
