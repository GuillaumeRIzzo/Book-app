export class Tag {
  tagId: number;
  tagUuid: string;
  tagLabel: string;

  constructor(
    tagId: number,
    tagUuid: string,
    tagLabel: string,
  ) {
    this.tagId = tagId;
    this.tagUuid = tagUuid;
    this.tagLabel = tagLabel;
  }
}
