import { BigDecimal } from "../src/helpers/bigdecimal";
import { expect, afterAll, beforeAll, describe, it } from "vitest";

describe("add", function () {
  it("should be defined", function () {
    expect(BigDecimal.prototype.add).toBeDefined();
  });

  it("should: 12+13 = 25", function () {
    expect(new BigDecimal("12").add("13").toString()).toBe("25");
  });

  it("should: 12-13 = -1", function () {
    expect(new BigDecimal("12").add("-13").toString()).toBe("-1");
  });

  it("should: 12.12+13.94 = 26.06", function () {
    expect(new BigDecimal("12.12").add("13.94").toString()).toBe("26.06");
  });

  it("should: 12-135 = -123", function () {
    expect(new BigDecimal("12").add("-135").toString()).toBe("-123");
  });

  it("should: 12.67+13 = 25.67", function () {
    expect(new BigDecimal("12.67").add("13").toString()).toBe("25.67");
  });

  it("should: -12.67+13 = 0.33", function () {
    expect(new BigDecimal("-12.67").add("13").toString()).toBe("0.33");
  });

  it("should: 12.67-13 = -0.33", function () {
    expect(new BigDecimal("12.67").add("-13").toString()).toBe("-0.33");
  });

  it("should: 0.012-0.013 = -0.001", function () {
    expect(new BigDecimal("0.012").add("-0.013").toString()).toBe("-0.001");
  });

  it("should: -12.67-13 = -0.33", function () {
    expect(new BigDecimal("-12.67").add("-13").toString()).toBe("-25.67");
  });

  it("should: 12.67+.13 = 12.8", function () {
    expect(new BigDecimal("12.67").add(".13").toString()).toBe("12.8");
  });

  it("should: 100-12 = 88", function () {
    expect(new BigDecimal("100").add("-12").toString()).toBe("88");
  });

  it("should: 126.7-13 = 113.7", function () {
    expect(new BigDecimal("126.7").add("-13").toString()).toBe("113.7");
  });
  it("should: 12.67-130.7 = -118.03", function () {
    expect(new BigDecimal("12.67").add("-130.7").toString()).toBe("-118.03");
  });
  it("should: 10+(-0) = 10", function () {
    expect(new BigDecimal("10").add("-0").toString()).toBe("10");
  });
});

describe("subtract", function () {
  it("should be defined", function () {
    expect(BigDecimal.prototype.sub).toBeDefined();
  });

  it("should: 12-13 = -1", function () {
    expect(new BigDecimal("12").sub("13").toString()).toBe("-1");
  });

  it("should: 12.67-13 = -0.33", function () {
    expect(new BigDecimal("12.67").sub("13").toString()).toBe("-0.33");
  });

  it("should: 12.67-.13 = 12.54", function () {
    expect(new BigDecimal("12.67").sub(".13").toString()).toBe("12.54");
  });

  it("should: 100-12 = 88", function () {
    expect(new BigDecimal("100").sub("12").toString()).toBe("88");
  });

  it("should: 126.7-13 = 113.7", function () {
    expect(new BigDecimal("126.7").sub("13").toString()).toBe("113.7");
  });
  it("should: 12.67-130.7 = -118.03", function () {
    expect(new BigDecimal("12.67").sub("130.7").toString()).toBe("-118.03");
  });
});

describe("divide", function () {
  it("should be defined", function () {
    expect(BigDecimal.prototype.div).toBeDefined();
  });

  it("test failing scenario", function () {
    expect(
      new BigDecimal("509365950.27576", 18)
        .div("0.003802940215600348")
        .toString()
    ).toBe("133940036234.660966692739280406");
  });
  it("should do basic integer division", function () {
    expect(new BigDecimal(1234).div(12).toNumber().toFixed(2)).toBe("102.83");
  });
  it("should do basic floating point division", function () {
    expect(new BigDecimal(12.34).div(12).toNumber().toFixed(2)).toBe("1.03");
  });
  it("should do basic floating point division big", function () {
    expect(
      new BigDecimal("29629629362962961839.48344234")
        .div(12345678901234567890n)
        .toNumber()
        .toFixed(2)
    ).toBe("2.40");
  });
  it("should do basic floating point division", function () {
    expect(
      new BigDecimal(
        "296296293629629614563475463462345345235412412341235436563456829629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683939296296293629629614563475463462345345235412412341235436563456829629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683939.48344234",
        10
      )
        .div("1000")
        .toString()
    ).toBe(
      "296296293629629614563475463462345345235412412341235436563456829629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683939296296293629629614563475463462345345235412412341235436563456829629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683929629629362962961456347546346234534523541241234123543656345683.9394834423"
    );
  });
  it("should do basic floating point division", function () {
    expect(new BigDecimal(45).div(-4).toString()).toBe("-11.25");
  });
  it("should do basic floating point division", function () {
    expect(new BigDecimal(-45).div(-4).toString()).toBe("11.25");
  });
  it("1 / 25 = 0.04", function () {
    expect(new BigDecimal("1").div("25").toString()).toBe("0.04");
  });
  it("-1 / 25 = -0.04", function () {
    expect(new BigDecimal("-1").div("25").toString()).toBe("-0.04");
  });
  it("1 / -25 = -0.04", function () {
    expect(new BigDecimal("1").div("-25").toString()).toBe("-0.04");
  });
  it("-1 / -25 = 0.04", function () {
    expect(new BigDecimal("-1").div("-25").toString()).toBe("0.04");
  });
  it("-1 / -1 = 1", function () {
    expect(new BigDecimal("-1").div("-1").toString()).toBe("1");
  });
  it("10.8 / 10 = 1.08", function () {
    expect(new BigDecimal("10.8").div("10").toString()).toBe("1.08");
  });
  it("10.8 / 100 = 0.108", function () {
    expect(new BigDecimal("10.8").div("100").toString()).toBe("0.108");
  });
  it("10.8 / 1000 = 0.0108", function () {
    expect(new BigDecimal("10.8").div("1000").toString()).toBe("0.0108");
  });
  it("10.8 / 10000 = 0.00108", function () {
    expect(new BigDecimal("10.8").div("10000").toString()).toBe("0.00108");
  });
  it("2.00 / 0.5 = 4", function () {
    expect(new BigDecimal("2.00").div("0.5").toString()).toBe("4");
  });
  it("0.11005 / 0.1 = 1.1005", function () {
    expect(new BigDecimal("0.11005").div("0.1").toString()).toBe("1.1005");
  });
  it("123456789.123456 / .0123456 = 10000063919.409020217", function () {
    expect(
      new BigDecimal("123456789.123456", 9).div(".0123456").toString()
    ).toBe("10000063919.409020217");
  });
  // round up with precision 8
  it(".102 / .0383292 = 2.66115651", function () {
    expect(
      new BigDecimal(".102", 9).div(".0383292").toNumber().toFixed(8)
    ).toBe("2.66115651");
  });
});

