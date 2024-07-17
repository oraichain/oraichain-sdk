type DecimalLike = string | number | bigint | BigDecimal;

export class BigDecimal {
  private bigInt: bigint;
  private _decimals: number;

  constructor(value: DecimalLike, decimals?: number) {
    if (value instanceof BigDecimal) {
      this.bigInt = value.bigInt;
      this._decimals = value._decimals;
      return;
    }

    // default is 6
    this._decimals = decimals ?? 6;

    if (typeof value === "bigint") {
      this.bigInt = value * 10n ** BigInt(this._decimals);
      return;
    }

    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error("value is not `DecimalLike`");
    }

    const [ints, decis] = value.toString().split(".");

    // when decis > 6 and not set, we use it to remain the precision
    if (decis?.length > this._decimals && !decimals) {
      this.bigInt = BigInt(ints + decis);
      this._decimals = decis.length;
      return;
    }

    const padding = decis
      ? decis.padEnd(this._decimals, "0").substring(0, this._decimals)
      : "0".repeat(this._decimals);
    this.bigInt = BigInt(ints + padding);
  }

  public get decimals() {
    return this._decimals;
  }

  private processDecimal(value: DecimalLike): BigDecimal {
    if (value instanceof BigDecimal) {
      if (value._decimals > this._decimals) {
        this.bigInt *= 10n ** BigInt(value._decimals - this._decimals);
        this._decimals = value._decimals;
      } else if (this._decimals > value._decimals) {
        value.bigInt *= 10n ** BigInt(this._decimals - value._decimals);
        value._decimals = this._decimals;
      }
      // same decimal
      return value;
    }
    return new BigDecimal(value, this._decimals);
  }

  toString() {
    let str = this.bigInt.toString();
    let ret = "";
    // minus
    if (str[0] === "-") {
      ret += "-";
      str = str.substring(1);
    }

    const padStartLen = this._decimals - str.length;

    if (padStartLen >= 0) {
      // need padding some
      if (padStartLen > 0) str = "0".repeat(padStartLen) + str;
      // the nominator is 0
      ret += "0";
    } else {
      // get the nominator part
      ret += str.slice(0, -this._decimals);
    }

    let denominator = str.slice(-this._decimals).replace(/0+$/, "");
    if (denominator) {
      ret += "." + denominator;
    }

    return ret;
  }

  toNumber() {
    return Number(this.toString());
  }

  clone(): BigDecimal {
    return new BigDecimal(this);
  }

  private iadd(other: DecimalLike) {
    const otherDecimal = this.processDecimal(other);
    this.bigInt += otherDecimal.bigInt;
    return this;
  }

  private isub(other: DecimalLike) {
    const otherDecimal = this.processDecimal(other);
    this.bigInt -= otherDecimal.bigInt;
    return this;
  }

  private idiv(other: DecimalLike) {
    const otherDecimal = this.processDecimal(other);
    this.bigInt =
      (this.bigInt * 10n ** BigInt(this._decimals)) / otherDecimal.bigInt;
    return this;
  }

  private imul(other: DecimalLike) {
    const otherDecimal = this.processDecimal(other);
    this.bigInt =
      (this.bigInt * otherDecimal.bigInt) / 10n ** BigInt(this._decimals);
    return this;
  }

  private ipow(other: bigint | boolean | number | string) {
    const coeff = 10n ** BigInt(this._decimals);
    const power = BigInt(other);
    this.bigInt = this.bigInt ** power / coeff ** (power - 1n);
    return this;
  }

  static rootNth(value: DecimalLike, k = 2n) {
    const big = new BigDecimal(value);

    // re-calculate bigInt
    const bigValue = big.bigInt * 10n ** BigInt(big._decimals);
    if (bigValue < 0n) {
      throw "negative number is not supported";
    }

    let o = 0n;
    let x = bigValue;
    let limit = 100;

    while (x ** k !== k && x !== o && --limit) {
      o = x;
      x = ((k - 1n) * x + bigValue / x ** (k - 1n)) / k;
    }

    big.bigInt = x;
    return big;
  }

  static sqrt(value: DecimalLike) {
    return BigDecimal.rootNth(value);
  }

  sqrt() {
    return BigDecimal.rootNth(this);
  }

  add(other: DecimalLike) {
    return this.clone().iadd(other);
  }

  sub(other: DecimalLike) {
    return this.clone().isub(other);
  }

  div(other: DecimalLike) {
    return this.clone().idiv(other);
  }

  mul(other: DecimalLike) {
    return this.clone().imul(other);
  }

  mulByRatio(numerator: DecimalLike, denominator: DecimalLike) {
    if (denominator === "0" || denominator === 0 || denominator === BigInt(0)) {
      throw new Error("Denominator cannot be zero");
    }
    return this.clone().imul(numerator).idiv(denominator);
  }

  pow(other: bigint | boolean | number | string) {
    return this.clone().ipow(other);
  }

  valueOf() {
    return this.toNumber();
  }
}
