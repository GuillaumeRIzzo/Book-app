export class Gender {
  genderId: number;
  genderUuid: string;
  genderLabel: string;

  constructor(
    genderId: number,
    genderUuid: string,
    genderLabel: string,
  ) {
    this.genderId = genderId;
    this.genderUuid = genderUuid;
    this.genderLabel = genderLabel;
  }
}
