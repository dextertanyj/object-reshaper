export type ExpectEqual<Actual, Expected> = Actual extends Expected
  ? Expected extends Actual
    ? true
    : false
  : false;
