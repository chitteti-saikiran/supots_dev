declare namespace com {
  namespace peekandpop {
    namespace shalskar {
      namespace peekandpop {
        export namespace model {
          export class HoldAndReleaseView { }
        }
        export class PeekAndPop {
          public static FLING_UPWARDS: number;
          public static FLING_DOWNWARDS: number;

          public constructor(builder: any);

          public sendOnLongHoldEvent(view: globalAndroid.view.View, position: number): void;
          public destroy(): void;
          public setFlingTypes(allowUpwardsFling: boolean, allowDownwardsFling: boolean): void;

          public setCurrentHoldAndReleaseView(currentHoldAndReleaseView: com.peekandpop.shalskar.peekandpop.model.HoldAndReleaseView): void;

          //public setOnFlingToActionListener(@Nullable OnFlingToActionListener onFlingToActionListener): void;

          public setOnGeneralActionListener(onGeneralActionListener: globalAndroid.view.GestureDetector.OnGestureListener): void;

          public setOnLongHoldListener(onLongHoldListener: globalAndroid.view.View.OnLongClickListener): void;

          //public setOnHoldAndReleaseListener(@Nullable OnHoldAndReleaseListener onHoldAndReleaseListener:globalAndroid.view.GestureDetector.): void;
        }

        export namespace PeekAndPop {
          export interface FlingDirections {
          }
        }
      }
    }
  }
}
