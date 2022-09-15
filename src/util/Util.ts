export default class Util {
  /**
    * @name hash
    * @description Random hashing algorithm I found on Stack Overflow.
    * @param timeInSec
    * @returns time in HH:MM:SS
    */
  static toHHMMSS(timeInSec: number | string) {
    const time = typeof timeInSec === 'number' ? timeInSec : parseInt(timeInSec, 10);
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = time % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? `0${v}` : v))
      .join(':');
  }

  static toSec(hhmmss: string) {
    const time = hhmmss.split(':');
    if (time.length === 3) return (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);
    if (time.length === 2) return (+time[0]) * 60 + (+time[1]);
    return (+time[0]);
  }
}
