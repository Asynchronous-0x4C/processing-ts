export class Cursor{
  public static readonly CUSTOM_CURSOR=-1;
  public static readonly DEFAULT_CURSOR=0;
  public static readonly CROSSHAIR_CURSOR=1;
  public static readonly TEXT_CURSOR=2;
  public static readonly WAIT_CURSOR=3;
  public static readonly SW_RESIZE_CURSOR=4;
  public static readonly SE_RESIZE_CURSOR=5;
  public static readonly NW_RESIZE_CURSOR=6;
  public static readonly NE_RESIZE_CURSOR=7;
  public static readonly N_RESIZE_CURSOR=8;
  public static readonly S_RESIZE_CURSOR=9;
  public static readonly W_RESIZE_CURSOR=10;
  public static readonly E_RESIZE_CURSOR=11;
  public static readonly HAND_CURSOR=12;
  public static readonly MOVE_CURSOR=13;

  private type:number;

  constructor(type:number){
    this.type=type;
  }

  getType(){
    return this.type;
  }
}