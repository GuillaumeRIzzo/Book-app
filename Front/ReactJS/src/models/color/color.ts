export class Color {
  colorId: number;
  colorUuid: string;
  colorName: string;
  colorHex: string;

  constructor(
    colorId: number,
    colorUuid: string,
    colorName: string,
    colrHex: string,
  ) {
    this.colorId = colorId;
    this.colorUuid = colorUuid;
    this.colorName = colorName;
    this.colorHex = colrHex;
  }
}
