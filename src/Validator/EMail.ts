import { Validator } from "../Parser";

export const emailValidator: Validator<string> = validate;

//
// The following is the code from manishsaraan/email-validator.
// https://github.com/manishsaraan/email-validator
//
// Utilize the code under Public Domain.
// Thank you very much!
//

const tester =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
// https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the
// local part may be up to 64 octets long and the domain may have a maximum of 255 octets.[4]
function validate(email: string) {
  if (!email) return false;

  const emailParts = email.split("@");

  if (emailParts.length !== 2) return false;

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64) {
    return false;
  } else if (address.length > 255) {
    return false;
  }

  const domainParts = address.split(".");

  if (domainParts.some((part) => part.length > 63)) {
    return false;
  }

  return tester.test(email);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;
  describe("emailValidator", () => {
    it("success", () => {
      expect(validate("example@example.com")).toBe(true);
      expect(validate("user.name@domain.co.jp")).toBe(true);
      expect(validate("email@example.org")).toBe(true);
      expect(validate("firstname.lastname@example.com")).toBe(true);
      expect(validate("email@subdomain.example.com")).toBe(true);
      expect(validate("firstname+lastname@example.com")).toBe(true);
      expect(validate("1234567890@example.com")).toBe(true);
    });

    it("failure", () => {
      expect(validate("plainaddress")).toBe(false);
      expect(validate("@no-local-part.com")).toBe(false);
      expect(validate("email.example.co")).toBe(false);
      expect(validate("email@example@example.com")).toBe(false);
      expect(validate(".email@example.com")).toBe(false);
      expect(validate("email.@example.com")).toBe(false);
      expect(validate("email..email@example.com")).toBe(false);
      expect(validate("あいうえお@example.com")).toBe(false);
      expect(validate("email@example.com (Joe Smith)")).toBe(false);
      expect(validate("email@example")).toBe(false);
      expect(validate("email@[123.123.123.123]")).toBe(false);
      expect(validate('"email"@example.com')).toBe(false);
    });
  });
}
