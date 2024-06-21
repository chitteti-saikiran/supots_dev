declare namespace cn{
    namespace nodemedia{
        export class NodeCameraView extends globalAndroid.widget.FrameLayout implements globalAndroid.opengl.GLSurfaceView.Renderer, globalAndroid.view.SurfaceHolder.Callback, globalAndroid.graphics.SurfaceTexture.OnFrameAvailableListener{
            public onSurfaceChanged(param0: javax.microedition.khronos.opengles.GL10, param1: number, param2: number): void;
            public onSurfaceCreated(param0: javax.microedition.khronos.opengles.GL10, param1: javax.microedition.khronos.egl.EGLConfig): void;
            public onDrawFrame(param0: javax.microedition.khronos.opengles.GL10): void;
            public surfaceCreated(param0: globalAndroid.view.SurfaceHolder): void;
            public surfaceChanged(param0: globalAndroid.view.SurfaceHolder, param1: number, param2: number, param3: number): void;
            public surfaceDestroyed(param0: globalAndroid.view.SurfaceHolder): void;
            public onFrameAvailable(param0: globalAndroid.graphics.SurfaceTexture): void;
            constructor(context: globalAndroid.content.Context)
            public getGLSurfaceView():globalAndroid.opengl.GLSurfaceView
            public startPreview(cameraId:number): number;
            public stopPreview(): number;
            public  getPreviewSize():globalAndroid.hardware.Camera.Size;
            public isFrontCamera(): boolean; 
            public getCameraOrientation():number;
            public setAutoFocus(isAutoFocus:boolean): number
            public setFlashEnable(on: boolean): number
            public switchCamera():number;
            public setNodeCameraViewCallback(callback: any ):void
            public getExternalOESTextureID() : number;
        }

        export namespace NodeCameraView{
            export interface NodeCameraViewCallback {

                OnCreate():void;
        
                OnChange(cameraWidth:number,cameraHeight:number,surfaceWidth:number,surfaceHeight:number):void;
        
                OnDraw(textureId:number):void;
        
                OnDestroy():void;
            }
        }

        export class NodePlayerView extends globalAndroid.widget.FrameLayout implements globalAndroid.view.SurfaceHolder.Callback, globalAndroid.view.TextureView.SurfaceTextureListener{
            public surfaceCreated(param0: globalAndroid.view.SurfaceHolder): void;
            public surfaceChanged(param0: globalAndroid.view.SurfaceHolder, param1: number, param2: number, param3: number): void;
            public surfaceDestroyed(param0: globalAndroid.view.SurfaceHolder): void;
            public onSurfaceTextureUpdated(param0: globalAndroid.graphics.SurfaceTexture): void;
            public onSurfaceTextureAvailable(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number): void;
            public onSurfaceTextureSizeChanged(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number): void;
            public onSurfaceTextureDestroyed(param0: globalAndroid.graphics.SurfaceTexture): boolean;
            public setRenderCallback(callback: any): void
            constructor(context: globalAndroid.content.Context)
            public setRenderType(renderType:any):void
        
            public getRenderType(): cn.nodemedia.NodePlayerView.RenderType;
        
            public getRenderView(): globalAndroid.view.View

            public setVideoSize(width: number, height:number): void;
        
            public setUIViewContentMode(mode:any):  void;     
        }

        export namespace NodePlayerView{
            export interface RenderCallback {
                onSurfaceCreated(surface:globalAndroid.view.Surface): void;
        
                onSurfaceChanged(width:number, height:number):void;
        
                onSurfaceDestroyed():void;
            }
    
            export enum RenderType {
                SURFACEVIEW,
                TEXTUREVIEW
            }

            export enum UIViewContentMode {
                ScaleToFill,
                ScaleAspectFit,
                ScaleAspectFill
            }
        }

        export class NodePlayer implements cn.nodemedia.NodePlayerView.RenderCallback{
            onSurfaceCreated(surface: globalAndroid.view.Surface): void;
            onSurfaceChanged(width: number, height: number): void;
            onSurfaceDestroyed(): void;
            public static RTSP_TRANSPORT_UDP:string;
            public static RTSP_TRANSPORT_TCP:string;
            public static RTSP_TRANSPORT_UDP_MULTICAST:string;
            public static RTSP_TRANSPORT_HTTP:string;

            constructor(context: globalAndroid.content.Context)

            public release():void;
        
            public setInputUrl(inputUrl: any):void;
        
            public setPageUrl(pageUrl: any):void;
        
            public setSwfUrl(swfUrl: any):void;
        
            public setConnArgs(connArgs: any):void;
        
            public setRtspTransport(rtspTransport: any):void;
        
            public setBufferTime(bufferTime:number):void;
        
            public setMaxBufferTime(maxBufferTime:number):void;
        
            public setHWEnable(hwEnable:number):void;
        
            public setAutoReconnectWaitTimeout(autoReconnectWaitTimeout:number) :void;
        
            public setConnectWaitTimeout(connectWaitTimeout:number) :void;
        
            public setCryptoKey(cryptoKey:string):void;
        
            public setAudioEnable(audioEnable:boolean,Converter:boolean):void;
        
            public setVideoEnable(videoEnable:boolean):void;
        
            public setSubscribe(subscribe:boolean):void;
        
        
            public setPlayerView(npv:cn.nodemedia.NodePlayerView):void;
        
            public setNodePlayerDelegate(delegate:cn.nodemedia.NodePlayerDelegate):void;
        
            public start(): number;
        
            public stop(): number;
        
            public pause(): number;
        
            public seekTo(pos:number):number;
        
            public getDuration():number;
        
            public getCurrentPosition():number;
        
            public getBufferPosition():number;
        
            public getBufferPercentage():number;
        
            public isPlaying(): boolean;
        
            public isLive(): boolean;
        }

        export interface NodePlayerDelegate {
            onEventCallback(player:cn.nodemedia.NodePlayer, event:number, msg:string):void;
        }

        export class NodePublisher implements cn.nodemedia.NodeCameraView.NodeCameraViewCallback{
            OnCreate():void;
            OnChange(cameraWidth: number, cameraHeight: number, surfaceWidth: number, surfaceHeight: number):void;
            OnDraw(textureId: number):void;
            OnDestroy():void;
            public static VIDEO_PPRESET_16X9_270:number;
            public static VIDEO_PPRESET_16X9_360:number;
            public static VIDEO_PPRESET_16X9_480:number;
            public static VIDEO_PPRESET_16X9_540:number;
            public static VIDEO_PPRESET_16X9_720:number;
            public static VIDEO_PPRESET_16X9_1080:number;

            public static VIDEO_PPRESET_4X3_270:number;
            public static VIDEO_PPRESET_4X3_360:number;
            public static VIDEO_PPRESET_4X3_480:number;
            public static VIDEO_PPRESET_4X3_540:number;
            public static VIDEO_PPRESET_4X3_720:number;
            public static VIDEO_PPRESET_4X3_1080:number;

            public static VIDEO_PPRESET_1X1_270:number;
            public static VIDEO_PPRESET_1X1_360:number;
            public static VIDEO_PPRESET_1X1_480:number;
            public static VIDEO_PPRESET_1X1_540:number;
            public static VIDEO_PPRESET_1X1_720:number;
            public static VIDEO_PPRESET_1X1_1080:number;

            public static AUDIO_PROFILE_LCAAC:number;
            public static AUDIO_PROFILE_HEAAC:number;
            public static AUDIO_PROFILE_SPEEX:number;

            public static VIDEO_PROFILE_BASELINE:number;
            public static VIDEO_PROFILE_MAIN:number;
            public static VIDEO_PROFILE_HIGH:number;

            public static CAMERA_BACK:number;
            public static CAMERA_FRONT:number;

            public static NM_PIXEL_BGRA:number;
            public static NM_PIXEL_RGBA:number;


            public static PUBLISH_TYPE_LIVE:number
            public static PUBLISH_TYPE_RECORD:number
            public static PUBLISH_TYPE_APPEND:number

            constructor(context: globalAndroid.content.Context)

            public release():void;
        
            public setOutputUrl(outputUrl: any):void;
        
            public setPageUrl(pageUrl: any):void;
        
            public setSwfUrl(swfUrl: any):void;
        
            public setConnArgs(connArgs: any):void;
        
            public setCryptoKey(cryptoKey: any)
        
            public setCameraPreview(cameraPreview:cn.nodemedia.NodeCameraView, cameraID: any, frontMirror: any)
        
            public setAudioParam(bitrate: any, profile: any):void;
        
            public setAudioParam(bitrate: any, profile: any, sampleRate: any):void;
        
            public switchCamera() ;
        
            public startPreview():void;
        
            public stopPreview():void
        
            public setZoomScale(zoomScale: any):void
        
            public setFlashEnable(flashEnable: any):void;
        
            public setAutoFocus(autoFocus: any):void;
            public capturePicture(listener:cn.nodemedia.NodePublisher.CapturePictureListener):void;
        
            public setNodePublisherDelegate(delegate:cn.nodemedia.NodePublisherDelegate):void;
        
            public setVideoParam(preset: any, fps: any, bitrate: any, profile: any, frontMirror: any):void;
        
            public setAutoReconnectWaitTimeout(autoReconnectWaitTimeout: any):void;
        
            public setConnectWaitTimeout(connectWaitTimeout: any):void;
        
            public setBeautyLevel(beautyLevel: any):void;
        
            public setHwEnable(hwEnable: any):void;
        
            public setAudioEnable(audioEnable: any):void;
        
            public setVideoEnable(videoEnable: any):void;
        
            public setDenoiseEnable(denoiseEnable: any):void;
        
            public setDynamicRateEnable(dynamicRateEnable: any):void;
        
            public setKeyFrameInterval(keyFrameInterval: any):void;
        
            public setPublishType(publishType: number):void;
        
            public pushRawvideo(data: any, size: any):void;
        
            public start():void;
        
            public stop():void;
        }

        export namespace NodePublisher{
            export interface CapturePictureListener {
                onCaptureCallback(picture: globalAndroid.graphics.Bitmap):void;
            }

            export class CapturePictureListener {
                onCaptureCallback(picture: globalAndroid.graphics.Bitmap):void;
            }
        }

        export class NodePublisherDelegate{
            onEventCallback(streamer:cn.nodemedia.NodePublisher, event: any, msg: any):void;
        }

        export interface NodePublisherDelegate{
            onEventCallback(streamer:cn.nodemedia.NodePublisher, event: any, msg: any):void;
        }
    }
}