describe("multiply", function () {
  it("should be defined", function () {
    expect(BigDecimal.prototype.mul).toBeDefined();
  });

  it("should: 12 * 13 = 156", function () {
    expect(new BigDecimal("12").mul("13").toString()).toBe("156");
  });

  it("should: 12 * 0 = 0", function () {
    expect(new BigDecimal("12").mul("0").toString()).toBe("0");
  });

  it("should: 13 * 130 = 1690", function () {
    expect(new BigDecimal("13").mul("130").toString()).toBe("1690");
  });

  it("should: 0.13 * 0.00130 = 0.000169", function () {
    expect(new BigDecimal("0.13").mul("0.00130").toString()).toBe("0.000169");
  });

  it("should: 0.5 * 0.2 = 0.1", function () {
    expect(new BigDecimal("0.5").mul("0.2").toString()).toBe("0.1");
  });

  it("should: 0.05 * 0.02 = 0.001", function () {
    expect(new BigDecimal("0.05").mul("0.02").toString()).toBe("0.001");
  });

  it("should: 0.5 * 0.02 = 0.01", function () {
    expect(new BigDecimal("0.5").mul("0.02").toString()).toBe("0.01");
  });

  it("should: -0.13 * 0.00130 = -0.000169", function () {
    expect(new BigDecimal("-0.13").mul("0.00130").toString()).toBe("-0.000169");
  });

  it("should: 0.5 * -0.2 = -0.1", function () {
    expect(new BigDecimal("0.5").mul("-0.2").toString()).toBe("-0.1");
  });

  it("should: -0.05 * -0.02 = 0.001", function () {
    expect(new BigDecimal("-0.05").mul("-0.02").toString()).toBe("0.001");
  });

  it("should: -12 * 13 = -156", function () {
    expect(new BigDecimal("-12").mul("13").toString()).toBe("-156");
  });

  it("should: -12 * 0 = 0", function () {
    expect(new BigDecimal("-12").mul("0").toString()).toBe("0");
  });

  it("should: 12 * -0 = 0", function () {
    expect(new BigDecimal("12").mul("-0").toString()).toBe("0");
  });

  it("should: -12 * -0 = 0", function () {
    expect(new BigDecimal("-12").mul("-0").toString()).toBe("0");
  });
  it("should: -0.0000005 * 13 = -0.0000065", function () {
    expect(new BigDecimal("-0.0000005", 8).mul("13").toString()).toBe(
      "-0.0000065"
    );
  });
});

describe("mulByRatio", function () {
  it("should be defined", function () {
    expect(BigDecimal.prototype.mulByRatio).toBeDefined();
  });

  it("should: 12 / 10 /10 = 12", function () {
    expect(new BigDecimal("12").mulByRatio("10", "10").toString()).toBe("12");
  });

  it("should: 12 / 0.1 / 0.2 = 24", function () {
    expect(new BigDecimal("12").mulByRatio("0.1", "0.2").toString()).toBe("6");
  });

  it("10.8 / 0.00001 / 100 = 108000000", function () {
    expect(
      new BigDecimal("10.8", 9).mulByRatio("0.00001", "100").toString()
    ).toBe("0.00000108");
  });

  it("123456789.123456 / (.0123456 / .1245) = 12242153.701225204", function () {
    expect(
      new BigDecimal("123456789.123456", 9)
        .mulByRatio(".0123456", ".1245")
        .toString()
    ).toBe("12242153.701225204");
  });

  it("should throw an error when the denominator is zero", function () {
    expect(() => new BigDecimal("12").mulByRatio("10", "0")).toThrow(
      "Denominator cannot be zero"
    );
  });
});
