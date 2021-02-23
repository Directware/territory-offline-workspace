import {DateNotOlderThanPipe} from './date-not-older-than.pipe';
import {DatePipe} from "@angular/common";

describe('DateNotOlderThanPipe', () =>
{
  let pipe: DateNotOlderThanPipe;

  beforeEach(() =>
  {
    pipe = new DateNotOlderThanPipe();
  })

  it('create an instance', () =>
  {
    expect(pipe).toBeTruthy();
  });

  it('should show Ella´s birthday', () =>
  {
    expect(pipe.transform(new Date(2021, 1, 14))).toBe("14.02.2021");
  });

  it('should show nothing earlier than 5 years', () =>
  {
    const today = new Date();
    const withinFiveYears = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    const overFiveYears = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate() - 1);

    const year = today.getFullYear() - 5;
    const month = today.getMonth() + 1;
    const day = today.getDate();

    expect(pipe.transform(withinFiveYears, 5)).toBe(`${day}.${month.toString(10).padStart(2, "0")}.${year}`);
    expect(pipe.transform(overFiveYears, 5)).toBe("");
  });
});
